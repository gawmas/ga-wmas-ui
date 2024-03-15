import { createReducer, on } from "@ngrx/store";
import { initialWxDetailsState } from '_shared/model/store/wxDetails.model';
import * as wxDetailActions from "./wxDetails.actions";
import { WxAstro, WxHistAvg, WxPrimetime } from "@model";

export const wxDetailsReducers = createReducer(

  initialWxDetailsState,

  on(wxDetailActions.getWxDetails, (state) => {
    return {
      ...state,
      loading: true
    };
  }),

  on(wxDetailActions.getWxDetailsComplete, (state, { wxDetails }) => {
    return {
      ...state,
      wxDetails: wxDetails,
      loading: false
    };
  }),

  on(wxDetailActions.clearWxDetails, (state) => {
    return {
      ...state,
      wxDetails: {
        primetimes: [] as WxPrimetime[],
        astros: [] as WxAstro[],
        histAvgs: [] as WxHistAvg[]
      },
    };
  })

);
