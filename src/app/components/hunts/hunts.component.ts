import { selectEndOfResults, selectFilter, selectHunts, selectHuntsLoading, selectLoadingMoreHunts } from 'store/hunts/hunts.selectors';
import { SHARED_MODULES } from '@shared-imports';
import { Component, HostListener, OnDestroy, OnInit, ViewChild, inject, input, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { FiltersComponent } from 'components/filters/filters.component';
import { AppStateInterface } from '@store-model';
import { DetailsHighlightPipe, SuccessRateColorPipe, SuccessRatePipe, WxAvgTempDeparturePipe, WxDetailTypePipe, SafePipe, WxConditionIconPipe, SeasonTextPipe } from "@pipes";
import { NgIconComponent } from '@ng-icons/core';
import { Observable, Subject, combineLatest, distinctUntilChanged, startWith, take } from 'rxjs';
import { HuntFormComponent } from 'components/admin/hunt-form/hunt-form.component';
import { Tooltip, TooltipTriggerType } from 'flowbite';
import { LoadingComponent } from '_shared/components/loading.component';
import { Filter, Hunt, HuntDate } from '@model';
import { WxDetailsComponent } from 'components/wxDetails/wxDetails.component';
import { selectMapWmaResults } from 'store/successMap/successMap.selectors';
import * as huntsActions from 'store/hunts/hunts.actions';
import * as filterActions from 'store/filters/filters.actions';
import * as wxDetailsActions from 'store/wxDetails/wxDetails.actions';
import { initialHuntState } from './../../_shared/model/store/hunts.model';

@Component({
    selector: 'gawmas-browse-hunts',
    templateUrl: './hunts.component.html',
    imports: [SHARED_MODULES, FiltersComponent,
        SuccessRateColorPipe, SuccessRatePipe,
        NgIconComponent, DetailsHighlightPipe, WxDetailsComponent,
        LoadingComponent, SafePipe,
        WxDetailTypePipe, WxAvgTempDeparturePipe, WxConditionIconPipe]
})
export class HuntsComponent implements OnInit, OnDestroy {

  isAdmin = input<boolean>();
  isModal = input<boolean>();

  @ViewChild('wxDetailsModal') wxDetailsModal: WxDetailsComponent | undefined;

  private _store = inject(Store<AppStateInterface>);
  private _destroyed$ = new Subject<void>();

  topInView = signal(true);

  hunts$!: Observable<Hunt[] | undefined>;

  isLoading$ = this._store.select(selectHuntsLoading);
  isLoadingMore$ = this._store.select(selectLoadingMoreHunts);
  filter$ = this._store.select(selectFilter);
  isEndOfResults$ = this._store.select(selectEndOfResults);

  screenWidth = signal(window.innerWidth);
  screenHeight = signal(window.innerHeight);
  initialPageSize: number = 10;

  ngOnInit(): void {

    if (!this.isModal()) {

      this.hunts$ = this._store.select(selectHunts);

      // Dispatch action to get filter aux data, used in the child component <gawmas-hunt-filters/>...
      this._store.dispatch(filterActions.getFilterAuxData());

      // Set initial page size based on screen height ...
      this.initialPageSize = this.screenHeight() > 2000 ? 20 :
        (this.screenHeight() < 2000 && this.screenHeight() > 1000) ? 15 : 10;

      const intialFilter = {
        ...initialHuntState.filter,
        pageSize: this.initialPageSize
      };

      // Subscribe to the filters Observable from the store and dispatch action to get initial hunts,
      // this may be the initial set of Hunts or applies previously selected filters ...
      this.filter$
        .pipe(
          take(1),
          startWith(intialFilter))
        .subscribe(filter => {
          // console.log('filter', filter);
          const updatedFilter: Filter = { ...filter, skip: 0, pageSize: this.initialPageSize };
          this._store.dispatch(huntsActions.getInitialHunts({
            filter: updatedFilter
          }));
        });
    } else {
      this.hunts$ = this._store.select(selectMapWmaResults);
    }

  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  // Listen to window resize event and update the screenWidth and screenHeight signals ...
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.screenWidth.set(event.target.innerWidth);
    this.screenHeight.set(event.target.innerHeight);
  }

  // Listen to window scroll event to trigger infinite scroll functionality, dispatch action to get
  // more hunts when the user scrolls to the bottom of the page ...
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {

    this.topInView.set(window.scrollY === 0);

    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    const windowBottom = windowHeight + window.pageYOffset;

    // User is nearing the bottom of the viewport, dispatch action to get more hunts only if
    // the end of the results has not been reached ...
    if (windowBottom >= (docHeight * .95)) {
      combineLatest([
        this.isLoadingMore$,
        this.isEndOfResults$
      ])
        .pipe(
          take(1),
          distinctUntilChanged())
        .subscribe(([isLoadingMore, isEndOfResults]) => {
          if (!isLoadingMore && !isEndOfResults) {
            this._store.dispatch(huntsActions.getMoreHunts({ filter: undefined }));
          }
        });
    }
  }

  scrollTop(): void {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  showTooltip(targetElId: string, triggerType: TooltipTriggerType, event: any) {
    // console.log('targetElId', targetElId, 'target', event.target as HTMLElement);
    const targetEl = document.getElementById(targetElId)
    const tooltip = new Tooltip(targetEl, event.target as HTMLElement, { triggerType });
    tooltip.show();
  }

  openWxDetails(huntId: number, huntDates: HuntDate[], location: string, hunters: number, does: number, bucks: number, weapon: string) {
    this._store.dispatch(wxDetailsActions.clearWxDetails());
    this.wxDetailsModal?.open(huntDates, location, hunters, bucks, does, weapon);
    this._store.dispatch(wxDetailsActions.getWxDetails({ id: String(huntId) }));
  }

}
