import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HistClimateLocationService, SeasonService, WeaponService, WmaService } from '@services';
import { map, switchMap, catchError, of, tap, combineLatest, exhaustMap } from 'rxjs';
import * as filterActions from '../filters/filters.actions';

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
