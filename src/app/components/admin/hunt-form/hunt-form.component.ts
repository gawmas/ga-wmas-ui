import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Hunt } from '@model';
import { Store } from '@ngrx/store';
import { AdminService } from '@services';
import { SHARED_MODULES } from '@shared-imports';
import { AppStateInterface } from '@store-model';
import { ModalComponent } from '_shared/components/modal.component';
import { provideNgxMask } from 'ngx-mask';
import { Subscription } from 'rxjs';
import { selectHunt } from 'store/admin/admin.selectors';
import { selectFiltersAuxData } from 'store/filters/filters.selectors';

@Component({
  selector: 'gawmas-hunt-form',
  standalone: true,
  imports: [SHARED_MODULES, ModalComponent, ReactiveFormsModule],
  providers: [provideNgxMask()],
  templateUrl: './hunt-form.component.html',
})
export class HuntFormComponent {

  private _fb = inject(FormBuilder);
  private _store = inject(Store<AppStateInterface>);
  private _router = inject(Router);
  private _huntSub = new Subscription();

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
    startDate: [''],
    endDate: [''],
    quota: [''],
    isBonusQuota: false
  });

  openHuntForm(): void {
    this.huntFormModal?.open();
    this._huntSub = this.hunt$.subscribe((hunt) => {
      this.huntFormGroup.patchValue({...hunt});
    });
    this.firstInputRef?.nativeElement.focus();
  }

  update(): void {
    // this._adminService.updateHunt(this.huntFormGroup.value).subscribe((hunt) => {
    //   console.log('Hunt updated', hunt);
    // });
  }

  closeHuntForm(): void {
    this._huntSub.unsubscribe();
    this.huntFormGroup.reset();
    this._router.navigate([], { queryParams: { h: null } });
    this.huntFormModal?.close();
  }

}
