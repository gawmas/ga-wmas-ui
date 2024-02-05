import { createReducer, on } from "@ngrx/store";
import * as adminActions from "./admin.actions";
import { initialAdminState } from '_shared/model/store/admin.model';

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

);
