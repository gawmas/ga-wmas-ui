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
import { BehaviorSubject, combineLatest, map, startWith } from 'rxjs';
import * as adminActions from "store/admin/admin.actions";

@Component({
  selector: 'gawmas-admin-wmas',
  standalone: true,
  imports: [SHARED_MODULES, NgIconComponent, FormsModule,
    ModalComponent, WmaFormComponent, ClimateLocationsMapComponent],
  template: `
    <gawmas-wma-form #wmaFormModal />
    <div class="m-3 bg-gray-800">
      <div class="relative mb-1">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg class="w-4 h-4 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input #filterText type="search" (input)="filterWmas(filterText.value)"
          class="block w-full h-2 p-4 ps-10 text-gray-300 placeholder:text-gray-300 border border-gray-500 rounded-t-lg bg-gray-600 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Filter...">
        <div class="text-gray-300 h-2 absolute end-2 bottom-5 text-xs">
          @if (filterText.value.length > 0) {
            <a class="cursor-pointer hover:text-white" (click)="clearSearch()">
              <ng-icon name="heroXMark" class="text-xl font-extrabold"></ng-icon>
            </a>
          }
        </div>
      </div>
      <table class="w-[95%] text-sm text-left text-gray-300 -pt-2">
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
                  <div class="font-semibold">{{ wma.histClimateTown }}</div>
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

  private _store = inject(Store<AppStateInterface>);

  filterText$ = new BehaviorSubject<string>('');
  filteredWmas: Wma[] = [];

  wmas$ =
    combineLatest([
      this._store.select(selectWmas),
      this.filterText$.pipe(startWith(''))
    ])
    .pipe(
      map(([wmas, filterText]) => wmas?.filter(wma => wma.name.toLowerCase().includes(filterText.toLowerCase())) || [])
    )

  ngOnInit(): void {
    this._store.dispatch(adminActions.enterWmasPage());
  }

  filterWmas(filterText: string) {
    this.filterText$.next(filterText);
  }

  clearSearch() {
    this.filterText!.nativeElement.value = ''; // Remove optional chaining operator
    this.filterText$.next('');
  }

  openWmaForm(wma: Wma): void {
    this.wmaFormModal?.openWmaForm(wma);
  }

}
