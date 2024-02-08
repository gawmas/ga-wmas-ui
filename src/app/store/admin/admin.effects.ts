import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, of, tap} from 'rxjs';
import { AdminService } from '@services';
import * as adminActions from './admin.actions';

@Injectable()
export class AdminEffects {

  constructor(
    private readonly _actions$: Actions,
    private readonly _adminService: AdminService) {}

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

  error$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(adminActions.getSingleHuntError),
        tap((error) => console.log(error))
      ),
    { dispatch: false }
  );

}
