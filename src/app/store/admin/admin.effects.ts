import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, of, tap, combineLatest, exhaustMap } from 'rxjs';
import { AdminService, HistClimateLocationService, MapService, SeasonService, WeaponService, WmaService } from '@services';
import * as adminActions from './admin.actions';

@Injectable()
export class AdminEffects {

  constructor(
    private readonly _actions$: Actions,
    private readonly _adminService: AdminService,
    private readonly _wmaService: WmaService,
    private readonly _weaponService: WeaponService,
    private readonly _seasonService: SeasonService,
    private readonly _histClimateLocationService: HistClimateLocationService,
    private readonly _mapCoordsService: MapService) { }

  getSingleHunt$ = createEffect(() =>
    this._actions$.pipe(
      ofType(adminActions.getSingleHunt),
      map((action) => action.id),
      switchMap((id) =>
        this._adminService.getHunt(id).pipe(
          map((hunt) => adminActions.getSingleHuntComplete({ hunt })),
          catchError((error) => of(adminActions.getSingleHuntError({ error })))
        )
      )
    )
  );

  updateHunt$ = createEffect(() =>
    this._actions$.pipe(
      ofType(adminActions.updateHunt),
      map((action) => action.huntPayload),
      switchMap((payload) =>
        this._adminService.updateHunt(payload).pipe(
          map((updatedHunt) => adminActions.updateHuntComplete({ hunt: updatedHunt })),
          catchError((error) => of(adminActions.updateHuntError({ error })))
        )
      )
    )
  );

  fetchAdminWmas$ = createEffect(() =>
    this._actions$.pipe(
      ofType(adminActions.enterWmasPage, adminActions.updateWmaComplete, adminActions.enterAddHuntsPage),
      switchMap(() =>
        combineLatest([
          this._adminService.getAdminWmas(),
          this._histClimateLocationService.histClimateLocations$,
          this._mapCoordsService.climateCoords$
        ]).pipe(
          map(([wmas, histClimateLocations, histClimateCoords]) => adminActions.getWmasComplete({ wmas, histClimateLocations, histClimateCoords })),
          catchError((error) => of(adminActions.getWmasError({ error })))
        )
      )
    )
  );

  updateWma$ = createEffect(() =>
    this._actions$.pipe(
      ofType(adminActions.updateWma),
      map((action) => action.wma),
      switchMap((wma) =>
        this._adminService.updateWma(wma).pipe(
          map((updatedWma) => adminActions.updateWmaComplete({ wma: updatedWma })),
          catchError((error) => of(adminActions.updateWmaError({ error })))
        )
      )
    )
  );

  fetchScrapedHunts$ = createEffect(() =>
    this._actions$.pipe(
      ofType(adminActions.loadScrapedHunts),
      switchMap(() =>
        this._adminService.getScrapedHunts().pipe(
          map((scrapedHunts) => adminActions.loadScrapedHuntsComplete({ scrapedHunts })),
          catchError((error) => of(adminActions.loadScrapedHuntsError({ error })))
        )
      )
    )
  );

  addHunts$ = createEffect(() =>
    this._actions$.pipe(
      ofType(adminActions.addHunts),
      map((action) => ({ seasonId: action.seasonId, newHunts: action.newHunts })),
      switchMap(({ seasonId, newHunts }) =>
        this._adminService.addHunts(seasonId, newHunts).pipe(
          map(() => adminActions.addHuntsComplete()),
          catchError((error) => of(adminActions.addHuntsError({ error })))
        )
      )
    )
  );

  error$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(adminActions.getSingleHuntError),
        tap((error) => console.log(error))
      ),
    { dispatch: false }
  );

}
