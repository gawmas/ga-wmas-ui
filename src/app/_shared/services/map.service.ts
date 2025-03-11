import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { MapCoords } from "@model";
import { env } from "@environment";

@Injectable({ providedIn: 'root' })
export class MapService {

  private http = inject(HttpClient);
  private wmasEndpoint = `${env.API_URL}/wmaCoords`;
  private climateEndpoint = `${env.API_URL}/climateCoords`;

  wmasCoords$ = this.http.get<MapCoords[]>(this.wmasEndpoint);
  climateCoords$ = this.http.get<MapCoords[]>(this.climateEndpoint);

}
