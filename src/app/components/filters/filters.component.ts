import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, computed, inject, signal } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Filter, FilterAuxData, Season, Weapon, Wma } from "@model";
import { SHARED_MODULES } from "@shared-imports";
import { Subject, Subscription, combineLatest, delay, distinctUntilChanged, map, startWith, take, takeUntil, tap } from "rxjs";
import { AppStateInterface } from "@store-model";
import { Store } from "@ngrx/store";
import { NgIconComponent } from "@ng-icons/core";
import { selectFiltersAuxData, selectSeasons, selectWeapons, selectWmas } from 'store/filters/filters.selectors';
import { selectFilter, selectHuntsLoading } from 'store/hunts/hunts.selectors';
import { FormArrayPipe, WxAvgTempDeparturePipe } from "@pipes";
import { DrawerComponent } from "_shared/components/drawer.component";
import { FilterObjNamePipe } from "_shared/pipes/filter-obj-name.pipe";
import { Tooltip, TooltipTriggerType } from "flowbite";
import { TempDepartLabelPipe } from "_shared/pipes/temp-depart-label.pipe";
import * as huntsActions from 'store/hunts/hunts.actions';

@Component({
  selector: 'gawmas-hunt-filters',
  standalone: true,
  imports: [SHARED_MODULES, ReactiveFormsModule,
    NgIconComponent, FormArrayPipe, DrawerComponent,
    FilterObjNamePipe, TempDepartLabelPipe],
  templateUrl: './filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements AfterViewInit, OnDestroy {

  @ViewChild('filterDrawer') filterDrawer!: DrawerComponent;
  filterDrawerSubscription: Subscription | undefined;

  filterDrawerTarget = 'filter-drawer';

  private _destroyed$ = new Subject<void>();

  private _store = inject(Store<AppStateInterface>);
  private _formBuilder = inject(FormBuilder);
  private _cdr = inject(ChangeDetectorRef);

  // Store selectors ...
  auxData$ = this._store.select(selectFiltersAuxData);
  wmas$ = this._store.select(selectWmas);
  weapons$ = this._store.select(selectWeapons);
  seasons$ = this._store.select(selectSeasons);
  isLoading$ = this._store.select(selectHuntsLoading);
  filter$ = this._store.select(selectFilter);

  // Initialize local auxillary data for the form controls ...
  auxData: FilterAuxData = { wmas: [], seasons: [], weapons: [], histClimateLocations: [], filteredWmas: [] };

  sortForm: FormGroup = this._formBuilder.group({
    sort: ''
  });

  filterForm: FormGroup = this._formBuilder.group({
    isStatePark: false,
    isVpa: false,
    isBonusQuota: false,
    wmas: this._formBuilder.array([]),
    wmaFilter: '',
    successRate: 0,
    seasons: this._formBuilder.array([]),
    weapons: this._formBuilder.array([]),
    avgTemp: '0',
    phase: ''
  });

  // Signals to indicate the number of selected criteria in the filter form ...
  selectedWmasCount = signal(0);
  noFilteredWmasFound = signal(false);
  selectedWmaIds = signal<number[]>([]);
  selectedSeasonIds = signal<number[]>([]);
  selectedWeaponIds = signal<number[]>([]);
  togglesCount = signal(0);
  successRateSet = signal(false);
  wxControlCount = signal(0);
  preSelectedFilters: Filter | undefined;
  filterCount = computed(() => {
    return this.selectedWmasCount() +
      this.selectedSeasonIds().length +
      this.selectedWeaponIds().length +
      (this.successRateSet() ? 1 : 0) +
      this.togglesCount() +
      this.wxControlCount();
  });

  ngAfterViewInit(): void {

    // On inital load of the component, check for pre-selected filters and apply them ...
    this.filter$
      .pipe(
        delay(2500),
        take(1),
        tap((filter) => this.preSelectedFilters = filter))
      .subscribe((filter) => {
        this.sortForm.controls['sort'].setValue((filter as Filter).sort, { emitEvent: false });
        this._watchFilterFormChanges(); // Watch for changes to the filter form controls ...
        // Patch values to the filter form that are not checkbox formArrays ...
        this.filterForm.patchValue({
          isStatePark: filter.isStatePark,
          isVpa: filter.isVpa,
          isBonusQuota: filter.isBonusQuota,
          successRate: filter.successRate
        });
        this._cdr.detectChanges();
        // Open and close filter drawer to trigger patchValue of the checkbox formArrays ...
        this.openFiltersDrawer();
        this.cancel();
      });

  }

  private _watchFilterFormChanges() {
    // Re-apply filters when the sort order changes ...
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
            isBonusQuota: this.filterForm.controls['isBonusQuota'].value,
            isStatePark: this.filterForm.controls['isStatePark'].value,
            isVpa: this.filterForm.controls['isVpa'].value,
            avgTemp: this.filterForm.controls['avgTemp'].value,
            phase: this.filterForm.controls['phase'].value,
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
      this.filterForm.controls['isVpa'].valueChanges.pipe(startWith(false)),
      this.filterForm.controls['isBonusQuota'].valueChanges.pipe(startWith(false))])
      .pipe(
        takeUntil(this._destroyed$),
        distinctUntilChanged())
      .subscribe(([isStatePark, isVpa, isBonusQuota]) => {
        if (this.auxData.filteredWmas) {
          this._filterWmaType(isStatePark, isVpa);
        }
        this.togglesCount.set((isStatePark === true ? 1 : 0) + (isVpa === true ? 1 : 0) + (isBonusQuota === true ? 1 : 0));
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

    combineLatest([
      this.filterForm.controls['avgTemp'].valueChanges.pipe(startWith('0')),
      this.filterForm.controls['phase'].valueChanges.pipe(startWith(''))])
      .pipe(
        takeUntil(this._destroyed$),
        distinctUntilChanged())
      .subscribe(([avgTemp, phase]) => {
        this.wxControlCount.set((avgTemp !== '0' ? 1 : 0) + (phase !== '' ? 1 : 0));
      });

  }

  // Filter the list of WMAs based on "state park"/"vpa"/"bonus quota" toggles ...
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

  // Get number of checked items in a given checkbox formArray ...
  private _controlCheckedCount(name: string): number[] {
    return this.filterForm.controls[name].value
      .map((checked: any, i: number) => checked ? (this.auxData as any)[name][i].id : null)
      .filter((v: null | number) => v !== null);
  }

  // Show the filter drawer, and populate checkbox arrays based on FilterAuxData from the store ...
  openFiltersDrawer() {
    if (this.auxData.wmas.length === 0) {
      this.auxData$
        .pipe(
          take(1),
          map((auxData) => { // Create a filterWmas array and mark all as "visible" ...
            const updatedWmas = auxData.wmas.map((wma: Wma) => ({ ...wma, visible: true }));
            return { ...auxData, wmas: [...updatedWmas], filteredWmas: [...updatedWmas] };
          }),
          tap((auxData) => this.auxData = auxData)) // Side effect, assign the local auxData w/ the results ...
        .subscribe((auxData: FilterAuxData) => {
          for (let key of Object.keys(auxData)) { // Iterate the keys in FilterAuxData and build the checkbox arrays ...
            if (key !== 'filteredWmas' && key !== 'histClimateLocations') {
              // Determine if there are any pre-selected filters and pass the values to the checkbox arrays
              // so that there value is set in the formArray ...
              let passValues: number[] | undefined;
              switch (key) {
                case 'wmas':
                  passValues = this.preSelectedFilters?.wmas as number[];
                  break;
                case 'seasons':
                  passValues = this.preSelectedFilters?.seasons as number[];
                  break;
                case 'weapons':
                  passValues = this.preSelectedFilters?.weapons as number[];
                  break;
              }
              this._buildCheckBoxes(auxData[key as keyof Omit<FilterAuxData, 'histClimateLocations'>], passValues);
            }
          }
        });
    }

    this.filterDrawer.open();
    this._listenToDrawerEvents();

  }

  // Build the formArray of checkboxes based on the data from the store ...
  private _buildCheckBoxes = (data: Wma[] | Season[] | Weapon[], values?: number[]) => {
    data.forEach((item: Wma | Season | Weapon) => {
      const arrayName = item.hasOwnProperty('season') ? 'seasons' : item.hasOwnProperty('locationId') ? 'wmas' : 'weapons';
      (this.filterForm.controls[arrayName] as unknown as FormArray)
        .push(new FormControl(values && values.includes(item.id) ? true : false)); // Mark as "true" if the value is in the pre-selected filters ...
    });
  };

  // Listener function to dispatch search with filters are applied ...
  private _listenToDrawerEvents() {
    this.filterDrawerSubscription = this.filterDrawer.closeEvent
      .subscribe((event: any) => {
        this.filterDrawerSubscription?.unsubscribe();
        if (event.data && event.saved === true) {
          this._store.dispatch(huntsActions.filtersChanged({
            filter: {
              ...event.data,
              skip: 0,
            }
          }));
        }
      });
  }

  clearSearch() {
    this.filterForm.controls['wmaFilter'].setValue('');
  }

  apply() {
    // console.log(this.filterForm.value);
    this.filterDrawer.save({
      ...this.filterForm.value,
      wmas: this._extractCheckIds('wmas', 'wmas'),
      seasons: this._extractCheckIds('seasons', 'seasons'),
      weapons: this._extractCheckIds('weapons', 'weapons'),
      successRate: this.filterForm.controls['successRate'].value,
      sort: this.sortForm.controls['sort'].value
    });
  }

  // Helper function to extract the checked ids from the checkbox formArrays ...
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

  // Remove a filter chip of the selected WMAs, Seasons, or Weapons ...
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
        ...this.filterForm.value,
        sort: this.sortForm.controls['sort'].value,
        skip: 0,
        wmas: this._extractCheckIds('wmas', 'wmas'),
        seasons: this._extractCheckIds('seasons', 'seasons'),
        weapons: this._extractCheckIds('weapons', 'weapons')
      }
    }));
  }

  removeNonCheckboxFilter(name: string) {
    switch (name) {
      case 'isStatePark':
        this.filterForm.controls['isStatePark'].setValue(false);
        break;
      case 'isVpa':
        this.filterForm.controls['isVpa'].setValue(false);
        break;
      case 'isBonusQuota':
        this.filterForm.controls['isBonusQuota'].setValue(false);
        break;
      case 'successRate':
        this.filterForm.controls['successRate'].setValue(0);
        break;
      case 'avgTemp':
        this.filterForm.controls['avgTemp'].setValue('0');
        break;
      case 'phase':
        this.filterForm.controls['phase'].setValue('');
        break;
    }
    this._store.dispatch(huntsActions.filtersChanged({
      filter: {
        ...this.filterForm.value,
        sort: this.sortForm.controls['sort'].value,
        skip: 0,
        wmas: this._extractCheckIds('wmas', 'wmas'),
        seasons: this._extractCheckIds('seasons', 'seasons'),
        weapons: this._extractCheckIds('weapons', 'weapons')
      }
    }));
  }

  cancel() {
    this.filterDrawer.close();
  }

  clearFilters() {
    this.filterForm.reset();
    this.filterForm.controls['successRate'].setValue(0);
    this.filterForm.controls['wmaFilter'].setValue('');
    this.filterForm.controls['avgTemp'].setValue('0');
    this.filterForm.controls['phase'].setValue('');
    this.auxData.filteredWmas.forEach((wma: Wma) => wma.visible = true);
    this.noFilteredWmasFound.set(false);
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

}
