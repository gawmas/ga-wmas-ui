import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { SeasonHarvestData, SeasonSuccessData, WmaCoord, WmaHarvest, WmaSuccess } from "@model";
import { env } from "environment";

@Injectable({ providedIn: 'root' })
export class SuccessMapService {

  private http = inject(HttpClient);
  private endpoint = `${env.API_URL}/map`;

  wmaCoords$ = this.http.get<WmaCoord[]>(`${this.endpoint}/wmacoords`);

  getWmaHarvestBySeason(seasonId: number) {
    return this.http.get<SeasonHarvestData>(`${this.endpoint}/harvest/${seasonId}`);
  }

  getWmaSuccessBySeason(seasonId: number) {
    return this.http.get<SeasonSuccessData>(`${this.endpoint}/success/${seasonId}`);
  }

}
