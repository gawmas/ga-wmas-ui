import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { MapDataResult, WmaCoord } from "@model";
import { env } from "environment";

@Injectable({ providedIn: 'root' })
export class SuccessMapService {

  private http = inject(HttpClient);
  private endpoint = `${env.API_URL}/map`;

  wmaCoords$ = this.http.get<WmaCoord[]>(`${this.endpoint}/wmacoords`);

  getSeasonMapData(seasonId: number, dataType: string) {
    return this.http.get<MapDataResult>(`${this.endpoint}/${dataType}/${seasonId}`);
  }

}
