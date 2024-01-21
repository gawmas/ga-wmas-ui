import { SHARED_MODULES } from './../../_shared/index';
import { Component, HostListener, inject, signal } from "@angular/core";
import { NgIconComponent } from "@ng-icons/core";
import { Store } from '@ngrx/store';
import { AppStateInterface } from '@store-model';
import { selectHuntsLoading } from 'store/hunts/hunts.selectors';

@Component({
  selector: 'gawmas-footer',
  standalone: true,
  imports: [SHARED_MODULES, NgIconComponent],
  template: `
    <div class="fixed left-0 flex items-center bottom-0 w-[100%] mx-auto h-12 bg-gray-800 border-t border-gray-700">
      <div class="left-4 m-4 p-3 w-1/2">
        @if (!topInView()) {
          @if (isLoading$ | async) {
            <div class="text-xs md:text-sm flex items-center text-yellow-300">
              <svg class="w-6 h-6 fill-yellow-300 spinner"
                viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <circle class="spinner_b2T7" cx="4" cy="12" r="3"/>
                <circle class="spinner_b2T7 spinner_YRVV" cx="12" cy="12" r="3"/>
                <circle class="spinner_b2T7 spinner_c9oY" cx="20" cy="12" r="3"/>
              </svg>
              <div class="text-yellow-300">Loading more results ...</div>
            </div>
          } @else {
            <div class="text-gray-200 text-sm flex items-center">
              <ng-icon name="heroBarsArrowUp" class="mr-1"></ng-icon>
              <a (click)="scrollTop()" class="cursor-pointer hover:underline">Back to Top</a>
            </div>
          }
        }
      </div>
      <div class="w-1/2 flex items-center justify-end text-r mr-5 text-xs md:text-sm text-gray-200">
        <div class="flex items-center mr-3">
          <ng-icon name="heroChatBubbleBottomCenterText" class="mr-1"></ng-icon>
          <a href="#" class="hover:underline">Feedback?</a>
        </div>
        <div class="flex items-center">
          <ng-icon name="heroDocumentText" class="mr-1"></ng-icon>
          <a href="#" class="hover:underline">Disclaimer</a>
        </div>
      </div>
    </div>
  `
})
export class FooterComponent {

  private _store = inject(Store<AppStateInterface>);

  topInView = signal(false);
  isLoading$ = this._store.select(selectHuntsLoading);

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    this.topInView.set(window.scrollY === 0);
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
