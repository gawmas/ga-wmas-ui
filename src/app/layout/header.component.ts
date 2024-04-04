import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SHARED_MODULES } from '../_shared/index';
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { NgIconComponent } from "@ng-icons/core";
import { ModalComponent } from "_shared/components/modal.component";
import { AboutComponent } from "components/about.component";
import { IsActiveRoutePipe } from '@pipes';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'gawmas-header',
  standalone: true,
  imports: [SHARED_MODULES, NgIconComponent, ModalComponent,
    AboutComponent, IsActiveRoutePipe],
  template: `
    <nav class="w-full bg-[url('./assets/header-bg-image.png')] bg-no-repeat flex flex-wrap justify-between p-4">
      <a routerLink="/browse" class="space-x-3 rtl:space-x-reverse">
        <object data="./assets/gawmas-logo.svg" type="image/svg+xml" class="h-[65px] md:h-[85px] max-h-14 md:mt-0"></object>
      </a>
      <button data-collapse-toggle="navbar-solid-bg" type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-200 rounded-lg md:hidden hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
        aria-controls="navbar-solid-bg" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15" />
        </svg>
      </button>
      <div class="hidden md:block md:w-auto xl:mr-24 lg:mt-4" id="navbar-solid-bg">
        <ul
          class="flex flex-col font-medium mt-4 rounded-lg bg-gray-800 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
          <li class="flex items-center text-sm py-2 px-2">
            <ng-icon name="heroTableCells" class="text-lg text-white mr-1"></ng-icon>
            <a routerLink="/browse"
              [ngClass]="{'nav-current': (currentRoute | isActiveRoute:'/browse'), 'nav-link': !(currentRoute | isActiveRoute:'/browse')}"
              aria-current="page">
                Hunt Results
            </a>
          </li>
          <li class="flex items-center text-sm py-2 px-2">
            <ng-icon name="heroMap" class="text-lg text-gray-200 ml-2 mr-1"></ng-icon>
            <a routerLink="/successmap"
              [ngClass]="{'nav-current': (currentRoute | isActiveRoute:'/successmap'), 'nav-link': !(currentRoute | isActiveRoute:'/successmap')}"
              aria-current="page">
                Success Map
            </a>
          </li>
          <li class="flex items-center text-sm py-2 px-2">
            <ng-icon name="heroArrowTrendingUp" class="text-lg text-gray-200 ml-2 mr-1"></ng-icon>
            <a routerLink="/trends"
              [ngClass]="{'nav-current': (currentRoute | isActiveRoute:'/trends'), 'nav-link': !(currentRoute | isActiveRoute:'/trends')}"
              aria-current="page">
                Property Trends
            </a>
          </li>
          <li class="flex items-center text-sm py-2 px-2">
            <ng-icon name="heroInformationCircle" class="text-lg text-gray-200 ml-2 mr-1"></ng-icon>
            <a routerLink="/about"
              [ngClass]="{'nav-current': (currentRoute | isActiveRoute:'/about'), 'nav-link': !(currentRoute | isActiveRoute:'/about')}"
              aria-current="page">
                About
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `
})
export class HeaderComponent implements OnInit, OnDestroy {

  private _router = inject(Router);
  private _destroyed$ = new Subject<void>();
  currentRoute: string = '';

  ngOnInit(): void {
    this._router.events
      .pipe(takeUntil(this._destroyed$))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url;
        }
      });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

}

