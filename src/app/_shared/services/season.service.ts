import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Season } from "@model";
import { env } from "environment";

@Injectable({ providedIn: 'root' })
export class SeasonService {

  private http = inject(HttpClient);
  private endpoint = `${env.API_URL}/seasons`;

  seasons$ = this.http.get<Season[]>(this.endpoint);

}
