import { Component, ViewChild, inject, AfterViewInit, OnDestroy } from "@angular/core";
import { NgIconComponent } from "@ng-icons/core";
import { SuccessRateColorPipe, SuccessRatePipe, DetailsHighlightPipe } from "@pipes";
import { SHARED_MODULES } from "@shared-imports";
import { HuntsComponent } from "components/hunts/hunts.component";
import { HuntFormComponent } from "./hunt-form/hunt-form.component";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppStateInterface } from "@store-model";
import { Subject, takeUntil, tap, distinctUntilChanged } from "rxjs";
import * as adminActions from "store/admin/admin.actions";

@Component({
  imports: [SHARED_MODULES, HuntsComponent, HuntFormComponent],
  template: `
    <gawmas-browse-hunts [isAdmin]="true" />
    <gawmas-hunt-form #huntFormModal />
  `
})
export class AdminBrowseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('huntFormModal') huntForm: HuntFormComponent | undefined;

  private _activatedRoute = inject(ActivatedRoute);
  private _store = inject(Store<AppStateInterface>);
  private destroyed$ = new Subject<void>();

  ngAfterViewInit(): void {
    this._activatedRoute.queryParams
      .pipe(
        takeUntil(this.destroyed$),
        tap(() => this._store.dispatch(adminActions.clearSingleHunt())),
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
