import { createReducer, on } from "@ngrx/store";
import { initialHuntState } from "./../../_shared/model/store/hunts.model";
import * as appActions from "./hunts.actions";
import { Filter } from "@model";

export const huntsReducers = createReducer(

  initialHuntState,

  on(appActions.getInitialHunts, (state) => {
    return {
      ...state,
      filter: state.filter,
      loading: true
    };
  }),

  on(appActions.getMoreHunts, (state) => {
    return {
      ...state,
      loadingMore: true
    };
  }),

  on(appActions.getMoreHuntsComplete, (state, { hunts }) => {
    return {
      ...state,
      hunts: [...state.hunts, ...hunts],
      endOfResults: hunts.length < (state.filter?.pageSize ?? 10),
      loadingMore: false,
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


