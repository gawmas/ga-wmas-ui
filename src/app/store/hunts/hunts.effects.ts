import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { HuntService } from '@services';
import { Store } from '@ngrx/store';
import { withLatestFrom, map, switchMap, catchError, of, tap, debounce, debounceTime, mergeMap, concatMap, exhaustMap } from 'rxjs';
import { selectAllHuntsLength, selectFilter } from './hunts.selectors';
import { AppStateInterface } from '@store-model';
import { Filter } from '@model';
import * as huntActions from './hunts.actions';

@Injectable()
export class HuntEffects {

  constructor(
    private readonly _actions$: Actions,
    private readonly _huntService: HuntService,
    private _store: Store<AppStateInterface>) { }

  private noFiltersApplied(filter: Filter): boolean {
    return (
      filter && filter.wmas !== undefined && filter.wmas !== null && filter.wmas.length > 0 &&
      filter.seasons !== undefined && filter.seasons !== null && filter.seasons.length > 0 &&
      filter.weapons !== undefined && filter.weapons !== null && filter.weapons.length > 0 &&
      filter.successRate !== undefined && filter.successRate !== null
    );
  }

  getInitialHunts$ = createEffect(() =>
    this._actions$.pipe(
      ofType(huntActions.getInitialHunts, huntActions.filtersChanged),
      withLatestFrom(this._store.select(selectFilter)),
      map((value) => value[0].filter as Filter),
      exhaustMap((filter) =>
        this._huntService.getHunts(filter).pipe(
          map((result) => {
            if (this.noFiltersApplied(filter)) {
              return huntActions.getHuntsComplete({ hunts: result })
            } else {
              return huntActions.getFilteredHuntsComplete({ hunts: result })
            }
          }),
          catchError((error) =>
            of(huntActions.huntsError({ error: error }))
          )
        )
      )
    )
  );

  getMoreHunts$ = createEffect(() =>
    this._actions$.pipe(
      debounceTime(1000), // Remove before deploying ...
      ofType(huntActions.getMoreHunts),
      concatLatestFrom(() => [
        this._store.select(selectAllHuntsLength),
        this._store.select(selectFilter)
      ]),
      switchMap(([action, skip, filter]) =>
        this._huntService.getHunts(
          {
            skip,
            wmas: filter?.wmas,
            seasons: filter?.seasons,
            weapons: filter?.weapons,
            successRate: filter?.successRate
          } as Filter)
          .pipe(
            map((result) => huntActions.getHuntsComplete({ hunts: result }))
          )
      )
    )
  );

  error$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(huntActions.huntsError),
        tap((error) => console.error(error.error))
      ),
    { dispatch: false }
  );

}
