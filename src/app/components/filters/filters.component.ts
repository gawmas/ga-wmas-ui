import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, computed, inject, signal } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FilterAuxData, Season, Weapon, Wma } from "@model";
import { SHARED_MODULES } from "@shared-imports";
import { Subject, Subscription, combineLatest, distinctUntilChanged, map, startWith, take, takeUntil, tap } from "rxjs";
import { AppStateInterface } from "@store-model";
import { Store } from "@ngrx/store";
import { NgIconComponent } from "@ng-icons/core";
import { selectFiltersAuxData, selectFiltersAuxDataLoading } from 'store/filters/filters.selectors';
import { selectFilter } from 'store/hunts/hunts.selectors';
import { FormArrayPipe } from "@pipes";
import { DrawerComponent } from "_shared/components/drawer.component";
import { FilterObjNamePipe } from "_shared/pipes/filter-obj-name.pipe";
import { Tooltip, TooltipTriggerType } from "flowbite";
import * as filterActions from 'store/filters/filters.actions';
import * as huntsActions from 'store/hunts/hunts.actions';

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

  sortForm: FormGroup = this._formBuilder.group({
    sort: ''
  });

  filterForm: FormGroup = this._formBuilder.group({
    isStatePark: false,
    isVpa: false,
    wmas: this._formBuilder.array([]),
    wmaFilter: '',
    successRate: 0,
    seasons: this._formBuilder.array([]),
    weapons: this._formBuilder.array([]),
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

  ngOnInit(): void {

    this._store.dispatch(filterActions.getFilterAuxData());

    this.sortForm.controls['sort'].valueChanges
      .pipe(
        takeUntil(this._destroyed$),
        distinctUntilChanged())
      .subscribe((sortValue: string) => {
        this._store.dispatch(huntsActions.filtersChanged({
          filter: {
            skip: 0,
            wmas: this._extractCheckIds('wmas', 'wmas'),
            seasons: this._extractCheckIds('seasons', 'seasons'),
            weapons: this._extractCheckIds('weapons', 'weapons'),
            successRate: this.filterForm.controls['successRate'].value,
            sort: sortValue
          }
        }));
      });

    // Listen to changes for the checkbox arrays ...
    combineLatest([
      this.filterForm.controls['wmas'].valueChanges.pipe(startWith([])),
      this.filterForm.controls['seasons'].valueChanges.pipe(startWith([])),
      this.filterForm.controls['weapons'].valueChanges.pipe(startWith([])),
      this.filterForm.controls['successRate'].valueChanges.pipe(startWith([]))])
      .pipe(
        takeUntil(this._destroyed$),
        distinctUntilChanged())
      .subscribe(([wmas, seasons, weapons, successRate]) => {
        this.selectedWmasCount.set(wmas.filter((wma: boolean) => wma).length);
        this.selectedSeasonIds.set(this._controlCheckedCount('seasons'));
        this.selectedWeaponIds.set(this._controlCheckedCount('weapons'));
        this.successRateSet.set(successRate > 0);
      });

    // Listen for changes to the "state park"/"vpa" toggles ...
    combineLatest([
      this.filterForm.controls['isStatePark'].valueChanges.pipe(startWith(false)),
      this.filterForm.controls['isVpa'].valueChanges.pipe(startWith(false))])
      .pipe(
        takeUntil(this._destroyed$),
        distinctUntilChanged())
      .subscribe(([isStatePark, isVpa]) => {
        this._filterWmaType(isStatePark, isVpa);
      });

    // Filter WMAs by name ...
    this.filterForm.controls['wmaFilter'].valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroyed$))
      .subscribe((value: string) => {
        this.selectedWmaIds.set(this._controlCheckedCount('wmas'));
        this.auxData.filteredWmas.forEach((wma: Wma) => {
          if (!Array.from(this.selectedWmaIds()).includes(wma.id)) { // Exclude WMAs that are already selected
            wma.visible = (wma.name.toLowerCase().includes(value?.toLowerCase()));
          }
        });
        this.noFilteredWmasFound.set(this.auxData.filteredWmas.every((wma: Wma) => !wma.visible));
      });

  }

  private _filterWmaType(isStatePark: boolean, isVpa: boolean) {
    this.auxData.filteredWmas.forEach((wma: Wma) => {
      if (!Array.from(this.selectedWmaIds()).includes(wma.id)) { // Exclude WMAs that are already selected
        if (isStatePark && isVpa) {
          wma.visible = wma.isSP === isStatePark || wma.isVPA === isVpa;
        } else if (isStatePark && !isVpa) {
          wma.visible = wma.isSP === isStatePark;
        } else if (!isStatePark && isVpa) {
          wma.visible = wma.isVPA === isVpa;
        } else {
          wma.visible = true;
        }
      }
    });
  }

  private _controlCheckedCount(name: string): number[] {
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
              this._buildCheckBoxes(auxData[key as keyof FilterAuxData]);
            }
          }
        });
    }

    this.filterDrawer.open();
    this._listenToDrawerEvents();

  }

  private _listenToDrawerEvents() {
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
              successRate: event.data.successRate,
              sort: event.data.sort
            }
          }));
        }
      });
  }

  private _buildCheckBoxes = (data: Wma[] | Season[] | Weapon[]) => {
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
      wmas: this._extractCheckIds('wmas', 'wmas'),
      seasons: this._extractCheckIds('seasons', 'seasons'),
      weapons: this._extractCheckIds('weapons', 'weapons'),
      successRate: this.filterForm.controls['successRate'].value
    });
  }

  private _extractCheckIds(ctrlName: string, collectionName: string): number[] {
    return this.filterForm.controls[ctrlName].value
      .map((checked: boolean, i: number) => checked ? this.auxData[collectionName as keyof FilterAuxData][i].id : null)
      .filter((v: null | number) => v !== null);
  }

  showRemoveFilterTooltip(targetElId: string, triggerType: TooltipTriggerType, event: any) {
    const targetEl = document.getElementById(targetElId)
    const tooltip = new Tooltip(targetEl, event.target as HTMLElement, { triggerType });
    tooltip.show();
  }

  removeCheckboxFilter(id: number, collectionName: string) {
    const formArray: FormArray = this.filterForm.controls[collectionName] as FormArray;
    let index: number | undefined;
    if (collectionName === 'wmas') {
      index = (this.auxData[collectionName] as Wma[]).findIndex(item => item.id === id);
    } else if (collectionName === 'seasons') {
      index = (this.auxData[collectionName] as Season[]).findIndex(item => item.id === id);
    } else if (collectionName === 'weapons') {
      index = (this.auxData[collectionName] as Weapon[]).findIndex(item => item.id === id);
    }
    formArray.at(index!).patchValue(false);
    this._store.dispatch(huntsActions.filtersChanged({
      filter: {
        skip: 0,
        wmas: this._extractCheckIds('wmas', 'wmas'),
        seasons: this._extractCheckIds('seasons', 'seasons'),
        weapons: this._extractCheckIds('weapons', 'weapons'),
        successRate: this.filterForm.controls['successRate'].value,
        sort: this.sortForm.controls['sort'].value
      }
    }));
  }

  removeSuccessRate() {
    this.filterForm.controls['successRate'].setValue(0);
    this._store.dispatch(huntsActions.filtersChanged({
      filter: {
        skip: 0,
        wmas: this._extractCheckIds('wmas', 'wmas'),
        seasons: this._extractCheckIds('seasons', 'seasons'),
        weapons: this._extractCheckIds('weapons', 'weapons'),
        successRate: this.filterForm.controls['successRate'].value,
        sort: this.sortForm.controls['sort'].value
      }
    }));
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
