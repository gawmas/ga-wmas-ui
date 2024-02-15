import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Hunt, Wma } from "@model";
import { env } from "environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AdminService {

  http = inject(HttpClient);
  private endpoint = `${env.API_URL}`;

  getHunt(id: string): Observable<Hunt> {
    return this.http.get<Hunt>(`${this.endpoint}/hunt/${id}`);
  }

  updateHunt(hunt: Hunt): Observable<Hunt> {
    return this.http.put<Hunt>(`${this.endpoint}/hunt/${hunt.id}`, hunt);
  }

  getAdminWmas(): Observable<Wma[]> {
    return this.http.get<Wma[]>(`${this.endpoint}/adminWmas`);
  }

}
