import { AfterViewInit, Component, ElementRef, ViewChild, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { MapCoords, Wma } from "@model";
import { Store } from "@ngrx/store";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import { ClimateLocationsMapComponent } from "_shared/components/maps/climateLocations.map.component";
import { ModalComponent } from "_shared/components/modal.component";
import { Subject, Subscription } from "rxjs";
import { selectHistClimateLocations, selectHistClimateCoords } from "store/admin/admin.selectors";
import * as adminActions from "store/admin/admin.actions";

@Component({
    selector: 'gawmas-wma-form',
    templateUrl: 'wmaForm.component.html',
    imports: [SHARED_MODULES, ModalComponent, ReactiveFormsModule, ClimateLocationsMapComponent]
})
export class WmaFormComponent {

  @ViewChild('wmaForm') wmaFormModal: ModalComponent | undefined;
  @ViewChild('firstInputRef') firstInputRef: ElementRef | undefined;
  @ViewChild('climateLocationsMap') climateLocationsMap: ClimateLocationsMapComponent | undefined;

  wmaFormTarget = 'wmaForm';

  private _fb = inject(NonNullableFormBuilder);
  private _store = inject(Store<AppStateInterface>);
  private _router = inject(Router);
  private _closed$ = new Subject<void>();

  climateLocations$ = this._store.select(selectHistClimateLocations);
  climateCoords$ = this._store.select(selectHistClimateCoords);

  wmaCoords: MapCoords | undefined;

  coordsProvided = false;
  coordsSubscription = new Subscription();

  wmaFormGroup: FormGroup = this._fb.group({
    id: '',
    name: '',
    isSP: false,
    isVPA: false,
    hasBonusQuotas: false,
    locationId: '',
    histClimateTownId: '',
    physLat: '',
    physLong: '',
    acres: ''
  });

  openWmaForm(wma: Wma): void {
    this.wmaFormModal?.open();
    this.wmaFormGroup.patchValue(wma);
    this.coordsProvided = wma.physLat !== null && wma.physLong !== null;
    this.wmaCoords = {
      town: wma.name!,
      coords: [wma.physLat!, wma.physLong!]
    };
    this.firstInputRef?.nativeElement.focus();
    setTimeout(() => {
      this.climateLocationsMap?.initializeMap();
    }, 1500);
    if (!this.coordsProvided) {
      this.coordsSubscription = this.wmaFormGroup.valueChanges.subscribe((value) => {
        if (value.physLat && value.physLong) {
          this.coordsProvided = true;
          this.wmaCoords = {
            town: value.name,
            coords: [value.physLat, value.physLong]
          };
          setTimeout(() => {
            this.climateLocationsMap?.initializeMap(this.wmaCoords);
          }, 1500);
        }
      });
    }
  }

  updateWma(): void {
    this._store.dispatch(adminActions.updateWma({ wma: this.wmaFormGroup.value }));
    this.closeWmaForm();
  }

  closeWmaForm(): void {
    this.wmaFormModal?.close();
    this.coordsSubscription.unsubscribe();
  }

}
