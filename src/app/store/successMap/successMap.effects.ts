import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, of, tap, combineLatest } from 'rxjs';
import { AdminService, HistClimateLocationService, MapService, WmaService } from '@services';
import * as successMapActions from './successMap.actions';
import { SuccessMapService } from '_shared/services/successMap.service';

@Injectable()
export class SuccessMapEffects {

  constructor(
    private readonly _actions$: Actions,
    private readonly _successMapService: SuccessMapService) { }

  getSuccessMapWmaCoords$ = createEffect(() =>
    this._actions$.pipe(
      ofType(
        successMapActions.enterSuccessMap,
        successMapActions.getSuccessMapCoords),
      switchMap(() =>
        this._successMapService.wmaCoords$.pipe(
          map((wmaCoords) => successMapActions.getSuccessMapCoordsComplete({ wmaCoords })),
          catchError((error) => of(successMapActions.getSuccessMapCoordsError({ error })))
        )
      )
    )
  );

  getSuccessMapSeasonHarvestData$ = createEffect(() =>
    this._actions$.pipe(
      ofType(successMapActions.getSeasonHarvestData),
      switchMap(({ seasonId }) =>
        this._successMapService.getWmaHarvestBySeason(seasonId).pipe(
          map((seasonHarvestData) => successMapActions.getSeasonHarvestDataComplete({ seasonHarvestData })),
          catchError((error) => of(successMapActions.getSeasonHarvestDataError({ error })))
        )
      )
    )
  );

  getSuccessMapSeasonSuccessData$ = createEffect(() =>
    this._actions$.pipe(
      ofType(successMapActions.getSeasonSuccessData),
      switchMap(({ seasonId }) =>
        this._successMapService.getWmaSuccessBySeason(seasonId).pipe(
          map((seasonHarvestData) => successMapActions.getSeasonSuccessDataComplete({ seasonHarvestData })),
          catchError((error) => of(successMapActions.getSeasonSuccessDataError({ error })))
        )
      )
    )
  );

  error$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(
          successMapActions.getSeasonHarvestDataError,
          successMapActions.getSeasonSuccessDataError,
          successMapActions.getSuccessMapCoordsError),
        tap((error) => console.log(error))
      ),
    { dispatch: false }
  );

}
