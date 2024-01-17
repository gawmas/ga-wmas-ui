import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SeasonService, WeaponService, WmaService } from '@services';
import { Store } from '@ngrx/store';
import { map, switchMap, catchError, of, tap, combineLatest, mergeMap, concatMap, exhaustAll, exhaustMap } from 'rxjs';
import { AppStateInterface } from '@store-model';
import * as filterActions from '../filters/filters.actions';

@Injectable()
export class FiltersEffects {

  constructor(
    private readonly _actions$: Actions,
    private readonly _wmaService: WmaService,
    private readonly _seasonsService: SeasonService,
    private readonly _weaponsService: WeaponService) {}

  getFilterAuxData$ = createEffect(() =>
    this._actions$.pipe(
      ofType(filterActions.getFilterAuxData),
      exhaustMap(() =>
        combineLatest([
          this._wmaService.wmas$,
          this._seasonsService.seasons$,
          this._weaponsService.weapons$
        ]).pipe(
          map(([wmas, seasons, weapons]) => filterActions.getFilterAuxDataComplete({
            filterAuxData: { wmas, seasons, weapons, filteredWmas: [] }
          })),
          catchError((error) =>
            of(filterActions.getFilterAuxDataError({ error: JSON.stringify(error) }))
          )
        )
      )
    )
  )

  error$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(filterActions.getFilterAuxDataError),
        tap((error) => console.log(error))
      ),
    { dispatch: false }
  );

}
