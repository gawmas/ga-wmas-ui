import { Injectable } from "@angular/core";
import { WxDetailsService } from "@services";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, of, tap, startWith, delay } from 'rxjs';
import * as wxDetailsActions from './wxDetails.actions';

@Injectable()
export class WxDetailsEffects {

  constructor(
    private readonly _actions$: Actions,
    private readonly _wxDetailsService: WxDetailsService) {}

  getWxDetails$ = createEffect(() =>
    this._actions$.pipe(
      ofType(wxDetailsActions.getWxDetails),
      // delay(15000),
      map((action) => action.id),
      switchMap((id) =>
        this._wxDetailsService.getWxDetail(id).pipe(
          map((wxDetails) => wxDetailsActions.getWxDetailsComplete({ wxDetails })),
          catchError((error) => of(wxDetailsActions.getWxDetailsError({ error })))
        )
      )
    )
  );

  error$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(wxDetailsActions.getWxDetailsError),
        tap((error) => console.log(error))
      ),
    { dispatch: false }
  );

}
