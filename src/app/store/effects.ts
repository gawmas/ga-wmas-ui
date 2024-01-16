import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { HuntService } from '@services';
import { Store } from '@ngrx/store';
import { withLatestFrom, map, switchMap, catchError, of, tap, debounce, debounceTime } from 'rxjs';
import { selectAllHuntsLength, selectFilter } from './selectors';
import { AppInterface } from './model';
import { Filter } from '@model';
import * as huntActions from './actions';

@Injectable()
export class HuntEffects {

  constructor(
    private readonly _actions$: Actions,
    private readonly _huntService: HuntService,
    private _store: Store<AppInterface>) {}

  getInitialHunts$ = createEffect(() =>
    this._actions$.pipe(
      ofType(huntActions.getInitialHunts, huntActions.filtersChanged),
      withLatestFrom(this._store.select(selectFilter)),
      map((value) => value[0].filter as Filter),
      switchMap((filter) =>
        this._huntService.getHunts(filter).pipe(
          map((result) => huntActions.getHuntsComplete({ hunts: result })),
          catchError((error) =>
            of(huntActions.huntsError({ error: JSON.stringify(error) }))
          )
        )
      )
    )
  )

  getMoreHunts$ = createEffect(() =>
    this._actions$.pipe(
      debounceTime(1000), // Remove before deploying ...
      ofType(huntActions.getMoreHunts),
      concatLatestFrom(() => [
        this._store.select(selectAllHuntsLength),
        this._store.select(selectFilter)
      ]),
      switchMap(([action, skip, filter]) =>
        this._huntService.getHunts({ skip, wma: filter?.wma } as Filter)
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
        tap((error) => console.log(error))
      ),
    { dispatch: false }
  );

}
