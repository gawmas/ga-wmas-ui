import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Wma } from "@model";
import { env } from "environment";

@Injectable({ providedIn: 'root' })
export class WmaService {

  private http = inject(HttpClient);
  private endpoint = `${env.API_URL}/wmas`;

  wmas$ = this.http.get<Wma[]>(this.endpoint);

}
