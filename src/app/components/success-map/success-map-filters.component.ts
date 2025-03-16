import { WeaponService } from '@services';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import { Subject, takeUntil } from "rxjs";
import * as successMapSelectors from 'store/successMap/successMap.selectors';
import * as mapActions from 'store/successMap/successMap.actions';

@Component({
    selector: "gawmas-success-map-filters",
    imports: [SHARED_MODULES, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
    .filter-box {
      position: absolute;
      z-index: 9999;
      left: 25;
    }
  `],
    template: `
    <div class="bg-gray-800 md:bg-gray-900 md:rounded-tl-2xl text-gray-200 text-xs md:text-sm md:p-2 md:animate-jump-in md:animate-delay-100 md:animate-once">

      <form [formGroup]="mapFilterForm" class="form">

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
          <ul>
            <li>
              <input type="radio" id="success" formControlName="mapType" class="hidden peer"
                value="success" />
              <label for="success" class="map-filter-opt rounded-t-xl" (click)="updateMapType('success')">
                Success Rate
              </label>
            </li>
            <li>
              <input type="radio" id="harvestrate" formControlName="mapType" class="hidden peer"
                value="harvestrate" />
              <label for="harvestrate" class="map-filter-opt" (click)="updateMapType('harvestrate')">
                Harvest/Acre
              </label>
            </li>
            <li>
              <input type="radio" id="harvest" formControlName="mapType" class="hidden peer"
                value="harvest" />
              <label for="harvest" class="map-filter-opt rounded-b-xl" (click)="updateMapType('harvest')">
                Total Harvest
              </label>
            </li>
          </ul>
        </div>

        <div class="w-full p-2">
          <div class="font-semibold text-left mb-1 pl-1">Weapon</div>
          <ul>
            <li>
              <input type="radio" id="archery" formControlName="weapon" value="2" class="hidden peer">
              <label for="archery" class="map-filter-opt rounded-t-xl" (click)="updateWeapon('2')">Archery</label>
            </li>
            <li>
              <input type="radio" id="firearms" formControlName="weapon" value="1" class="hidden peer">
              <label for="firearms" class="map-filter-opt" (click)="updateWeapon('1')">Firearms</label>
            </li>
            <li>
              <input type="radio" id="primitive" formControlName="weapon" value="3" class="hidden peer">
              <label for="primitive" class="map-filter-opt" (click)="updateWeapon('3')">Primitive</label>
            </li>
            <li>
              <input type="radio" id="all" formControlName="weapon" value="0" class="hidden peer">
              <label for="all" class="map-filter-opt rounded-b-xl" (click)="updateWeapon('0')">All Weapons</label>
            </li>
          </ul>
        </div>

        <!-- <pre>{{ mapFilterForm.value | json }}</pre> -->

      </form>

    </div>
  `
})
export class SuccessMapFiltersComponent implements OnInit, OnDestroy {

  private _store = inject(Store<AppStateInterface>);
  private _formBuilder = inject(FormBuilder);
  private _cdr = inject(ChangeDetectorRef);

  seasons$ = this._store.select(successMapSelectors.selectSeasons);
  mapTitle$ = this._store.select(successMapSelectors.selectMapTitle);

  mapFilterForm = this._formBuilder.group({
    season: [''],
    weapon: [''],
    mapType: ['']
  });

  private _destroyed$ = new Subject<void>();

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  ngOnInit(): void {

    this.mapFilterForm.patchValue({
      season: '14',
      weapon: '0',
      mapType: 'success'
    });

    this.mapFilterForm.controls.weapon.valueChanges
      .pipe(takeUntil(this._destroyed$))
      .subscribe((weapon) => {
        if (weapon) {
          this._store.dispatch(mapActions.weaponChange({ weaponId: +weapon }));
        }
      });

    this.mapFilterForm.controls.season.valueChanges
      .pipe(takeUntil(this._destroyed$))
      .subscribe((season) => {
        if (season) {
          this._store.dispatch(mapActions.getSeasonMapData({
            seasonId: +season, dataType: this.mapFilterForm.controls.mapType.value!
          }));
        }
      });

    this.mapFilterForm.controls.mapType.valueChanges
      .pipe(takeUntil(this._destroyed$))
      .subscribe((mapType) => {
        if (mapType) {
          this._store.dispatch(mapActions.getSeasonMapData({
            seasonId: +this.mapFilterForm.controls.season.value!, dataType: mapType
          }));
        }
      });

  }

  updateMapType(mapType: string) {
    this.mapFilterForm.controls.mapType.setValue(mapType, { emitEvent: false });
  }

  updateWeapon(weaponId: string) {
    this.mapFilterForm.controls.weapon.setValue(weaponId, { emitEvent: false });
  }

}
