import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { HistClimateLocation } from "@model";
import { env } from "environment";

@Injectable({ providedIn: 'root' })
export class HistClimateLocationService {

  private http = inject(HttpClient);
  private endpoint = `${env.API_URL}/histClimateLocations`;

  histClimateLocations$ = this.http.get<HistClimateLocation[]>(this.endpoint);

}
