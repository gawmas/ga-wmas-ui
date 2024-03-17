import { Component, OnInit, inject } from "@angular/core";
import { Wma, WmaCoord, WmaSuccess } from "@model";
import { StaticData } from "_shared/static-data";
import { AppConfig } from "app.config";
import { SuccessMapFiltersComponent } from "./success-map-filters.component";
import { SHARED_MODULES } from "@shared-imports";
import { Store } from "@ngrx/store";
import { AppStateInterface } from "@store-model";
import * as L from 'leaflet';
import * as successMapActions from 'store/successMap/successMap.actions';

@Component({
  standalone: true,
  imports: [SHARED_MODULES, SuccessMapFiltersComponent],
  template: `
    <gawmas-success-map-filters />
    <div id="map" class="h-[80vh] rounded-br-2xl rounded-tr-2xl border-r border-t border-b border-gray-700 m-2"></div>
  `
})
export class SuccessMapComponent implements OnInit {

  mapCoords: WmaCoord[] = StaticData.wmaCoords;
  successData: WmaSuccess[] = StaticData.archerySuccess;

  private _store = inject(Store<AppStateInterface>);

  private map!: L.Map;
  private markers: L.CircleMarker[] = [];

  ngOnInit(): void {

    this._store.dispatch(successMapActions.enterSuccessMap());

    if (!this.map) {

      const baseMapURL = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
      this.map = L.map('map', {
        zoomControl: false
      }).setView([51.505, -0.09], 10);
      L.tileLayer(baseMapURL).addTo(this.map);
      L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

      const successCategories = this.categorizeSuccess(this.successData.filter(s => s.success));
      console.log(successCategories.map((c: any) => c.min));

      // Create markers and bind popups
      this.mapCoords.forEach(c => {
        const successItem: WmaSuccess | undefined = this.successData.find(s => s.id === c.id);
        if (successItem) {
          // console.log(successItem);
          const marker = L.circleMarker([c.lat, c.lng], {
            radius: successCategories.find((cat: any) => successItem.success >= cat.min && successItem.success <= cat.max)?.factor || 5,
            stroke: false,
            opacity: 1,
            fill: true,
            fillColor: AppConfig.getSuccessRateColor(successItem.success || 0),
            fillOpacity: 1
          }).addTo(this.map);
          marker.bindPopup(`<strong>${c.name}</strong><br>2023 &ndash; 2024<br>Success Rate: ${successItem.success || 0}%`);
          this.markers.push(marker);
        }
      });

      const legend = (L as any).control({ position: 'topright' });

      legend.onAdd = function () {

        let div = L.DomUtil.create('div', 'info legend'),
          grades = successCategories.map((c: any) => c.min).filter((m: number) => m <= 125),
          labels = [];

        div.innerHTML = '<h4>Legend</h4>';
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
          // if (grades[i] <= 120) {
            div.innerHTML +=
              '<div style="clear: both;"><i style="background:' + AppConfig.getSuccessRateColor(grades[i]) + '"></i> ' +
              parseFloat(grades[i]).toFixed(0) + (grades[i + 1] ? '&ndash;' + parseFloat(grades[i + 1]).toFixed(0) + '&percnt;<br>' : '+&percnt;') + '</div>';
          // }
        }

        return div;
      };

      legend.addTo(this.map);

      this.markers.forEach(marker => marker.addTo(this.map));
      const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
      this.map.fitBounds(bounds);

    }
  }

  private categorizeSuccess(data: WmaSuccess[]) {

    // Calculate the range and step size for categorization
    let maxSuccess = Math.max(...data.map(d => d.success));
    let minSuccess = 0.00;
    let rangeSize = (maxSuccess - minSuccess) / 8;
    let categories: any = [];

    // Initialize categories
    for (let i = 0; i < 8; i++) {
      categories[i] = {
        min: parseFloat((minSuccess + rangeSize * i).toFixed(2)),
        max: parseFloat((minSuccess + rangeSize * (i + 1)).toFixed(2)),
        factor: +((i + 1) * 5).toFixed(2).toString()
      };
    }

    return categories;
  }

}

