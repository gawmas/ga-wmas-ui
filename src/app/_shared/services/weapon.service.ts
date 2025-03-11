import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Weapon } from "@model";
import { env } from "@environment";

@Injectable({ providedIn: 'root' })
export class WeaponService {

  private http = inject(HttpClient);
  private endpoint = `${env.API_URL}/weapons`;

  weapons$ = this.http.get<Weapon[]>(this.endpoint);

}
