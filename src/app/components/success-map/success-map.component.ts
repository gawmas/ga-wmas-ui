import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { LegendCategory, MapData, MapDataResult, Season, WeaponResult, WmaCoord } from "@model";
import { SuccessMapFiltersComponent } from "./success-map-filters.component";
import { SHARED_MODULES } from "@shared-imports";
import { Store } from "@ngrx/store";
import { AppStateInterface } from "@store-model";
import { LoadingComponent } from "_shared/components/loading.component";
import { Subject, distinctUntilChanged, takeUntil, tap } from 'rxjs';
import { NgIconComponent } from '@ng-icons/core';
import * as L from 'leaflet';
import * as successMapActions from 'store/successMap/successMap.actions';
import * as successMapSelectors from 'store/successMap/successMap.selectors';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SHARED_MODULES, SuccessMapFiltersComponent, LoadingComponent, NgIconComponent],
  template: `
    @if (loading$ | async) {
      <gawmas-loading />
    }
    <gawmas-success-map-filters />
    <div id="map" class="h-[80vh] rounded-br-2xl rounded-tr-2xl border-r border-t border-b border-gray-700 m-2"></div>
  `
})
export class SuccessMapComponent implements OnInit, OnDestroy {

  private _store = inject(Store<AppStateInterface>);
  private _cdr = inject(ChangeDetectorRef);

  wmaCoords: WmaCoord[] | undefined;
  mapDataResult: MapDataResult | undefined;

  loading$ = this._store.select(successMapSelectors.selectSuccessMapLoading);

  // Map shit ...
  private map!: L.Map;
  private markers: L.CircleMarker[] = [];
  private legend = (L as any).control({ position: 'topright' });
  currentZoom = signal<number>(0);

  private circleColors = [
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

  private destroyed$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {

    this._store.dispatch(successMapActions.enterSuccessMap());

    this.setUpMap();

    this._store.select(successMapSelectors.selectChanges)
      .pipe(
        takeUntil(this.destroyed$),
        distinctUntilChanged()
      ).subscribe(({ wmaCoords, seasons, selectedSeason, mapData, weapon }) => {

        if (mapData?.weapons.length && weapon! > -1 && wmaCoords?.length > 0 && selectedSeason! > -1 && seasons) {

          this.wmaCoords = wmaCoords;
          this.mapDataResult = mapData;

          this.markers.forEach(marker => marker.remove());
          this.markers = [];

          const weaponName = (this.mapDataResult.weapons.find(w => w.weaponId === weapon) as WeaponResult).weapon;
          const weaponData = (this.mapDataResult.weapons.find(w => w.weaponId === weapon) as WeaponResult).data;
          let categories: LegendCategory[] = this.categorizeResults(weaponData, this.mapDataResult.type);

          this.buildMapMarkers(
            weaponData,
            categories,
            seasons.find(s => s.id === selectedSeason)!,
            this.mapDataResult.type,
            weaponName);

          this.buildLegend(categories, this.mapDataResult.type);

          this.centerMap();

          this._cdr.detectChanges();
        }
      });

  }

  private addGeorgiaBoundary() {
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
        geoJsonLayer.addTo(this.map);
      })
  }

  private setUpMap() {
    if (!this.map) {

      const baseMapURL = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
      this.map = L.map('map', {
        zoomControl: false
      }).setView([32.6782, -83.2220], 8);
      L.tileLayer(baseMapURL).addTo(this.map);
      L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

      this.addGeorgiaBoundary();

      this.map.on('zoomend', (event) => {
        this.currentZoom.set(event.target._zoom);
      });
    }
  }

  private buildMapMarkers(data: MapData[], categories: LegendCategory[], season: Season, type: string, weapon: string) {

    const categoriesWithColors = categories.map((c: LegendCategory, i: number) => ({ ...c, color: this.circleColors[i] }));

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
        }).addTo(this.map);

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
            <button type="button"
              class="px-2 py-1 text-xs uppercase font-medium text-center inline-flex items-center text-white rounded-full focus:ring-1 focus:outline-none bg-gray-600 hover:bg-gray-700 focus:ring-white">                
                  View Results
            </button>
          </div>
        `);

        this.markers.push(marker);

      }
    });
  }

  private buildLegend(categories: LegendCategory[], type: string) {

    this.legend.remove();

    this.legend.onAdd = () => {

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
            <span style="background: ${this.circleColors[i]}; opacity: 0.7; border-radius: 50%; height: 18px; width: 18px; display: inline-block; vertical-align: middle"></span>
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

    this.legend.addTo(this.map);
  }

  private categorizeResults(data: MapData[], type: string): LegendCategory[] {

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

  private centerMap() {
    this.markers.forEach(marker => marker.addTo(this.map));
    const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
    if (this.currentZoom() === 0) {
      this.map.fitBounds(bounds);
    }
  }
}

