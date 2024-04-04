import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, of, tap, combineLatest, withLatestFrom, filter, exhaustMap, concatMap } from 'rxjs';
import { SuccessMapService } from '_shared/services/successMap.service';
import { AppStateInterface } from '@store-model';
import { selectSuccessMapState } from './successMap.selectors';
import { Store } from '@ngrx/store';
import { SeasonService } from '@services';
import * as mapActions from './successMap.actions';

@Injectable()
export class MapEffects {

  constructor(
    private readonly _actions$: Actions,
    private readonly _store: Store<AppStateInterface>,
    private readonly _successMapService: SuccessMapService,
    private readonly _seasonService: SeasonService) { }

  getWmaCoords$ = createEffect(() =>
    this._actions$.pipe(
      ofType(mapActions.enterSuccessMap),
      withLatestFrom(this._store.select(selectSuccessMapState)),
      // filter(([action, successMapState]) => !successMapState.wmaCoords.length && !successMapState.seasons.length),
      exhaustMap(() =>
        combineLatest([
          this._successMapService.wmaCoords$,
          this._seasonService.seasons$
        ]).pipe(
          switchMap(([coords, seasons]) => {
            return this._successMapService.getSeasonMapData(seasons[0].id, 'success').pipe(
              map((mapData) => {
                return mapActions.enterSuccessMapComplete({ wmaCoords: coords, seasons, mapData });
              }),
              catchError((error) => of(mapActions.enterSuccessMapError({ error })))
            );
          }),
        )
      )
    )
  );

  getSeasonMapData$ = createEffect(() =>
    this._actions$.pipe(
      ofType(mapActions.getSeasonMapData),
      switchMap(({ seasonId, dataType }) =>
        this._successMapService.getSeasonMapData(seasonId, dataType).pipe(
          map((mapData) => mapActions.getSeasonMapDataComplete({ mapData, dataType, seasonId })),
          catchError((error) => of(mapActions.getSeasonMapDataError({ error, dataType })))
        )
      )
    )
  );

  error$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(
          mapActions.enterSuccessMapError,
          mapActions.getSeasonMapDataError,
          mapActions.getMapCoordsError),
        tap((error) => console.log(error))
      ),
    { dispatch: false }
  );

}
