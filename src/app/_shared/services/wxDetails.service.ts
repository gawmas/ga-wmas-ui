import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { WxDetails } from "@model";
import { env } from "environment";

@Injectable({ providedIn: 'root' })
export class WxDetailsService {

  private http = inject(HttpClient);
  private endpoint = `${env.API_URL}/wx`;

  getWxDetail(id: string) {
    return this.http.get<WxDetails>(`${this.endpoint}/${id}`);
  }

}
