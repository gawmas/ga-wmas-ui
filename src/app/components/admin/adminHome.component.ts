import { Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { IsActiveRoutePipe } from "@pipes";
import { SHARED_MODULES } from "@shared-imports";
import { Subject, takeUntil } from "rxjs";

@Component({
  standalone: true,
  imports: [SHARED_MODULES, IsActiveRoutePipe],
  template: `
  <div class="text-sm font-medium text-center border-b text-gray-400 border-gray-700">
    <ul class="flex flex-wrap -mb-px">
      <li class="me-2">
        <a routerLink="/admin/browse"
          [ngClass]="{'text-white border-blue-500': (currentRoute() | isActiveRoute:'/admin/browse'), 'border-transparent hover:border-gray-300 hover:text-gray-300': !(currentRoute() | isActiveRoute:'/admin/browse')}"
          class="inline-block p-4 border-b-2 rounded-t-lg">Manage Hunts</a>
      </li>
      <li class="me-2">
        <a routerLink="/admin/wmas"
          [ngClass]="{'text-white border-blue-500': (currentRoute() | isActiveRoute:'/admin/wmas'), 'border-transparent hover:border-gray-300 hover:text-gray-300': !(currentRoute() | isActiveRoute:'/admin/wmas')}"
          class="inline-block p-4 border-b-2 rounded-t-lg">WMAs</a>
      </li>
      <li class="me-2">
        <a routerLink="/admin/add"
          [ngClass]="{'text-white border-blue-500': (currentRoute() | isActiveRoute:'/admin/add'), 'border-transparent hover:border-gray-300 hover:text-gray-300': !(currentRoute() | isActiveRoute:'/admin/add')}"
          class="inline-block p-4 border-b-2 rounded-t-lg">Add Hunts</a>
      </li>
    </ul>
  </div>

  <router-outlet></router-outlet>
  `
})
export class AdminHomeComponent implements OnInit, OnDestroy  {
  private _router = inject(Router);
  private _destroyed$ = new Subject<void>();
  currentRoute = signal<string>('');

  ngOnInit(): void {
    this._router.events
      .pipe(takeUntil(this._destroyed$))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute.set(event.url);
        }
      });
  }
  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
