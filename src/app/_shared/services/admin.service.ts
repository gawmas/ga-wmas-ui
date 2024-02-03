import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Hunt } from "@model";
import { env } from "environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AdminService {

  http = inject(HttpClient);
  private endpoint = `${env.API_URL}`;

  updateHunt(hunt: Hunt): Observable<Hunt> {
    return this.http.put<Hunt>(`${this.endpoint}/hunt/${hunt.id}`, hunt);
  }

}
