import { AsyncPipe } from "@angular/common";
import { AfterViewInit, Component, ViewChild, inject, output } from "@angular/core";
import { Hunt } from "@model";
import { NgIcon, NgIconComponent } from "@ng-icons/core";
import { Store } from "@ngrx/store";
import { AppStateInterface } from "@store-model";
import { ModalComponent } from "_shared/components/modal.component";
import { HuntsComponent } from "components/hunts/hunts.component";
import { combineLatest, map } from "rxjs";
import * as filterActions from "store/filters/filters.actions";
import * as filterSelectors from "store/filters/filters.selectors";
import * as successMapSelectors from 'store/successMap/successMap.selectors';

@Component({
  selector: 'gawmas-success-map-hunt-results',
  standalone: true,
  imports: [
    ModalComponent, HuntsComponent, AsyncPipe, NgIconComponent
  ],
  template: `
    <gawmas-modal #huntResultsModal [targetElement]="huntResultsTarget">
      <div class="flex items-start justify-between rounded-t-2xl my-2 pl-4 pt-2 mb-0 bg-gray-800">
        <!-- <div class="pt-2 w-full"> -->
          <div class="-ml-4 -mt-3 pt-2 pl-3 pb-1.5 border rounded-2xl border-gray-600 bg-gray-900">
            <h3 class="text-sm md:text-lg font-semibold text-white uppercase mb-1 pr-2.5 pt-1">
              @if (headerData$ | async; as data) {
                <span class="font-bold">
                  @if (data.wmaCoords) {
                    <a href="https://www.google.com/maps/search/?api=1&query={{ data.wmaCoords }}" target="_blank">
                      <ng-icon name="heroMapPin"/>
                    </a>
                  }
                  {{ data.wma }}
                </span>
                <span class="chip result-chip chip-season">
                  {{ data.season }}
                </span>
                <span class="chip result-chip text-xs md:text-sm ml-1"
                  [class.chip-firearm]="data.weapon === 'All Weapons' || data.weapon === 'Firearms'"
                  [class.chip-archery]="data.weapon === 'Archery'"
                  [class.chip-primitive]="data.weapon === 'Primitive'">
                  {{ data.weapon }}</span>
              }
            </h3>
          </div>
          <div class="flex items-center text-sm uppercase ml-2">
            <button (click)="close()" type="button"
              class="ms-auto inline-flex h-8 w-8 mr-2 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-600 hover:text-white">
                <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span class="sr-only">Close modal</span>
            </button>
          </div>
        <!-- </div> -->

      </div>

      <gawmas-browse-hunts [isModal]="true" />

      <div class="flex justify-center items-center pl-2 py-2 rtl:space-x-reverse rounded-b-2xl border-t border-gray-600">
        <button (click)="close()" type="button" class="btn btn-default">
          Close
        </button>
      </div>
    </gawmas-modal>
  `
})
export class SuccessMapHuntResultsComponent implements AfterViewInit {

  @ViewChild('huntResultsModal') huntResultsModal: ModalComponent | undefined;

  private _store = inject(Store<AppStateInterface>)

  closeEvent = output();

  huntResultsTarget = 'huntResultsModal';

  headerData$ = combineLatest([
    this._store.select(filterSelectors.selectFiltersAuxData),
    this._store.select(successMapSelectors.selectMapWmaHuntFilter),
    this._store.select(successMapSelectors.selectMapWmaResults)])
    .pipe(
      map(([filterAuxData, filter, results]) => {
        return {
          season: filterAuxData.seasons.find(s => s.id === filter?.seasons![0]!)?.season || '',
          weapon: filterAuxData.weapons.find(w => w.id === filter?.weapons![0]!)?.name || 'All Weapons',
          wma: filterAuxData.wmas.find(w => w.id === filter?.wmas![0]!)?.name || '',
          wmaCoords: results && results[0] ? `${results[0].physLat}, ${results[0].physLong}` : ''
        };
      }
    ));

  ngAfterViewInit(): void {
    this._store.dispatch(filterActions.getFilterAuxData());
  }

  open() {
    this.huntResultsModal?.open();
  }

  close() {
    this.closeEvent.emit();
    this.huntResultsModal?.close();
  };
}
