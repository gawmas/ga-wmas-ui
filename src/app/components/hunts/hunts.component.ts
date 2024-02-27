import { initialHuntState } from './../../_shared/model/store/hunts.model';
import { selectEndOfResults, selectFilter, selectHunts, selectHuntsLoading, selectLoadingMoreHunts } from 'store/hunts/hunts.selectors';
import { SHARED_MODULES } from '@shared-imports';
import { Component, HostListener, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { FiltersComponent } from 'components/filters/filters.component';
import { AppStateInterface } from '@store-model';
import { DetailsHighlightPipe, SuccessRateColorPipe, SuccessRatePipe } from "@pipes";
import { NgIconComponent } from '@ng-icons/core';
import { Subject, combineLatest, distinctUntilChanged, startWith, take, takeUntil, filter } from 'rxjs';
import { HuntFormComponent } from 'components/admin/hunt-form/hunt-form.component';
import { Tooltip, TooltipTriggerType } from 'flowbite';
import { LoadingComponent } from '_shared/components/loading.component';
import * as huntsActions from 'store/hunts/hunts.actions';
import * as filterActions from 'store/filters/filters.actions';
import { Filter } from '@model';

@Component({
  selector: 'gawmas-browse-hunts',
  standalone: true,
  templateUrl: './hunts.component.html',
  imports: [SHARED_MODULES, FiltersComponent,
    SuccessRateColorPipe, SuccessRatePipe,
    NgIconComponent, DetailsHighlightPipe,
    HuntFormComponent, LoadingComponent]
})
export class HuntsComponent implements OnInit, OnDestroy {

  @Input('isAdmin') isAdmin: boolean = false;

  private _store = inject(Store<AppStateInterface>);

  topInView = signal(true);

  destroyed$ = new Subject<void>();
  hunts$ = this._store.select(selectHunts);
  isLoading$ = this._store.select(selectHuntsLoading);
  isLoadingMore$ = this._store.select(selectLoadingMoreHunts);
  filter$ = this._store.select(selectFilter);
  isEndOfResults$ = this._store.select(selectEndOfResults);

  screenWidth = signal(window.innerWidth);
  screenHeight = signal(window.innerHeight);
  initialPageSize: number = 10;

  ngOnInit(): void {
    this._store.dispatch(filterActions.getFilterAuxData());

    // Set initial page size based on screen height ...
    this.initialPageSize = this.screenHeight() > 2000 ? 20 :
      (this.screenHeight() < 2000 && this.screenHeight() > 1000) ? 15 : 10;

    const intialFilter = {
      ...initialHuntState.filter,
      pageSize: this.initialPageSize
    };

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

    // this._store.dispatch(huntsActions.getInitialHunts({
    //   filter: intialFilter
    // }));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.screenWidth.set(event.target.innerWidth);
    this.screenHeight.set(event.target.innerHeight);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {

    this.topInView.set(window.scrollY === 0);

    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    const windowBottom = windowHeight + window.pageYOffset;

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

  showHunterDensityTooltip(targetElId: string, triggerType: TooltipTriggerType, event: any) {
    const targetEl = document.getElementById(targetElId)
    const tooltip = new Tooltip(targetEl, event.target as HTMLElement, { triggerType });
    tooltip.show();
  }

}
