import { Component, Input, ViewChild, signal } from "@angular/core";
import { ModalComponent } from "_shared/components/modal.component";
import { HuntsComponent } from "components/hunts/hunts.component";

@Component({
  selector: 'gawmas-success-map-hunt-results',
  standalone: true,
  imports: [ModalComponent, HuntsComponent],
  template: `
    <gawmas-modal #huntResultsModal [targetElement]="huntResultsTarget">
      <div class="flex items-start justify-between md:rounded-t-2xl my-2 pl-4 pt-4 mb-0 bg-gray-800">
        <div class="flex items-center pt-2">
          <h3 class="text-xs md:text-lg font-semibold text-white uppercase border-r border-gray-500 pr-2 mb-0">
            Hunt Results
          </h3>
          <div class="text-xs md:text-base ml-2">
            {{ wmaId() }} {{ seasonId() }}
          </div>
        </div>
        <button (click)="close()" type="button"
          class="ms-auto inline-flex h-8 w-8 mr-2 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-600 hover:text-white">
            <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
        </button>
      </div>
      <gawmas-browse-hunts />
      <div class="flex justify-center items-center pl-2 py-2 rtl:space-x-reverse rounded-b-2xl border-t border-gray-600">
        <button (click)="close()" type="button" class="btn btn-default">
          Close
        </button>
      </div>
    </gawmas-modal>
  `
})
export class SuccessMapHuntResultsComponent {

  @ViewChild('huntResultsModal') huntResultsModal: ModalComponent | undefined;
  huntResultsTarget = 'huntResultsModal';

  wmaId = signal(0);
  seasonId = signal(0);

  open(wmaId: number, seasonId: number) {
    this.wmaId.set(wmaId);
    this.seasonId.set(seasonId);
    this.huntResultsModal?.open();
  }

  close() {
    console.log('Closing modal...');
    this.huntResultsModal?.close();
    document.getElementById('map')?.setAttribute('style', 'z-index: 100;');
  }
}
