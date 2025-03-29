import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SHARED_MODULES } from '../_shared/index';
import { Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { NgIconComponent } from "@ng-icons/core";
import { ModalComponent } from "_shared/components/modal.component";
import { AboutComponent } from "components/about.component";
import { IsActiveRoutePipe } from '@pipes';
import { Subject, takeUntil } from 'rxjs';
import { Collapse } from 'flowbite';
import type { CollapseOptions, CollapseInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';

@Component({
  selector: 'gawmas-header',
  imports: [SHARED_MODULES, NgIconComponent, IsActiveRoutePipe],
  template: `

  <nav class="header">

    <div class="flex flex-wrap justify-between w-full p-0">

      <a routerLink="/browse" class="brand space-x-3 rtl:space-x-reverse">
        <object data="./assets/gawmas-logo.svg" type="image/svg+xml" class="md:h-[85px] md:mt-0"></object>
      </a>

      <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <!-- <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get started</button> -->
        <button id="hamburger" (click)="toggleMobileMenu()" data-collapse-toggle="navbar-sticky" type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-300 hover:bg-gray-700"
          aria-controls="navbar-sticky" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          @if (mobileMenuOpen()) {
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 17">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1l15 15M16 1L1 16"/>
            </svg>
          } @else {
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          }
        </button>
      </div>

      <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
        <ul class="border border-gray-600 rounded-lg flex flex-col p-4 z-100 h-screen mt-4 bg-gray-900 font-medium rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent md:h-[30px] md:p-0 md:space-x-8">
          <li class="flex items-center text-xl border-b border-gray-300 py-6 md:text-medium md:py-2 md:text-sm md:border-0">
            <ng-icon name="heroTableCells" class="text-xl md:text-lg text-white mr-1"></ng-icon>
            <a routerLink="/browse"
              [ngClass]="{'nav-current': (currentRoute() | isActiveRoute:'/browse'), 'nav-link': !(currentRoute() | isActiveRoute:'/browse')}"
              aria-current="page">
                Hunt Results
            </a>
          </li>
          <li class="flex items-center text-xl border-b border-gray-300 py-6 md:text-medium md:py-2 md:text-sm md:border-0">
            <ng-icon name="heroMap" class="text-xl md:text-lg text-white mr-1"></ng-icon>
            <a routerLink="/successmap"
              [ngClass]="{'nav-current': (currentRoute() | isActiveRoute:'/successmap'), 'nav-link': !(currentRoute() | isActiveRoute:'/successmap')}"
              aria-current="page">
                Success Map
            </a>
          </li>
          <li class="flex items-center text-xl border-b border-gray-300 py-6 md:text-medium md:py-2 md:text-sm md:border-0">
            <ng-icon name="heroInformationCircle" class="text-xl md:text-lg text-white mr-1"></ng-icon>
            <a routerLink="/about"
              [ngClass]="{'nav-current': (currentRoute() | isActiveRoute:'/about'), 'nav-link': !(currentRoute() | isActiveRoute:'/about')}"
              aria-current="page">
                About
            </a>
          </li>
        </ul>
      </div>

    </div>
  </nav>


  `
})
export class HeaderComponent implements OnInit, OnDestroy {

  private _router = inject(Router);
  private _destroyed$ = new Subject<void>();

  currentRoute = signal<string>('');
  mobileMenuOpen = signal<boolean>(false);

  ngOnInit(): void {
    this._router.events
      .pipe(takeUntil(this._destroyed$))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute.set(event.url);
          if (this.mobileMenuOpen()) {
            this.toggleMobileMenu();
            this.mobileMenuOpen.set(false);
          }
        }
      });
  }

  toggleMobileMenu() {

    const $menu: HTMLElement | null = document.getElementById('navbar-sticky');
    const $hamburger: HTMLElement | null = document.getElementById('hamburger');

    const collapse: CollapseInterface = new Collapse($menu, $hamburger);

    if ($menu) {
      collapse.toggle();
      this.mobileMenuOpen.set(collapse._visible);
    }

  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

}

