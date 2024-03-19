import { AfterViewInit, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { NgIcon } from "@ng-icons/core";
import { Store } from "@ngrx/store";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import { Subject, takeUntil } from "rxjs";
import * as successMapSelectors from 'store/successMap/successMap.selectors';
import * as mapActions from 'store/successMap/successMap.actions';
import { SeasonTextPipe } from "@pipes";

@Component({
  selector: "gawmas-success-map-filters",
  standalone: true,
  imports: [SHARED_MODULES, ReactiveFormsModule, NgIcon, SeasonTextPipe],
  styles: [`
    .filter-box {
      position: absolute;
      z-index: 9999;
      left: 25;
    }
  `],
  template: `
    <div class="ml-2 z-9999 text-gray-200 text-xs border-r border-b border-gray-600 rounded-br-2xl bg-gray-900 filter-box p-2 animate-jump-in animate-delay-100 animate-once">
      <div class="mb-2 text-base flex items-center border-b border-gray-400 justify-center">
        <span class="border-r border-gray-600 px-2">
          {{ (seasons$ | async)! | seasonText:mapFilterForm.controls.season.value ?? ''}}
        </span>
        <span class="italic ml-2 tracking-widest"> {{ mapTitle$ | async }}</span>
      </div>
      <form [formGroup]="mapFilterForm">
        <div class="flex items-center">

          <select formControlName="season" class="select py-2 px-3">
            @for (s of seasons$ | async; track s.id) {
              <option [value]="s.id" [innerHTML]="s.season"></option>
            }
          </select>

          <ul class="invisible md:visible w-full gap-0 inline-flex ml-2">
            <li>
              <input type="radio" id="successRadio" formControlName="statType" value="hosting-small" class="hidden peer" value="success">
              <label for="successRadio"
                class="rounded-l-full px-3 py-2 inline-flex items-center justify-between bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800 text-nowrap">
                  Success Rate
              </label>
            </li>
            <li>
              <input type="radio" id="rateRadio" formControlName="statType" value="hosting-small" class="hidden peer" value="harvestrate">
              <label for="rateRadio"
                class="inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800 text-nowrap">
                  Harvest per Acre
              </label>
            </li>
            <li>
              <input type="radio" id="harvestRadio" formControlName="statType" value="hosting-small" class="hidden peer" value="harvest">
              <label for="harvestRadio"
                class="rounded-r-full inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800 text-nowrap">
                Total Harvest
              </label>
            </li>
          </ul>

          <ul class="invisible md:visible w-full gap-0 inline-flex ml-2">
            <li>
              <input type="radio" id="archery" formControlName="weapon" value="hosting-small" class="hidden peer" value="2">
              <label for="archery"
                class="rounded-l-full px-3 py-2 inline-flex items-center justify-between bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800">
                  Archery
              </label>
            </li>
            <li>
              <input type="radio" id="primitive" formControlName="weapon" value="hosting-small" class="hidden peer" value="3">
              <label for="primitive"
                class="inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800">
                  Primitive
              </label>
            </li>
            <li>
              <input type="radio" id="firearms" formControlName="weapon" value="hosting-small" class="hidden peer" value="1">
              <label for="firearms"
                class="inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800">
                  Firearms
              </label>
            </li>
            <li>
              <input type="radio" id="any" formControlName="weapon" value="hosting-small" class="hidden peer" value="0">
              <label for="any"
                class="rounded-r-full inline-flex items-center justify-between px-3 py-2 bg-gray-700 cursor-pointer peer-checked:bg-blue-600 peer-checked:underline peer-checked:font-bold hover:bg-gray-800">
                  Any
              </label>
            </li>
          </ul>

          <!-- <div class="ml-2">
            <button data-tooltip-target="extenttip">
              <ng-icon name="heroGlobeAlt" class="text-2xl text-gray-200"></ng-icon>
            </button>
            <div id="extenttip" role="tooltip"
              class="absolute z-10 invisible inline-block px-3 py-2 text-xs font-medium text-gray-800 transition-opacity duration-300 bg-gray-300 rounded-full shadow-sm opacity-0 tooltip">
                Zoom to full extent
              <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>

          <div class="ml-2">
            <button data-popover-target="mappop" data-popover-placement="right">
              <ng-icon name="heroInformationCircle" class="text-2xl text-gray-200"></ng-icon>
            </button>
          </div>
          <div data-popover id="mappop" role="tooltip" class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0">
            <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
              <h3 class="font-semibold text-gray-900">About this Map</h3>
            </div>
            <div class="px-3 py-2">
              <p>Map visualization of total deer harvest or success rates based on WMA location. Use the toggles to explore. The larger the dot, the larger the value.</p>
            </div>
            <div data-popper-arrow></div>
          </div> -->

        </div>
      </form>

    </div>
  `,
})
export class SuccessMapFiltersComponent implements AfterViewInit, OnDestroy {

  private _store = inject(Store<AppStateInterface>);
  private _formBuilder = inject(FormBuilder);

  seasons$ = this._store.select(successMapSelectors.selectSeasons);
  mapTitle$ = this._store.select(successMapSelectors.selectMapTitle);

  mapFilterForm = this._formBuilder.group({
    season: [''],
    weapon: [''],
    statType: ['']
  });

  private destroyed$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterViewInit(): void {

    this.mapFilterForm.patchValue({
      weapon: '0',
      statType: 'success',
      season: '13'
    });

    this.mapFilterForm.controls.weapon.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((weapon) => {
        if (weapon) {
          this._store.dispatch(mapActions.weaponChange({ weaponId: +weapon }))
        }
      });

    this.mapFilterForm.controls.season.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((season) => {
        if (season) {
          this._store.dispatch(mapActions.getSeasonMapData({
            seasonId: +season, dataType: this.mapFilterForm.controls.statType.value!
          }));
        }
      });

    this.mapFilterForm.controls.statType.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((statType) => {
        if (statType) {
          this._store.dispatch(mapActions.getSeasonMapData({
            seasonId: +this.mapFilterForm.controls.season.value!, dataType: statType
          }));
        }
      });

  }

}
