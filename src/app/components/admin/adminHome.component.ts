import { Component } from "@angular/core";
import { SHARED_MODULES } from "@shared-imports";

@Component({
  standalone: true,
  imports: [SHARED_MODULES],
  template: `
  <div class="text-white ml-3 p-4 border-b border-gray-600">
    <a routerLink="/admin/browse">Browse Hunts</a> | <a routerLink="/admin/wmas">WMAs</a>
  </div>
  <router-outlet></router-outlet>
  `
})
export class AdminHomeComponent  {}
