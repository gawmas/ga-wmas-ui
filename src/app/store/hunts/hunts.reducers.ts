import { createReducer, on } from "@ngrx/store";
import { initialHuntState } from "./../../_shared/model/store/hunts.model";
import * as appActions from "./hunts.actions";

export const huntsReducers = createReducer(

  initialHuntState,

  on(appActions.getInitialHunts, appActions.getMoreHunts, (state) => {
    return {
      ...state,
      filter: state.filter,
      loading: true
    };
  }),

  on(appActions.getMoreHuntsComplete, (state, { hunts }) => {
    return {
      ...state,
      hunts: [...state.hunts, ...hunts],
      endOfResults: hunts.length < (state.filter?.pageSize ?? 10),
      loading: false,
    };
  }),

  on(appActions.filtersChanged, (state, { filter }) => {
    return {
      ...state,
      filter: { ...state.filter, ...filter! },
      loading: true,
    };
  }),

  on(appActions.getHuntsComplete, (state, { hunts, filter }) => {
    return {
      ...state,
      filter: { ...state.filter, ...filter },
      hunts: hunts,
      endOfResults: hunts.length < (state.filter?.pageSize ?? 10),
      loading: false,
    };
  }),

);


