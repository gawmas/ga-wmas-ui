import { AfterViewInit, Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Hunt } from '@model';
import { Store } from '@ngrx/store';
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
export class HuntFormComponent implements AfterViewInit {

  private _fb = inject(FormBuilder);
  private _store = inject(Store<AppStateInterface>);

  @ViewChild('huntForm') huntFormModal: ModalComponent | undefined;
  @ViewChild('firstInputRef') firstInputRef: ElementRef | undefined;

  // hunt: Hunt | undefined;
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
    coords: [''],
  });

  ngAfterViewInit(): void {
    // this.huntFormGroup.patchValue({ ...this.hunt });
    // console.log(this.huntFormGroup.value);
  }

  openHuntForm(hunt: Hunt): void {
    this.huntFormModal?.open();
    this.huntFormGroup.patchValue({ ...hunt });
    this.firstInputRef?.nativeElement.focus();
  }

  closeHuntForm(): void {
    this.huntFormModal?.close();
  }

}
