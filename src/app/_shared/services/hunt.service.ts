import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { env } from "environment";
import { Observable } from "rxjs";
import { Filter, Hunt } from "@model";

@Injectable({ providedIn: 'root' })
export class HuntService {

    private http = inject(HttpClient);
    private endpoint = `${env.API_URL}/hunts`;

    getHunts(filter?: Filter): Observable<Hunt[]> {
      // console.log(filter);
      const url = this.endpoint +
        '?skip=' + (filter?.skip ? filter?.skip.toString() : '') +
        '&pageSize=' + (filter?.pageSize ? filter?.pageSize.toString() : '') +
        '&wmas=' + (filter?.wmas ? filter?.wmas.toString() : '') +
        '&seasons=' + (filter?.seasons ? filter?.seasons.toString() : '') +
        '&weapons=' + (filter?.weapons ? filter?.weapons.toString() : '') +
        '&success=' + (filter?.successRate ? filter?.successRate : 0) +
        '&sort=' + (filter?.sort ? filter?.sort : '') +
        '&isBonusQuota=' + (filter?.isBonusQuota ? filter?.isBonusQuota === true : false) +
        '&isStatePark=' + (filter?.isStatePark ? filter?.isStatePark === true : false) +
        '&isVpa=' + (filter?.isVpa ? filter?.isVpa === true : false);
      // console.log(url);
      return this.http.get<Hunt[]>(url);
    }

}
