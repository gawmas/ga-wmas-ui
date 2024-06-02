import { AfterViewInit, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { NgIcon } from "@ng-icons/core";
import { Store } from "@ngrx/store";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import { Subject, takeUntil } from "rxjs";
import { SeasonTextPipe } from "@pipes";
import * as successMapSelectors from 'store/successMap/successMap.selectors';
import * as mapActions from 'store/successMap/successMap.actions';

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
    <div class="h-[70vh] bg-gray-900 text-gray-200 text-xs md:text-sm md:p-2 animate-jump-in animate-delay-100 animate-once">

      <form [formGroup]="mapFilterForm">

        <div class="w-full p-2">
          <div class="font-semibold text-left mb-1 pl-1">Season</div>
          <select formControlName="season" class="select py-2 px-3 w-full">
            @for (s of seasons$ | async; track s.id) {
              <option [value]="s.id" [innerHTML]="s.season"></option>
            }
          </select>
        </div>

        <div class="w-full p-2">
          <div class="font-semibold text-left mb-1 pl-1">Map Type</div>
          <ul class="invisible md:visible">
            <li>
              <input type="radio" id="successRadio" formControlName="statType" value="hosting-small" class="hidden peer" value="success">
              <label for="successRadio" class="map-filter-opt rounded-t-xl">Success Rate</label>
            </li>
            <li>
              <input type="radio" id="rateRadio" formControlName="statType" value="hosting-small" class="hidden peer" value="harvestrate">
              <label for="rateRadio" class="map-filter-opt">Harvest/Acre</label>
            </li>
            <li>
              <input type="radio" id="harvestRadio" formControlName="statType" value="hosting-small" class="hidden peer" value="harvest">
              <label for="harvestRadio" class="map-filter-opt rounded-b-xl">Total Harvest</label>
            </li>
          </ul>
        </div>

        <div class="w-full p-2">
          <div class="font-semibold text-left mb-1 pl-1">Weapon</div>
          <ul class="invisible md:visible">
            <li>
              <input type="radio" id="archery" formControlName="weapon" value="hosting-small" class="hidden peer" value="2">
              <label for="archery" class="map-filter-opt rounded-t-xl">Archery</label>
            </li>
            <li>
              <input type="radio" id="firearms" formControlName="weapon" value="hosting-small" class="hidden peer" value="1">
              <label for="firearms" class="map-filter-opt">Firearms</label>
            </li>
            <li>
              <input type="radio" id="primitive" formControlName="weapon" value="hosting-small" class="hidden peer" value="3">
              <label for="primitive" class="map-filter-opt">Primitive</label>
            </li>
            <li>
              <input type="radio" id="all" formControlName="weapon" value="hosting-small" class="hidden peer" value="0">
              <label for="all" class="map-filter-opt rounded-b-xl">All Weapons</label>
            </li>
          </ul>
        </div>

      </form>

      <div class="w-full p-2 text-center">
        <button (click)="zoomFull()" class="btn btn-dark mt-2 flex items-center">
          <ng-icon name="heroGlobeAlt" class="text-lg text-gray-200 ml-2 mr-1"></ng-icon>
          Full Extent
        </button>
      </div>

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

  private _destroyed$ = new Subject<void>();

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngAfterViewInit(): void {

    this.mapFilterForm.patchValue({
      weapon: '0',
      statType: 'success',
      season: '13'
    });

    this.mapFilterForm.controls.weapon.valueChanges
      .pipe(takeUntil(this._destroyed$))
      .subscribe((weapon) => {
        if (weapon) {
          this._store.dispatch(mapActions.weaponChange({ weaponId: +weapon }))
        }
      });

    this.mapFilterForm.controls.season.valueChanges
      .pipe(takeUntil(this._destroyed$))
      .subscribe((season) => {
        if (season) {
          this._store.dispatch(mapActions.getSeasonMapData({
            seasonId: +season, dataType: this.mapFilterForm.controls.statType.value!
          }));
        }
      });

    this.mapFilterForm.controls.statType.valueChanges
      .pipe(takeUntil(this._destroyed$))
      .subscribe((statType) => {
        if (statType) {
          this._store.dispatch(mapActions.getSeasonMapData({
            seasonId: +this.mapFilterForm.controls.season.value!, dataType: statType
          }));
        }
      });

  }

  zoomFull(): void {
    this._store.dispatch(mapActions.setZoomFull({ value: true }));
  }

}
