import { selectFilter, selectHunts, selectHuntsLoading } from 'store/selectors';
import { SHARED_MODULES } from '@shared-imports';
import { Component, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { FiltersComponent } from 'components/filters/filters.component';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { Filter } from '@model';
import { AppInterface } from 'store/model';
import { SuccessRateColorPipe, SuccessRatePipe } from "@pipes";
import * as huntActions from 'store/actions';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  standalone: true,
  templateUrl: './hunts.component.html',
  imports: [SHARED_MODULES, FiltersComponent,
    SuccessRateColorPipe, SuccessRatePipe,
    NgIconComponent]
})
export class HuntsComponent implements OnInit, OnDestroy {

  private _store = inject(Store<AppInterface>);
  private _destroyed$ = new Subject<void>();

  private _filter: Filter = {
    skip: 0,
    wma: null
  };

  topInView = signal(true);

  hunts$ = this._store.select(selectHunts);
  isLoading$ = this._store.select(selectHuntsLoading);
  filter$ = this._store.select(selectFilter);

  ngOnInit(): void {

    this._store.dispatch(huntActions.getInitialHunts({ filter: this._filter }));

    this.filter$.pipe(
      takeUntil(this._destroyed$),
      distinctUntilChanged())
      .subscribe((filter) => {
        this._filter = filter!;
        this._store.dispatch(huntActions.getInitialHunts({ filter: this._filter }));
    });

  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
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
      this._store.dispatch(huntActions.getMoreHunts({ filter: this._filter }));
    }
  }

  scrollTop(): void {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

}
