import { AfterViewInit, Component, ElementRef, ViewChild, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { MapCoords, Wma } from "@model";
import { Store } from "@ngrx/store";
import { SHARED_MODULES } from "@shared-imports";
import { AppStateInterface } from "@store-model";
import { ClimateLocationsMapComponent } from "_shared/components/maps/climateLocations.map.component";
import { ModalComponent } from "_shared/components/modal.component";
import { Subject } from "rxjs";
import { selectHistClimateLocations, selectHistClimateCoords } from "store/admin/admin.selectors";

@Component({
  selector: 'gawmas-wma-form',
  standalone: true,
  templateUrl: 'wmaForm.component.html',
  imports: [SHARED_MODULES, ModalComponent, ReactiveFormsModule, ClimateLocationsMapComponent]
})
export class WmaFormComponent implements AfterViewInit {

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

  wmaFormGroup: FormGroup = this._fb.group({
    id: '',
    name: '',
    isSP: false,
    isVPA: false,
    hasBonusQuotas: false,
    histClimateTownId: '',
    physLat: '',
    physLong: '',
  });

  ngAfterViewInit(): void {
    // this.climateLocationsMap?.initializeMap();
  }

  openWmaForm(wma: Wma): void {
    this.wmaFormModal?.open();
    this.wmaFormGroup.patchValue(wma);
    this.wmaCoords = {
      town: wma.name!,
      coords: [wma.physLat!, wma.physLong!]
    };
    this.firstInputRef?.nativeElement.focus();

    setTimeout(() => {
      this.climateLocationsMap?.initializeMap();
    }, 1500);
  }

  closeWmaForm(): void {
    // this._closed$.next();
    // this._closed$.complete();
    // this._clearHuntDatesArray();
    // this.huntFormGroup?.reset();
    // this._router.navigate([], { queryParams: { h: null } });
    // this.huntFormModal?.close();
    // setTimeout(() => {
    //   this._store.dispatch(adminActions.clearSingleHunt());
    // }, 1200);
    this.wmaFormModal?.close();
  }

}
