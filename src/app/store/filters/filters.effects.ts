import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { HistClimateLocationService, HuntService, SeasonService, WeaponService, WmaService } from '@services';
import { Store } from '@ngrx/store';
import { map, switchMap, catchError, of, tap, combineLatest, mergeMap, concatMap, exhaustAll, exhaustMap, withLatestFrom, filter } from 'rxjs';
import { AppStateInterface } from '@store-model';
import * as filterActions from '../filters/filters.actions';
import * as huntsActions from '../hunts/hunts.actions';
import { selectAllHuntsLength, selectFilter } from 'store/hunts/hunts.selectors';
import { Filter } from '@model';

@Injectable()
export class FiltersEffects {

  constructor(
    private readonly _actions$: Actions,
    private readonly _wmaService: WmaService,
    private readonly _seasonsService: SeasonService,
    private readonly _weaponsService: WeaponService,
    private readonly _histClimateLocationsService: HistClimateLocationService) {}

  getFilterAuxData$ = createEffect(() =>
    this._actions$.pipe(
      ofType(filterActions.getFilterAuxData),
      exhaustMap(() =>
        combineLatest([
          this._wmaService.wmas$,
          this._seasonsService.seasons$,
          this._weaponsService.weapons$,
          this._histClimateLocationsService.histClimateLocations$
        ]).pipe(
          map(([wmas, seasons, weapons, locations]) => filterActions.getFilterAuxDataComplete({
            filterAuxData: {
              wmas, seasons, weapons, filteredWmas: [],
              histClimateLocations: locations
            }
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
