import { Component, ViewChild, output } from "@angular/core";
import { ModalComponent } from "_shared/components/modal.component";
import { SuccessMapFiltersComponent } from "./success-map-filters.component";

@Component({
  selector: "gawmas-success-map-filters-modal",
  standalone: true,
  imports: [ModalComponent, SuccessMapFiltersComponent],
  template: `
    <gawmas-modal #mapFiltersModal [targetElement]="mapFiltersTarget">
      <div class="flex items-start justify-between rounded-t-2xl my-2 pl-4 pt-2 mb-0 bg-gray-800">
        <h3 class="font-bold">Change Map Type</h3>
        <div class="flex items-center text-sm uppercase ml-2">
          <button (click)="close()" type="button"
            class="ms-auto inline-flex h-8 w-8 mr-2 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-600 hover:text-white">
              <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span class="sr-only">Close modal</span>
          </button>
        </div>
      </div>
      <gawmas-success-map-filters />
      <div class="flex justify-center items-center pl-2 py-2 rtl:space-x-reverse rounded-b-2xl border-t border-gray-600">
        <button (click)="close()" type="button" class="btn btn-primary">
          Apply
        </button>
      </div>
    </gawmas-modal>
  `
})
export class SuccessMapFiltersModalComponent {

  @ViewChild('mapFiltersModal') mapFiltersModal: ModalComponent | undefined;

  closeEvent = output();

  mapFiltersTarget = 'mapFiltersModal';

  open() {
    this.mapFiltersModal?.open();
  }

  close() {
    this.mapFiltersModal?.close();
    this.closeEvent.emit();
  };

}
