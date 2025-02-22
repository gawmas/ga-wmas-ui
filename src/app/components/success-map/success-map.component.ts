import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, ViewChild, inject, signal } from "@angular/core";
import { LegendCategory, MapData, MapDataResult, Season, WeaponResult, WmaCoord } from "@model";
import { SuccessMapFiltersComponent } from "./success-map-filters.component";
import { SHARED_MODULES } from "@shared-imports";
import { Store } from "@ngrx/store";
import { AppStateInterface } from "@store-model";
import { LoadingComponent } from "_shared/components/loading.component";
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { NgIconComponent } from '@ng-icons/core';
import { SuccessMapHuntResultsComponent } from "./success-map-hunt-results.component";
import * as L from 'leaflet';
import * as successMapActions from 'store/successMap/successMap.actions';
import * as successMapSelectors from 'store/successMap/successMap.selectors';
import { SuccessMapFiltersModalComponent } from "./success-map-filters-modal.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SHARED_MODULES, SuccessMapFiltersComponent, SuccessMapHuntResultsComponent,
    LoadingComponent, SuccessMapFiltersModalComponent],
  template: `
    @if (loading$ | async) {
      <gawmas-loading />
    }

    <!-- Filter modal (mobile) -->
    <gawmas-success-map-filters-modal #filtersModal (closeEvent)="modalClosed()" />

    <!-- Results modal -->
    <gawmas-success-map-hunt-results #resultsModal (closeEvent)="modalClosed()" />

    <div class="block md:flex md:pl-1 md:pb-1">
      <div class="hidden md:visible md:inline-block w-56 transition-transform -translate-x-full sm:translate-x-0">
        <div class="h-[75vh] bg-gray-900 text-gray-200 px-2 rounded-bl-xl rounded-tl-xl mt-1 md:border-t md:border-l md:border-b border-gray-500">
          <!-- Filters -->
          <gawmas-success-map-filters />
        </div>
      </div>

      <div id="map" class="md:flex-1 ml-0 flex-1 md:mt-1 md:border-t md:border-r md:border-b border-gray-500 md:rounded-br-xl md:rounded-tr-xl h-[75vh] w-full {{ mapVisible() ? 'visible' : 'hidden' }}">
        <!-- Map -->
      </div>
    </div>
  `
})
export class SuccessMapComponent implements AfterViewInit, OnDestroy {

  @ViewChild('resultsModal') resultsModal: SuccessMapHuntResultsComponent | undefined;
  @ViewChild('filtersModal') filtersModal: SuccessMapFiltersModalComponent | undefined;

  private _store = inject(Store<AppStateInterface>);
  private _cdr = inject(ChangeDetectorRef);

  wmaCoords: WmaCoord[] | undefined;
  mapDataResult: MapDataResult | undefined;

  loading$ = this._store.select(successMapSelectors.selectSuccessMapLoading);
  mapChanges$ = this._store.select(successMapSelectors.selectChanges);

  // Map shit ...
  private _map!: L.Map;
  private _markers: L.CircleMarker[] = [];
  private _legend = (L as any).control({ position: 'topright' });
  private _title = (L as any).control({ position: 'topright' });
  private _mapCtrls = (L as any).control({ positision: 'topright' });
  private _openFilters = (L as any).control({ position: 'bottomleft' });

  mapVisible = signal(true);
  legendVisible = signal(true);

  private _circleColors = [
    '#e2e8f0',
    '#fde68a',
    '#facc15',
    '#f59e0b',
    '#fca5a5',
    '#f87171',
    '#dc2626',
    '#d9f99d',
    '#22c55e',
    '#a21caf'
  ];

  private _destroyed$ = new Subject<void>();

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void {

    this._store.dispatch(successMapActions.enterSuccessMap());

    this._setUpMap();

    this.mapChanges$.pipe(
      takeUntil(this._destroyed$),
      distinctUntilChanged()
    ).subscribe(({ wmaCoords, seasons, selectedSeason, mapData, weapon, zoomFull, showLegend, mapTitle }) => {

      // console.log({ wmaCoords, seasons, selectedSeason, mapData, weapon, zoomFull, showLegend, mapTitle });

      if (mapData?.weapons.length &&
          weapon! > -1 &&
          wmaCoords?.length > 0 &&
          selectedSeason! > -1 &&
          seasons &&
          zoomFull !== undefined &&
          showLegend !== undefined) {

        this.wmaCoords = wmaCoords;
        this.mapDataResult = mapData;

        this._markers.forEach(marker => marker.remove());
        this._markers = [];

        const weaponName = (this.mapDataResult.weapons.find(w => w.weaponId === weapon) as WeaponResult).weapon;
        const weaponData = (this.mapDataResult.weapons.find(w => w.weaponId === weapon) as WeaponResult).data;
        let categories: LegendCategory[] = this._categorizeResults(weaponData, this.mapDataResult.type);

        this._buildMapMarkers(
          weaponData,
          categories,
          seasons.find(s => s.id === selectedSeason)!,
          this.mapDataResult.type,
          weaponName,
          weapon);

        this._addTitle(mapTitle, selectedSeason, seasons);

        this._addMapCtrls();

        if (zoomFull) {
          this._centerMap();
        }

        if (showLegend !== undefined) {
          this._buildLegend(showLegend, categories, this.mapDataResult.type);
        }

        this._cdr.detectChanges();

      }
    });

  }

