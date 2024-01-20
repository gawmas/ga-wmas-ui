import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { env } from "environment";
import { Observable } from "rxjs";
import { Filter, Hunt } from "@model";

@Injectable({ providedIn: 'root' })
export class HuntService {

    private http = inject(HttpClient);
    private endpoint = `${env.API_URL}/hunts`;

    getHunts(params?: Filter): Observable<Hunt[]> {
      const url = this.endpoint +
        '?skip=' + (params?.skip ? params?.skip.toString() : '') +
        '&wmas=' + (params?.wmas ? params?.wmas.toString() : '') +
        '&seasons=' + (params?.seasons ? params?.seasons.toString() : '') +
        '&weapons=' + (params?.weapons ? params?.weapons.toString() : '') +
        '&success=' + (params?.successRate ? params?.successRate : 0);
      // console.log(url);
      return this.http.get<Hunt[]>(url);
    }

}
