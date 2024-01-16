import { Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Wma } from "@model";
import { SHARED_MODULES } from "@shared-imports";
import { Subject, distinctUntilChanged, map, take, takeUntil, tap } from "rxjs";
import { AppInterface } from "store/model";
import { Store } from "@ngrx/store";
import { WmaService } from "@services";
import { NgIconComponent } from "@ng-icons/core";
import * as huntActions from 'store/actions';

@Component({
  selector: 'hunt-filters',
  standalone: true,
  imports: [SHARED_MODULES, ReactiveFormsModule,
    NgIconComponent],
  templateUrl: './filters.component.html'
})
export class FiltersComponent implements OnInit, OnDestroy {

  private _destroyed$ = new Subject<void>();
  private _wmaService = inject(WmaService);
  private _store = inject(Store<AppInterface>);

  private formBuilder: FormBuilder = new FormBuilder();

  wmas: Wma[] = [];
  filteredWmas: Wma[] = [];
  selectedWmasCount = signal(0);

  filterForm: FormGroup = this.formBuilder.group({
    wmas: this.formBuilder.array([]),
    wmaFilter: '',
    successRate: 0
  });

  ngOnInit(): void {

    this._wmaService.wmas$
      .pipe(
        take(1),
        takeUntil(this._destroyed$),
        tap((wmas: Wma[]) => this.wmas = wmas),
        map((wmas: Wma[]) => wmas.map((wma: Wma) => ({ ...wma, visible: true }))),
        tap((wmas: Wma[]) => this.filteredWmas = wmas))
      .subscribe((wmas: Wma[]) => {
        wmas.forEach((wma: Wma) => {
          (this.filterForm.controls['wmas'] as unknown as FormArray)
            .push(new FormControl(false))
        });
      });

    this.filterForm.controls['wmas'].valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroyed$))
      .subscribe((value: any) => {
       if (value) {
         // this._store.dispatch(huntActions.filtersChanged({ filter: value }));
         this.selectedWmasCount.set(value.filter((wma: boolean) => wma).length);
       }
      });

    this.filterForm.controls['wmaFilter'].valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroyed$))
      .subscribe((value: string) => {
        this.filteredWmas.forEach((wma: Wma) => {
          if (wma.name.toLowerCase().includes(value.toLowerCase())) {
            wma.visible = true;
          } else {
            wma.visible = false;
          }
        });
      });

  }

  get wmasFormArray(): FormArray {
    return this.filterForm.controls['wmas'] as unknown as FormArray;
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

}
