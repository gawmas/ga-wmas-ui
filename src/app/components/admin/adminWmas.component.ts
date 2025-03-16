import { Component, ElementRef, OnInit, ViewChild, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgIconComponent } from "@ng-icons/core";
import { Store, select } from "@ngrx/store";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import { ModalComponent } from "_shared/components/modal.component";
import { WmaFormComponent } from "./wma-form/wmaForm.component";
import { selectWmas } from "store/admin/admin.selectors";
import { Wma } from '@model';
import { ClimateLocationsMapComponent } from '_shared/components/maps/climateLocations.map.component';
import { BehaviorSubject, Subscription, combineLatest, filter, map, startWith } from 'rxjs';
import * as adminActions from "store/admin/admin.actions";

@Component({
    selector: 'gawmas-admin-wmas',
    imports: [SHARED_MODULES, NgIconComponent, FormsModule, WmaFormComponent],
    template: `
    <gawmas-wma-form #wmaFormModal />
    <div class="m-3 bg-gray-800">
      <div class="border rounded-lg bg-gray-900 border-gray-500 mb-2">
        <div class="w-full flex items-center">
          <div class="flex items-center ps-3">
            <input #missingCoords id="missingCoords" (change)="missingCoordsChanged(missingCoords.checked)" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
            <label for="missingCoords" class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Missing Coords</label>
          </div>
          <div class="flex items-center ps-3">
            <input #missingDailyAvgs id="missingDailyData" (change)="missingDailyAvgsChanged(missingDailyAvgs.checked)" type="checkbox" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500">
            <label for="missingDailyData" class="w-full py-3 ms-2 text-sm font-medium text-gray-300">Missing Daily Avgs</label>
          </div>
        </div>
        <div class="relative mb-2 px-2">
          <div class="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none">
            <svg class="w-4 h-4 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input #filterText type="search" (input)="filterWmas(filterText.value)"
            class="block w-full h-2 p-4 ps-10 text-gray-300 placeholder:text-gray-300 border rounded-lg border-gray-500 bg-gray-600 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Filter...">
          <div class="text-gray-300 h-2 absolute end-2 bottom-5 text-xs">
            @if (filterText.value.length > 0) {
              <a class="cursor-pointer hover:text-white" (click)="clearSearch()">
                <ng-icon name="heroXMark" class="text-xl font-extrabold"></ng-icon>
              </a>
            }
          </div>
        </div>
      </div>
      <table class="w-[95%] text-sm text-left text-gray-300 -pt-2 mb-4">
        <thead class="text-xs text-gray-400 uppercase bg-gray-800 border-gray-400 border-b-2 border-t-1">
          <tr>
            <th scope="col" class="px-6 py-3">WMA</th>
            <th scope="col" class="px-6 py-3 w-[200px]">Physical Location</th>
            <th scope="col" class="px-6 py-3 w-[200px]">Climate Location</th>
            <th scope="col" class="px-6 py-3 w-[300px] text-center">Types</th>
          </tr>
        </thead>
        <tbody>
          @if (wmas$ | async; as wmas) {
            @for (wma of wmas; track wma.id) {
              <tr class="border-gray-400 border-b-2">
                <td class="px-6 py-4">
                  <a class="font-semibold hover:underline cursor-pointer" (click)="openWmaForm(wma)">{{ wma.name }}</a> ({{ wma.id }})
                  @if (wma.physLat && wma.physLong && wma.histClimateLat && wma.histClimateLong) {
                    <a href="https://www.google.com/maps/dir/{{ wma.physLat }},{{ wma.physLong }}/+/{{ wma.histClimateLat }},{{ wma.histClimateLong }}" target="_blank">
                      <ng-icon name="heroMapPin" class="mr-1"></ng-icon>
                    </a>
                  }
                  @if (wma.acres) {
                    <div class="text-xs">Acreage: <span class="font-bold">{{ wma.acres }}</span></div>
                  }
                </td>
                <td class="px-6 py-4">
                  <div class="font-semibold">{{ wma.physTown }}</div>
                  @if (!wma.physLat || !wma.physLong) {
                    <div class="text-xs text-red-500">No Coordinates</div>
                  } @else {
                    <div class="text-xs">{{ wma.physLat }}, {{ wma.physLong }}</div>
                  }
                </td>
                <td class="px-6 py-4">
                  <div class="font-semibold">
                    @if (wma.hasDailyData === false) {
                      <ng-icon name="heroExclamationTriangleSolid" class="text-yellow-300" />
                    }
                    {{ wma.histClimateTown }}
                  </div>
                  <div class="text-xs">{{ wma.histClimateLat }}, {{ wma.histClimateLong }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="grid grid-cols-2">
                    <div class="text-xs">State Park</div>
                    <div>
                      @if (wma.isSP) {
                        <ng-icon name="heroCheckCircleSolid" class="text-green-500" />
                      } @else {
                        <ng-icon name="heroXCircleSolid" class="text-red-500" />
                      }
                    </div>
                    <div class="text-xs">VPA</div>
                    <div>
                      @if (wma.isVPA) {
                        <ng-icon name="heroCheckCircleSolid" class="text-green-500" />
                      } @else {
                        <ng-icon name="heroXCircleSolid" class="text-red-500" />
                      }
                    </div>
                    <div class="text-xs">Bonus/Quota Hunts</div>
                    <div>
                      @if (wma.hasBonusQuotas) {
                        <ng-icon name="heroCheckCircleSolid" class="text-green-500" />
                      } @else {
                        <ng-icon name="heroXCircleSolid" class="text-red-500" />
                      }
                    </div>
                  </div>
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminWmasComponent implements OnInit {

  @ViewChild('wmaFormModal') wmaFormModal: WmaFormComponent | undefined;
  @ViewChild('filterText') filterText: ElementRef | undefined;
  @ViewChild('missingCoords') missingCoords: ElementRef | undefined;
  @ViewChild('missingDailyAvgs') missingDailyAvgs: ElementRef | undefined;

  private _store = inject(Store<AppStateInterface>);

  filterText$ = new BehaviorSubject<string>('');
  missingCoords$ = new BehaviorSubject<boolean>(false);
  missingDailyAvgs$ = new BehaviorSubject<boolean>(false);

  modalClosedSubscription: Subscription | undefined;

  wmas$ =
    combineLatest([
      this._store.select(selectWmas),
      this.filterText$.pipe(startWith('')),
      this.missingCoords$.pipe(startWith(false)),
      this.missingDailyAvgs$.pipe(startWith(false))
    ])
    .pipe(
      map(([wmas, filterText, missingCoords, missingDailyAvgs]) => {
        // console.log('wmas', wmas, 'filterText', filterText, 'missingCoords', missingCoords, 'missingDailyAvgs', missingDailyAvgs);
        let filteredWmas = wmas?.filter(wma => wma.name.toLowerCase().includes(filterText.toLowerCase())) || [];
        if (missingCoords === true) {
          filteredWmas = filteredWmas.filter(wma => !wma.physLat || !wma.physLong);
        }
        if (missingDailyAvgs === true) {
          filteredWmas = filteredWmas.filter(wma => wma.hasDailyData === false);
        }
        return filteredWmas;
      })
    )

  ngOnInit(): void {
    this._store.dispatch(adminActions.enterWmasPage());
  }

  filterWmas(filterText: string) {
    this.filterText$.next(filterText);
  }

  missingCoordsChanged(value: boolean) {
    this.missingCoords$.next(value);
  }

  missingDailyAvgsChanged(value: boolean) {
    this.missingDailyAvgs$.next(value);
  }

  clearSearch() {
    this.filterText!.nativeElement.value = ''; // Remove optional chaining operator
    this.filterText$.next('');
  }

  openWmaForm(wma: Wma): void {
    this.wmaFormModal?.openWmaForm(wma);
  }

}
