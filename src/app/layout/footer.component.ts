import { SHARED_MODULES } from '../_shared/index';
import { Component, HostListener, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { NavigationEnd, Router } from '@angular/router';
import { NgIconComponent } from "@ng-icons/core";
import { Store } from '@ngrx/store';
import { IsActiveRoutePipe } from '@pipes';
import { AppStateInterface } from '@store-model';
import { Subject, takeUntil } from 'rxjs';
import { selectLoadingMoreHunts } from 'store/hunts/hunts.selectors';

@Component({
    selector: 'gawmas-footer',
    imports: [SHARED_MODULES, NgIconComponent, IsActiveRoutePipe],
    template: `
    <footer class="fixed left-0 px-2 flex items-center bottom-0 w-[100%] h-12 bg-gray-950 border-t border-gray-700">
      <div class="w-1/2 flex items-center ml-5 text-xs md:text-sm text-gray-200">
        <div class="flex items-center mr-3">
          <ng-icon name="heroChatBubbleBottomCenterText" class="mr-1"></ng-icon>
          <a href="#" class="hover:underline">Feedback?</a>
        </div>
        <div class="flex items-center">
          <ng-icon name="heroDocumentText" class="mr-1"></ng-icon>
          <a href="#" class="hover:underline">Disclaimer</a>
        </div>
      </div>
      <div class="p-4 w-1/2 text-right">
        @if (!topInView()) {
          @if (isLoading$ | async) {
            <button disabled type="button" class="py-1 px-2 text-sm font-medium rounded-full border focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700 inline-flex items-center">
              <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-1 animate-spin text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
              </svg>
              Loading...
            </button>
          } @else {
            @if (!(currentRoute | isActiveRoute:'/successmap')) {
              <button (click)="scrollTop()" type="button" class="py-1 px-2 text-sm font-medium rounded-full border focus:z-10 focus:ring-1 focus:ring-white focus:text-white bg-gray-800 text-gray-300 border-gray-600 hover:text-white hover:bg-gray-700 inline-flex items-center">
                <ng-icon name="heroBarsArrowUp" class="mr-1"></ng-icon>
                Back to Top
              </button>
            }
          }
        }
      </div>

    </footer>
  `
})
export class FooterComponent implements OnInit, OnDestroy {

  private _store = inject(Store<AppStateInterface>);
  private _router = inject(Router);
  private _destroyed$ = new Subject<void>();

  topInView = signal(false);
  isLoading$ = this._store.select(selectLoadingMoreHunts);

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

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    this.topInView.set(window.scrollY === 0);
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
