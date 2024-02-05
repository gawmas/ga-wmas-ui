import { Component, OnDestroy, OnInit, ViewChild, inject } from "@angular/core";
import { SHARED_MODULES } from "@shared-imports";
import { HuntFormComponent } from "./hunt-form/hunt-form.component";
import { DetailsHighlightPipe, SuccessRateColorPipe, SuccessRatePipe } from "@pipes";
import { NgIconComponent } from "@ng-icons/core";
import { HuntsComponent } from "components/hunts/hunts.component";
import { ActivatedRoute } from "@angular/router";
import { Subject, distinctUntilChanged, takeUntil } from "rxjs";
import { Store } from "@ngrx/store";
import { AppStateInterface } from "@store-model";
import * as adminActions from "store/admin/admin.actions";

@Component({
  standalone: true,
  imports: [SHARED_MODULES, HuntsComponent, HuntFormComponent,
    SuccessRateColorPipe, SuccessRatePipe,
    NgIconComponent, DetailsHighlightPipe],
  template: `
    <gawmas-browse-hunts [isAdmin]="true" />
    <gawmas-hunt-form #huntFormModal />
  `
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  @ViewChild('huntFormModal') huntForm: HuntFormComponent | undefined;

  private _activatedRoute = inject(ActivatedRoute);
  private _store = inject(Store<AppStateInterface>);
  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this._activatedRoute.queryParams
      .pipe(
        takeUntil(this.destroyed$),
        distinctUntilChanged())
      .subscribe(params => {
        if (params['h']) {
          this._store.dispatch(adminActions.getSingleHunt({ id: params['h'] }));
          this.openHuntForm();
        }
      });
  }

  openHuntForm() {
    this.huntForm?.openHuntForm();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
