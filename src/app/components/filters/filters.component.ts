import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Pipe, PipeTransform, computed, inject, signal } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Filter, FilterAuxData, Season, Weapon, Wma } from "@model";
import { SHARED_MODULES } from "@shared-imports";
import { Subject, distinctUntilChanged, map, take, takeUntil, tap } from "rxjs";
import { AppStateInterface } from "@store-model";
import { Store } from "@ngrx/store";
import { NgIconComponent } from "@ng-icons/core";
import { selectFiltersAuxData, selectFiltersAuxDataLoading } from 'store/filters/filters.selectors';
import { FormArrayPipe } from "@pipes";
import * as filterActions from 'store/filters/filters.actions';

@Component({
  selector: 'hunt-filters',
  standalone: true,
  imports: [SHARED_MODULES, ReactiveFormsModule,
    NgIconComponent, FormArrayPipe],
  templateUrl: './filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit, OnDestroy {

  private _destroyed$ = new Subject<void>();

  private _store = inject(Store<AppStateInterface>);
  private _formBuilder = inject(FormBuilder);
  private _cdr = inject(ChangeDetectorRef);

  auxData$ = this._store.select(selectFiltersAuxData);
  isLoading$ = this._store.select(selectFiltersAuxDataLoading);

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
  successRateSet = signal(false);
  filterCount = computed(() => {
    return this.selectedWmasCount() +
      (this.successRateSet() ? 1 : 0)
  });

  ngOnInit(): void {

    this._store.dispatch(filterActions.getFilterAuxData());

    this.filterForm.controls['wmas'].valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroyed$)
      ).subscribe((value: any) => {
        if (value) {
          // this._store.dispatch(appActions.filtersChanged({ filter: value }));
          this.selectedWmasCount.set(value.filter((wma: boolean) => wma).length);
        }
      });

    this.filterForm.controls['successRate'].valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroyed$))
      .subscribe((value: number) => {
        this.successRateSet.set(value > 0);
      });

    this.filterForm.controls['wmaFilter'].valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroyed$))
      .subscribe((value: string) => {
        this.selectedWmaIds.set(this.filterForm.controls['wmas'].value
          .map((checked: any, i: number) => checked ? this.auxData.wmas[i].id : null)
          .filter((v: null | number) => v !== null));
        this.auxData.filteredWmas.forEach((wma: Wma) => {
          if (!Array.from(this.selectedWmaIds()).includes(wma.id)) {
            wma.visible = (wma.name.toLowerCase().includes(value.toLowerCase()));
          }
        });
        this.noFilteredWmasFound.set(this.auxData.filteredWmas.every((wma: Wma) => !wma.visible));
      });

  }

  openFiltersModal() {

    this.auxData$
      .pipe(
        take(1),
        takeUntil(this._destroyed$),
        tap((auxData) => this.auxData = auxData),
        map((auxData) => {
          const updatedWmas = auxData.wmas.map((wma: Wma) => ({ ...wma, visible: true }));
          return { ...auxData, wmas: updatedWmas, filteredWmas: updatedWmas };
        }),
        tap((auxData) => this.auxData = auxData))
      .subscribe((auxData: FilterAuxData) => {
        for (let key of Object.keys(auxData)) {
          if (key !== 'filteredWmas') {
            this.buildCheckBoxes(auxData[key as keyof FilterAuxData]);
          }
        }
        this._cdr.detectChanges();
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
    console.log(this.selectedWmaIds().map((id: number) => this.auxData.wmas.find((wma: Wma) => wma.id === id)));
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

}
