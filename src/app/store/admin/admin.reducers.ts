import { createReducer, on } from "@ngrx/store";
import { initialAdminState } from '_shared/model/store/admin.model';
import * as adminActions from "./admin.actions";

export const adminReducers = createReducer(

  initialAdminState,

  on(adminActions.getSingleHunt, (state) => {
    return {
      ...state,
      loading: true
    };
  }),

  on(adminActions.getSingleHuntComplete, (state, { hunt }) => {
    return {
      ...state,
      hunt: hunt,
      loading: false
    };
  }),

  on(adminActions.clearSingleHunt, (state) => {
    return {
      ...state,
      hunt: null
    };
  }

));
