import { weaponChange } from './../../store/successMap/successMap.actions';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { LegendCategory, MapData, MapDataResult, Season, WeaponResult, WmaCoord } from "@model";
import { AppConfig } from "app.config";
import { SuccessMapFiltersComponent } from "./success-map-filters.component";
import { SHARED_MODULES } from "@shared-imports";
import { Store } from "@ngrx/store";
import { AppStateInterface } from "@store-model";
import { LoadingComponent } from "_shared/components/loading.component";
import { Subject, combineLatest, startWith, takeUntil } from 'rxjs';
import * as L from 'leaflet';
import * as successMapActions from 'store/successMap/successMap.actions';
import * as successMapSelectors from 'store/successMap/successMap.selectors';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SHARED_MODULES, SuccessMapFiltersComponent, LoadingComponent],
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

  // Observables from the store ...
  loading$ = this._store.select(successMapSelectors.selectSuccessMapLoading);
  season$ = this._store.select(successMapSelectors.selectSelectedSeason).pipe(startWith(0));
  seasons$ = this._store.select(successMapSelectors.selectSeasons).pipe(startWith([] as Season[]));
  mapData$ = this._store.select(successMapSelectors.selectMapData).pipe(startWith(undefined));
  coords$ = this._store.select(successMapSelectors.selectSuccessMapWmaCoords).pipe(startWith([] as WmaCoord[]));
  weapon$ = this._store.select(successMapSelectors.selectWeapon).pipe(startWith(undefined));

  // Map shit ...
  private map!: L.Map;
  private markers: L.CircleMarker[] = [];
  private legend = (L as any).control({ position: 'topright' });
  // private gaGeoJson =

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
        takeUntil(this.destroyed$)
      ).subscribe(({ wmaCoords, seasons, selectedSeason, mapData, weapon }) => {

        if (mapData?.weapons.length && weapon! > -1 && wmaCoords?.length > 0 && selectedSeason! > -1 && seasons) {

          this.wmaCoords = wmaCoords;
          this.mapDataResult = mapData;

          this.markers.forEach(marker => marker.remove());
          this.markers = [];

          const weaponName = (this.mapDataResult.weapons.find(w => w.weaponId === weapon) as WeaponResult).weapon;
          const weaponData = (this.mapDataResult.weapons.find(w => w.weaponId === weapon) as WeaponResult).data;
          let categories: LegendCategory[] = this.categorizeResults(weaponData, this.mapDataResult.type);
          console.log('categories:', categories);

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
      }).setView([51.505, -0.09], 10);
      L.tileLayer(baseMapURL).addTo(this.map);
      L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
      this.addGeorgiaBoundary();
    }
  }

  private buildMapMarkers(data: MapData[], categories: LegendCategory[], season: Season, type: string, weapon: string) {

    // Create markers and bind popups
    this.wmaCoords!.forEach(c => {

      const item: MapData | undefined = data.find(s => s.id === c.id);

      if (item) {
        const marker = L.circleMarker([c.lat, c.lng], {
          radius: categories.find((cat: any) => item.value >= cat.min && item.value <= cat.max)?.factor || 5,
          stroke: false,
          opacity: 1,
          fill: true,
          fillColor: AppConfig.getSuccessRateColor(item.value || 0),
          fillOpacity: 0.7
        }).addTo(this.map);

        const valueLabel = type === 'success' ? 'Success Rate' : type === 'harvest' ? 'Total Harvest' : 'Harvest Rate';
        const valueSuffix = type === 'success' ? '%' : type === 'harvest' ? ' deer' : ' deer/acre';

        marker.bindPopup(`
          <div class="uppercase font-bold border-b border-gray-500 mb-1">${c.name}</div>
          <div class="flex items-center">
            <span>${season.season}</span>,
            <span class="font-semibold ml-1">${weapon === 'Total' ? 'All Weapons' : weapon}</span>
          </div>
          <div class="flex items-center">
            <span>${valueLabel}:</span>
            <span class="font-semibold pl-1">${item.value || 0}${valueSuffix}</span>
          </div>
        `);
        this.markers.push(marker);
      }
    });
  }

  private buildLegend(categories: LegendCategory[], type: string) {

    this.legend.remove();

    this.legend.onAdd = () => {

      let div = L.DomUtil.create('div', 'info legend'),
        grades = categories.map((c: any) => c.min).filter((m: number) => m <= 125),
        labels = [];

      let title = ''
      switch (type) {
        case 'success':
          title = 'Success Rate (&percnt;)';
          break;
        case 'harvest':
          title = 'Total Harvest'
          break;
        case 'harvestRate':
          title = 'Harvest Rate (deer/acre)';
          break;
      }

      div.innerHTML = `<h4>${title}</h4>`;
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<div style="clear: both;"><i style="background:' + AppConfig.getSuccessRateColor(grades[i]) + '; opacity: 0.7"></i> ' +
          parseFloat(grades[i]).toFixed(0) + (grades[i + 1] ? '&ndash;' + parseFloat(grades[i + 1]).toFixed(0) + '&percnt;<br>' : '+&percnt;') + '</div>';
      }

      return div;
    };

    this.legend.addTo(this.map);
  }

  private categorizeResults(data: MapData[], type: string): LegendCategory[] {

    // Calculate the range and step size for categorization
    let maxSuccess = Math.max(...data.map(d => d.value));
    let minSuccess = 0.00;
    let rangeSize = (maxSuccess - minSuccess) / 10;
    let categories: any = [];

    let factor = 0;
    // console.log(type)
    switch (type) {
      case 'success':
        factor = 5;
        break;
      case 'harvest':
        factor = 2.5;
        break;
      case 'harvestrate':
        factor = 10;
        break;
    }

    // Initialize categories
    for (let i = 0; i < 10; i++) {
      categories[i] = {
        min: parseFloat((minSuccess + rangeSize * i).toFixed(2)),
        max: parseFloat((minSuccess + rangeSize * (i + 1)).toFixed(2)),
        factor: +((i + 1) * factor).toFixed(2).toString()
      };
    }

    return categories;
  }

  private centerMap() {
    this.markers.forEach(marker => marker.addTo(this.map));
    const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
    this.map.fitBounds(bounds);
  }
}

