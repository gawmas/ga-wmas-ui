import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormArrayPipe } from '@pipes';
import { SHARED_MODULES } from '@shared-imports';
import { AppStateInterface } from '@store-model';
import { ModalComponent } from '_shared/components/modal.component';
import { provideNgxMask } from 'ngx-mask';
import { Subject, take, takeUntil } from 'rxjs';
import { selectHunt } from 'store/admin/admin.selectors';
import { selectFiltersAuxData } from 'store/filters/filters.selectors';
import * as adminActions from "store/admin/admin.actions";
import { DatePipe } from '@angular/common';
import { HuntPayload } from '@model';

@Component({
    selector: 'gawmas-hunt-form',
    imports: [SHARED_MODULES, ModalComponent, ReactiveFormsModule, FormArrayPipe],
    providers: [provideNgxMask(), DatePipe],
    templateUrl: './hunt-form.component.html'
})
export class HuntFormComponent {

  private _fb = inject(NonNullableFormBuilder);
  private _store = inject(Store<AppStateInterface>);
  private _router = inject(Router);
  private _closed$ = new Subject<void>();
  private _datePipe = inject(DatePipe);


  @ViewChild('huntForm') huntFormModal: ModalComponent | undefined;
  @ViewChild('firstInputRef') firstInputRef: ElementRef | undefined;

  huntFormTarget = 'huntForm';

  hunt$ = this._store.select(selectHunt);
  auxData$ = this._store.select(selectFiltersAuxData);

  huntFormGroup: FormGroup = this._fb.group({
    id: [''],
    wmaId: [''],
    seasonId: [''],
    details: [''],
    weaponId: [''],
    hunterCount: [''],
    does: [''],
    bucks: [''],
    startDates: this._fb.array([]),
    endDates: this._fb.array([]),
    quota: [''],
    isBonusQuota: false
  });

  openHuntForm(): void {
    this.huntFormModal?.open();
    this.hunt$
      .pipe(
        take(2),
        takeUntil(this._closed$))
      .subscribe((hunt) => {
        if (hunt && hunt.huntDates) {
          this.huntFormGroup?.patchValue({
            id: hunt.id,
            wmaId: hunt.wmaId,
            seasonId: hunt.seasonId,
            details: hunt.details,
            weaponId: hunt.weaponId,
            hunterCount: hunt.hunterCount,
            does: hunt.does, bucks: hunt.bucks,
            quota: hunt.quota,
            isBonusQuota: hunt.isBonusQuota
          });
          hunt.huntDates.forEach((date) => {
            const startDatesFormArray = this.huntFormGroup?.controls['startDates'] as FormArray;
            const endDatesFormArray = this.huntFormGroup?.controls['endDates'] as FormArray;
            startDatesFormArray.push(new FormControl(this._datePipe.transform(date.start, 'MM/dd/yyyy')));
            endDatesFormArray.push(new FormControl(this._datePipe.transform(date.end, 'MM/dd/yyyy')));
          });
        }
      });
    this.firstInputRef?.nativeElement.focus();
  }

  update(): void {
    const payload = this.huntFormGroup?.value as HuntPayload;
    this._store.dispatch(adminActions.updateHunt({ huntPayload: payload }));
  }

  private _clearHuntDatesArray(): void {
    const startDatesArray = this.huntFormGroup?.controls['startDates'] as FormArray;
    const endDatesArray = this.huntFormGroup?.controls['endDates'] as FormArray;
    startDatesArray.clear();
    endDatesArray.clear();
  }

  closeHuntForm(): void {
    this._closed$.next();
    this._closed$.complete();
    this._clearHuntDatesArray();
    this.huntFormGroup?.reset();
    this._router.navigate([], { queryParams: { h: null } });
    this.huntFormModal?.close();
    setTimeout(() => {
      this._store.dispatch(adminActions.clearSingleHunt());
    }, 1200);
  }

}
