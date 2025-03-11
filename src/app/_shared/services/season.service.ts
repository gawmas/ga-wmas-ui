import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Season } from "@model";
import { env } from "@environment";
import { map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SeasonService {

  private http = inject(HttpClient);
  private endpoint = `${env.API_URL}/seasons`;

  seasons$ = this.http.get<Season[]>(this.endpoint).pipe(
    map((seasons: Season[]) => seasons.map((s: Season) => ({ ...s, season: s.season.replace('-', ' - ')})))
  );

}
