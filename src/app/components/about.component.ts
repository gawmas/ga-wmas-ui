import { Component, ViewChild } from "@angular/core";
import { SHARED_MODULES } from "@shared-imports";
import { ModalComponent } from "_shared/components/modal.component";

@Component({
  selector: 'gawmas-about',
  standalone: true,
  imports: [SHARED_MODULES, ModalComponent],
  template: `
    <gawmas-modal #about [targetElement]="aboutTarget">
      <div class="flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600">
        <h3 class="text-xl font-semibold text-white lg:text-2xl">
          About this Project
        </h3>
        <button (click)="closeAbout()" type="button"
          class="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-600 hover:text-white">
            <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <div class="p-6">
        <!-- <div class="float-right mb-0">
          <object data="./assets/logo.svg"
            type="image/svg+xml"
            class="h-[65px] md:h-[85px] md:mt-0"></object>
        </div> -->
        <p class="p-1">
          This product emerged from the fundamental question: <span class="italic">
            "Do weather and lunar phase play a role
            in determining the success of deer hunting?"
          </span>
        </p>
        <p class="p-1">
          Rather than offering a conclusive answer, the goal is to furnish hunters with
          empirical data and analytical tools, empowering them to draw their own informed conclusions.
        </p>
        <p class="p-1">
          Regardless of whether the data directly addresses the initial question, the hope
          is that the tools presented here prove useful in helping you pinpoint the most
          productive WMAs to invest your time this fall.
        </p>
        <!-- <p class="p-1"></p> -->
      </div>
      <div class="flex justify-center pl-2 py-2 rtl:space-x-reverse rounded-b border-t border-gray-600">
        <button (click)="closeAbout()" type="button"
          class="mr-1.5 relative inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-600 rounded-2xl hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300">
          Close
        </button>
      </div>
    </gawmas-modal>
  `,
})
export class AboutComponent {

  @ViewChild('about') aboutModal: ModalComponent | undefined;

  aboutTarget = 'aboutModal';

  openAbout(): void {
    this.aboutModal?.open();
  }

  closeAbout(): void {
    this.aboutModal?.close();
  }

}
