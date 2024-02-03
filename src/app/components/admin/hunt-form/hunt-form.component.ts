import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Hunt } from '@model';
import { Store } from '@ngrx/store';
import { AdminService } from '@services';
import { SHARED_MODULES } from '@shared-imports';
import { AppStateInterface } from '@store-model';
import { ModalComponent } from '_shared/components/modal.component';
import { provideNgxMask } from 'ngx-mask';
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
  private _adminService = inject(AdminService);

  @ViewChild('huntForm') huntFormModal: ModalComponent | undefined;
  @ViewChild('firstInputRef') firstInputRef: ElementRef | undefined;

  huntFormTarget = 'huntForm';

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
    location: [''],
    climateTown: [''],
    histClimateId: [''],
    lat: [''],
    long: [''],
  });

  openHuntForm(hunt: Hunt): void {
    this.huntFormModal?.open();
    this.huntFormGroup.patchValue({
      ...hunt,
      lat: hunt.coords.split(',')[0],
      long: hunt.coords.split(',')[1]});
    this.firstInputRef?.nativeElement.focus();
  }

  update(): void {
    this._adminService.updateHunt(this.huntFormGroup.value).subscribe((hunt) => {
      console.log('Hunt updated', hunt);
    });
  }

  closeHuntForm(): void {
    this.huntFormModal?.close();
  }

}
