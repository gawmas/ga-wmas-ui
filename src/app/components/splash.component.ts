import { Component, ViewChild } from "@angular/core";
import { SHARED_MODULES } from "@shared-imports";
import { ModalComponent } from "_shared/components/modal.component";

@Component({
  selector: 'gawmas-splash',
  standalone: true,
  imports: [SHARED_MODULES, ModalComponent],
  template: `
    <gawmas-modal #splash [targetElement]="splashTarget">
      <div class="p-6">
        <div class="w-full flex justify-center">
          <object data="./assets/logo.svg"
            type="image/svg+xml"
            class="h-[65px] md:h-[85px] md:mt-0"></object>
        </div>
        <p class="p-1">
          This product emerged from the fundamental question: <span class="italic">
            "Do weather and lunar phase play a role
            in determining the success of deer hunting?"
          </span>
        </p>
      </div>
      <div class="flex justify-center pl-2 py-2 rtl:space-x-reverse rounded-b border-t border-gray-600">
        <button (click)="proceed()" type="button"
          class="mr-1.5 relative inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-600 rounded-2xl hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300">
          Browse Hunt Data
        </button>
      </div>
    </gawmas-modal>
  `,
})
export class SplashComponent {

  @ViewChild('splash') splashModal: ModalComponent | undefined;

  splashTarget = 'splashModal';

  openSplash(): void {
    this.splashModal?.open();
  }

  proceed(): void {
    this.splashModal?.close();
  }

}