  private _addTitle(title: string, selectedSeason: number, seasons: Season[]) {
    // console.log(title, selectedSeason, seasons.length);
    this._title.remove();
    this._title.onAdd = () => {
      let titleElement = L.DomUtil.create('div', 'bg-gradient-to-l from-gawmas-green to-transparent from-20% to-80% text-gray-200 p-2 rounded-tr-xl text-xs md:text-sm md:min-w-[650px] border-b border-gray-600');
      let seasonChip = `<span class="chip result-chip chip-season mr-1">${seasons.find(s => s.id === selectedSeason)?.season}</span>`
      let titleText = `<h3 class="italic underline font-bold inline-block text-sm md:text-lg">${title}</h3>`;
      titleElement.innerHTML += `<span class="flex items-center justify-end">${seasonChip} ${titleText}</span>`;
      return titleElement;
    };
    this._title.addTo(this._map);
  }

  private _addMapCtrls() {
    this._mapCtrls.remove();
    this._mapCtrls.onAdd = () => {
      let mapCtrlsElement = L.DomUtil.create('div', 'map-ctrls');
      const fullExtentButton = `<button class="zoomFull"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="zoomFull size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg><span class="zoomFull">Full Extent</span></button>`;
      const legendButton = `<button class="legendToggle"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="legendToggle size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg><span class="legendToggle">Toggle Legend</span></button>`
      const zoomInButton = `<button class="zoomIn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="zoomIn size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" /></svg><span class="zoomIn">Zoom In</span></button>`
      const zoomOutButton = `<button class="zoomOut"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="zoomOut size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" /></svg><span class="zoomOut">Zoom Out</span></button>`;
      mapCtrlsElement.innerHTML += `${zoomInButton}${zoomOutButton}${fullExtentButton}${legendButton}`;
      return mapCtrlsElement;
    }
    this._mapCtrls.addTo(this._map);
  }

