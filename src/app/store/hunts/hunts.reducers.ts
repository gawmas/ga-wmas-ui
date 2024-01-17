import { createReducer, on } from "@ngrx/store";
import { initialHuntState } from "./../../_shared/model/store/hunts.model";
import { Filter } from '@model';
import * as appActions from "./hunts.actions";

export const huntsReducers = createReducer(

  initialHuntState,

  on(appActions.getInitialHunts, appActions.getMoreHunts, (state) => {
    return {
      ...state,
      loading: true
    };
  }),

  on(appActions.getHuntsComplete, (state, { hunts }) => {
    return {
      ...state,
      hunts: [...state.hunts, ...hunts],
      endOfResults: hunts.length < 10,
      loading: false,
    };
  }),

);


