import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, computed, inject, signal } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FilterAuxData, Season, Weapon, Wma } from "@model";
import { SHARED_MODULES } from "@shared-imports";
import { Subject, Subscription, distinctUntilChanged, filter, map, take, takeUntil, tap } from "rxjs";
import { AppStateInterface } from "@store-model";
import { Store } from "@ngrx/store";
import { NgIconComponent } from "@ng-icons/core";
import { selectFiltersAuxData, selectFiltersAuxDataLoading } from 'store/filters/filters.selectors';
import { selectFilter } from 'store/hunts/hunts.selectors';
import { FormArrayPipe } from "@pipes";
import { DrawerComponent } from "_shared/components/drawer.component";
import * as filterActions from 'store/filters/filters.actions';
import * as huntsActions from 'store/hunts/hunts.actions';
import { FilterObjNamePipe } from "_shared/pipes/filter-obj-name.pipe";
import { toSignal } from '@angular/core/rxjs-interop';
import { Tooltip, TooltipOptions, TooltipTriggerType } from "flowbite";

@Component({
  selector: 'hunt-filters',
  standalone: true,
  imports: [SHARED_MODULES, ReactiveFormsModule,
    NgIconComponent, FormArrayPipe, DrawerComponent,
    FilterObjNamePipe],
  templateUrl: './filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit, OnDestroy {

  @ViewChild('filterDrawer') filterDrawer!: DrawerComponent;
  filterDrawerSubscription: Subscription | undefined;

  filterDrawerTarget = 'filter-drawer';

  private _destroyed$ = new Subject<void>();

  private _store = inject(Store<AppStateInterface>);
  private _formBuilder = inject(FormBuilder);
  private _cdr = inject(ChangeDetectorRef);

  auxData$ = this._store.select(selectFiltersAuxData);
  isLoading$ = this._store.select(selectFiltersAuxDataLoading);
  filter$ = this._store.select(selectFilter);

  auxData: FilterAuxData = { wmas: [], seasons: [], weapons: [], filteredWmas: [] };

  filterForm: FormGroup = this._formBuilder.group({
    wmas: this._formBuilder.array([]),
    wmaFilter: '',
    successRate: 0,
    seasons: this._formBuilder.array([]),
    weapons: this._formBuilder.array([])
  });

  selectedWmasCount = signal(0);
  noFilteredWmasFound = signal(false);
  selectedWmaIds = signal<number[]>([]);
  selectedSeasonIds = signal<number[]>([]);
  selectedWeaponIds = signal<number[]>([]);

  successRateSet = signal(false);
  filterCount = computed(() => {
    return this.selectedWmasCount() +
      this.selectedSeasonIds().length +
      this.selectedWeaponIds().length +
      (this.successRateSet() ? 1 : 0)
  });

  // filterCount2 = toSignal(this.filterForm.valueChanges, {initialValue: ''})

  ngOnInit(): void {

    this._store.dispatch(filterActions.getFilterAuxData());

    this.filterForm.valueChanges
      .pipe(
        takeUntil(this._destroyed$),
        distinctUntilChanged(),
        map(originalValue => {
          return Object.keys(originalValue).reduce((result: any, key) => {
            if (key !== 'wmaFilter') {
              result[key] = originalValue[key];
            }
            return result;
          }, {});
        }))
      .subscribe(value =>  {
        if (value) {
          this.selectedWmasCount.set(value.wmas.filter((wma: boolean) => wma).length);
          this.selectedSeasonIds.set(this.controlCheckedCount('seasons'));
          this.selectedWeaponIds.set(this.controlCheckedCount('weapons'));
          this.successRateSet.set(value.successRate > 0);
        }
      });

    this.filterForm.controls['wmaFilter'].valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroyed$))
      .subscribe((value: string) => {
        this.selectedWmaIds.set(this.controlCheckedCount('wmas'));
        this.auxData.filteredWmas.forEach((wma: Wma) => {
          if (!Array.from(this.selectedWmaIds()).includes(wma.id)) {
            wma.visible = (wma.name.toLowerCase().includes(value?.toLowerCase()));
          }
        });
        this.noFilteredWmasFound.set(this.auxData.filteredWmas.every((wma: Wma) => !wma.visible));
      });

  }

  controlCheckedCount(name: string): number[] {
    return this.filterForm.controls[name].value
      .map((checked: any, i: number) => checked ? (this.auxData as any)[name][i].id : null)
      .filter((v: null | number) => v !== null);
  }

  openFiltersDrawer() {

    if (this.auxData.wmas.length === 0) {
      this.auxData$
        .pipe(
          take(1),
          takeUntil(this._destroyed$),
          tap((auxData) => this.auxData = auxData),
          map((auxData) => {
            const updatedWmas = auxData.wmas.map((wma: Wma) => ({ ...wma, visible: true }));
            return { ...auxData, wmas: [...updatedWmas], filteredWmas: [...updatedWmas] };
          }),
          tap((auxData) => this.auxData = auxData))
        .subscribe((auxData: FilterAuxData) => {
          for (let key of Object.keys(auxData)) {
            if (key !== 'filteredWmas') {
              this.buildCheckBoxes(auxData[key as keyof FilterAuxData]);
            }
          }
        });
    }

    this.filterDrawer.open();
    this.listenToDrawerEvents();

  }

  private listenToDrawerEvents() {
    this.filterDrawerSubscription = this.filterDrawer.closeEvent
      .subscribe((event: any) => {
        // console.log(event);
        this.filterDrawerSubscription?.unsubscribe();
        if (event.data) {
          this._store.dispatch(huntsActions.filtersChanged({
            filter: {
              skip: 0,
              wmas: event.data.wmas,
              seasons: event.data.seasons,
              weapons: event.data.weapons,
              successRate: event.data.successRate
            }
          }));
        }
      });
  }

  private buildCheckBoxes = (data: Wma[] | Season[] | Weapon[]) => {
    data.forEach((item: Wma | Season | Weapon) => {
      const arrayName = item.hasOwnProperty('season') ? 'seasons' : item.hasOwnProperty('locationId') ? 'wmas' : 'weapons';
      (this.filterForm.controls[arrayName] as unknown as FormArray)
        .push(new FormControl(false));
    });
  };

  clearSearch() {
    this.filterForm.controls['wmaFilter'].setValue('');
  }

  apply() {
    this.filterDrawer.save({
      ...this.filterForm.value,
      wmas: this.extractCheckIds('wmas', 'wmas'),
      seasons: this.extractCheckIds('seasons', 'seasons'),
      weapons: this.extractCheckIds('weapons', 'weapons'),
      successRate: this.filterForm.controls['successRate'].value
    });
  }

  private extractCheckIds(ctrlName: string, collectionName: string): number[] {
    return this.filterForm.controls[ctrlName].value
      .map((checked: boolean, i: number) => checked ? this.auxData[collectionName as keyof FilterAuxData][i].id : null)
      .filter((v: null | number) => v !== null);
  }

  showRemoveFilterTooltip(targetElId: string, triggerType: TooltipTriggerType, event: any) {
    const targetEl = document.getElementById(targetElId)
    const tooltip = new Tooltip(targetEl, event.target as HTMLElement, { triggerType });
    tooltip.show();
  }

  cancel() {
    this.clearFilters();
    this.filterDrawer.close();
  }

  clearFilters() {
    this.filterForm.reset();
    this.filterForm.controls['successRate'].setValue(0);
    this.filterForm.controls['wmaFilter'].setValue('');
    this.auxData.filteredWmas.forEach((wma: Wma) => wma.visible = true);
    this.noFilteredWmasFound.set(false);
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

}
