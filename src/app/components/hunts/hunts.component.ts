import { selectEndOfResults, selectFilter, selectHunts, selectHuntsLoading } from 'store/hunts/hunts.selectors';
import { SHARED_MODULES } from '@shared-imports';
import { Component, HostListener, Input, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { FiltersComponent } from 'components/filters/filters.component';
import { AppStateInterface } from '@store-model';
import { DetailsHighlightPipe, SuccessRateColorPipe, SuccessRatePipe } from "@pipes";
import { NgIconComponent } from '@ng-icons/core';
import { combineLatest, distinctUntilChanged, take } from 'rxjs';
import { HuntFormComponent } from 'components/admin/hunt-form/hunt-form.component';
import * as huntsActions from 'store/hunts/hunts.actions';

@Component({
  selector: 'gawmas-browse-hunts',
  standalone: true,
  templateUrl: './hunts.component.html',
  imports: [SHARED_MODULES, FiltersComponent,
    SuccessRateColorPipe, SuccessRatePipe,
    NgIconComponent, DetailsHighlightPipe, HuntFormComponent]
})
export class HuntsComponent implements OnInit {

  @Input('isAdmin') isAdmin: boolean = false;

  private _store = inject(Store<AppStateInterface>);

  topInView = signal(true);

  hunts$ = this._store.select(selectHunts);
  isLoading$ = this._store.select(selectHuntsLoading);
  filter$ = this._store.select(selectFilter);
  isEndOfResults$ = this._store.select(selectEndOfResults);

  screenWidth = signal(window.innerWidth);
  screenHeight = signal(window.innerHeight);

  ngOnInit(): void {
    // Set initial page size based on screen height ...
    const initialPageSize = this.screenHeight() > 2000 ? 20 :
      (this.screenHeight() < 2000 && this.screenHeight() > 1000) ? 15 : 10;

    this._store.dispatch(huntsActions.getInitialHunts({
      filter: {
        skip: 0,
        pageSize: initialPageSize,
        successRate: 0,
        wmas: [],
        seasons: [],
        weapons: [],
        sort: null
      }
    }));
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
        this.isLoading$,
        this.isEndOfResults$
      ])
        .pipe(
          take(1),
          distinctUntilChanged())
        .subscribe(([isLoading, isEndOfResults]) => {
          if (!isLoading && !isEndOfResults) {
            this._store.dispatch(huntsActions.getMoreHunts({ filter: undefined }));
          }
        });
    }
  }

  scrollTop(): void {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

}
