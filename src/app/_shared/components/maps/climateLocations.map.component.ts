import { Component, Input } from "@angular/core";
import { MapCoords } from '@model';
import * as L from 'leaflet';

@Component({
  selector: 'gawmas-climate-locations-map',
  standalone: true,
  template: `<div id="map"></div>`,
  styles: [`#map { height: 35vh; }`]
})
export class ClimateLocationsMapComponent {

  @Input('coords') coords: MapCoords[] | undefined;
  @Input('wmaCoords') wmaCoords?: MapCoords | undefined;

  private map!: L.Map;
  markers: L.Marker[] = [];
  wmaMarker: L.Marker | undefined;

  baseIconProps = {
    shadowUrl: './../../../../assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }

  wmaIcon = new L.Icon({
    iconUrl: './../../../../assets/leaflet/marker-icon-2x-red.png',
    ...this.baseIconProps as any
  });

  climateIcon = new L.Icon({
    iconUrl: './../../../../assets/leaflet/marker-icon-2x-grey.png',
    ...this.baseIconProps as any
  });

  climateWarnIcon = new L.Icon({
    iconUrl: './../../../../assets/leaflet/marker-icon-2x-yellow.png',
    ...this.baseIconProps as any
  });

  initializeMap(wmaCoords?: MapCoords) {
    // console.log('initializeMap', this.wmaCoords);
    if (wmaCoords) {
      this.wmaCoords = wmaCoords;
    }
    if (!this.map) {
      const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      this.map = L.map('map');
      L.tileLayer(baseMapURl).addTo(this.map);
      this.addMarkers();
    } else {
      this.markers.forEach(marker => marker.remove());
      this.addMarkers();
    }
  }

  addMarkers() {
    this.markers = this.coords!.map(c =>
      L.marker([c.coords[0], c.coords[1]], {
        title: (c.hasDailyData === false) ? `${c.town} [NO DATA]` : c.town,
        icon: c.hasDailyData === false ? this.climateWarnIcon : this.climateIcon }));
    if (this.wmaCoords) {
      this.wmaMarker = L.marker([this.wmaCoords.coords[0], this.wmaCoords.coords[1]], { icon: this.wmaIcon, title: this.wmaCoords.town });
      this.markers.push(this.wmaMarker);
    }
    // console.log(this.markers.map(m => m.options));
    this.markers.forEach(marker => marker.addTo(this.map));
    this.centerMap();
  }

  centerMap() {
    if (this.wmaCoords) {
      this.map.setView([this.wmaCoords.coords[0], this.wmaCoords.coords[1]], 11);
    } else {
      const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
      this.map.fitBounds(bounds);
    }
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      let popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(`<p>LAT: ${e.latlng.lat}</p><p>LONG: ${e.latlng.lng}</p>`)
        .openOn(this.map);
    });
  }

}