  private _addGeorgiaBoundary() {
    const geoJsonLayer = L.geoJson(undefined, {
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(feature.properties.name);
        }
      },
      style: {
        fillColor: 'transparent',
        color: '#CCCCCC',
        weight: 2
      },
    });

    fetch('assets/ga.geojson')
      .then(response => response.json())
      .then(data => {
        geoJsonLayer.addData(data);
        geoJsonLayer.addTo(this._map);
      })
  }

  private _setUpMap() {
    if (!this._map) {

      const baseMapURL = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
      this._map = L.map('map', {
        zoomControl: false
      }).setView([32.84043455143557, -81.38420102863284], 7); //32.6782, -83.2220
      L.tileLayer(baseMapURL).addTo(this._map);

      this._map.on('zoomend', () => {
        this._store.dispatch(successMapActions.userZoomed());
      });

      this._addGeorgiaBoundary();

      this._openFilters.onAdd = () => {
        let openFiltersElement = L.DomUtil.create('button', 'btn btn-primary btn-mini animate-jump-in animate-delay-100 animate-once md:invisible visible openFilters');
        openFiltersElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>&nbsp;Map Type<div class="count-badge">1</div>`;
        return openFiltersElement;
      };
      this._openFilters.addTo(this._map);

    }
  }

  private _buildMapMarkers(data: MapData[], categories: LegendCategory[], season: Season, type: string, weapon: string, weaponId: number) {

    const categoriesWithColors = categories.map((c: LegendCategory, i: number) => ({ ...c, color: this._circleColors[i] }));

    // Create markers and bind popups
    this.wmaCoords!.forEach(coord => {

      const item: MapData | undefined = data.find(s => s.id === coord.id);

      if (item) {
        const marker = L.circleMarker([coord.lat, coord.lng], {
          radius: categories.find((cat: any) => item.value >= cat.min && item.value <= cat.max)?.factor || 7,
          stroke: false,
          opacity: 1,
          fill: true,
          fillColor: categoriesWithColors.find((cat: any) => item.value >= cat.min && item.value <= cat.max)?.color || '#000000',
          fillOpacity: 0.7
        }).addTo(this._map);

        const valueLabel = type === 'success' ? 'Success Rate' : type === 'harvest' ? 'Total Harvest' : 'Harvest Rate';
        const valueSuffix = type === 'success' ? '%' : type === 'harvest' ? ' deer' : ' deer / 100 acres';

        marker.bindPopup(`
          <div class="uppercase font-bold border-b border-gray-500 mb-1">${coord.name}</div>
          <div class="flex items-center">
            <span>${season.season}</span>,
            <span class="font-semibold ml-1">${weapon === 'Total' ? 'All Weapons' : weapon}</span>
          </div>
          <div class="flex items-center">
            <span>${valueLabel}:</span>
            <span class="font-semibold pl-1">${item.value || 0}${valueSuffix}</span>
          </div>
          <div class="text-center mt-2">
            <button type="button" data="${coord.id}, ${season.id}, ${weaponId !== 0 ? weaponId : ''}"
              class="resultsButton px-2 py-1 text-xs uppercase font-medium text-center inline-flex items-center text-white rounded-full focus:ring-1 focus:outline-none bg-gray-600 hover:bg-gray-700 focus:ring-white">
                  View Results
            </button>
          </div>
        `);

        this._markers.push(marker);

      }
    });
  }

  private _buildLegend(show: boolean, categories: LegendCategory[], type: string) {

    this._legend.remove();

    this._legend.onAdd = () => {

      let lgd = L.DomUtil.create('div', 'info legend'),
        grades = categories.map((c: any) => c.min),
        labels = [];

      let title = ''
      switch (type) {
        case 'success':
          title = 'Success Rate (&percnt;)';
          break;
        case 'harvest':
          title = 'Total Harvest'
          break;
        case 'harvestrate':
          title = '*Harvest Rate';
          break;
      }

      let legendHtml = '';
      legendHtml = `<h4>${title}</h4>`;
      if (type === 'harvestrate') {
        legendHtml += `<div class="italic text-xs mt-0">* deer per 100 acres</div>`;
      }
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        legendHtml +=
          `<div style="clear: both; margin-bottom: 3px;">
            <span style="background: ${this._circleColors[i]}; opacity: 0.7; border-radius: 50%; height: 18px; width: 18px; display: inline-block; vertical-align: middle"></span>
            <span style="vertical-align: middle">`;

        switch (type) {
          case 'success':
            legendHtml += `${parseFloat(grades[i]).toFixed(0)}${(grades[i + 1] ? ' &ndash; ' + parseFloat(grades[i + 1]).toFixed(0) + '&percnt;' : '&percnt;+')}`
            break;
          case 'harvest':
            legendHtml += `${parseFloat(grades[i]).toFixed(0)}${(grades[i + 1] ? ' &ndash; ' + parseFloat(grades[i + 1]).toFixed(0) : '+')}`
            break;
          case 'harvestrate':
            legendHtml += `${parseFloat(grades[i]).toFixed(3)}${(grades[i + 1] ? ' &ndash; ' + parseFloat(grades[i + 1]).toFixed(3) : '+')}`
            break;
        }

        legendHtml += '</span></div>';
      }
      // console.log(lgd);
      lgd.innerHTML = legendHtml;
      return lgd;
    };

    if (show) {
      this._legend.addTo(this._map);
    }

    this.legendVisible.set(show);

  }

  private _categorizeResults(data: MapData[], type: string): LegendCategory[] {

    // Calculate the range and step size for categorization
    let maxSuccess = Math.max(...data.map(d => d.value));
    let minSuccess = 0.00;
    let rangeSize = (maxSuccess - minSuccess) / 10;
    let categories: any = [];

    // Initialize categories
    for (let i = 0; i < 10; i++) {
      categories[i] = {
        min: parseFloat((minSuccess + rangeSize * i).toFixed(2)),
        max: parseFloat((minSuccess + rangeSize * (i + 1)).toFixed(2)),
        factor: +((i + 1) * 7).toFixed(2).toString()
      };
    }

    return categories;
  }

  private _centerMap() {
    this._markers.forEach(marker => marker.addTo(this._map));
    const bounds = L.latLngBounds(this._markers.map(marker => marker.getLatLng()));
    this._map.fitBounds(bounds);
    this._map.setView([32.84043455143557, -81.38420102863284], 7);
  }

  openResults() {
    this.resultsModal?.open();
    this.toggleMapViz();
  }

  @HostListener('document:click', ['$event'])
  bindResultsEvent(event: any) {
    // console.log(event.target.classList);
    if (event.target.classList.contains("resultsButton")) { // Hunt Results button ...
      const data = (event.target as HTMLElement).getAttribute("data")?.split(',');
      this._store.dispatch(
        successMapActions.getWmaResults({
          filter: {
            wmas: [+data![0]],
            seasons: [+data![1]],
            weapons: +data![2] === 0 ? [] : [+data![2]],
            skip: 0,
            sort: ''
          }
        }));
      this.openResults();
    } else if (event.target.classList.contains("zoomFull")) { // Full Extent button ...
      this._store.dispatch(successMapActions.setZoomFull({ value: true }));
    } else if (event.target.classList.contains("legendToggle")) { // Legend button ...
      this._store.dispatch(successMapActions.showLegend({ value: !this.legendVisible() }));
    } else if (event.target.classList.contains("zoomIn")) { // Zoom In button ...
      this._map.setZoom(this._map.getZoom() + 1);
    } else if (event.target.classList.contains("zoomOut")) { // Zoom Out button ...
      this._map.setZoom(this._map.getZoom() - 1);
    } else if (event.target.classList.contains("openFilters")) { // Open Filters button ...
      this.toggleMapViz();
      this.filtersModal?.open();
    }
  }

  toggleMapViz(): void {
    this.mapVisible.set(!this.mapVisible());
  }

  modalClosed() {
    this.toggleMapViz();
  }

}

