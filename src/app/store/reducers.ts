import { filter } from 'rxjs';
import { createReducer, on } from "@ngrx/store";
import * as huntActions from "./actions";
import { initialState } from "./model";
import { Filter } from '@model';

export const huntsReducers = createReducer(

  initialState,

  on(huntActions.getInitialHunts, huntActions.getMoreHunts, (state) => {
    return {
      ...state,
      loading: true
    };
  }),

  on(huntActions.getHuntsComplete, (state, { hunts }) => {
    return {
      ...state,
      hunts: [...state.hunts, ...hunts],
      endOfResults: hunts.length < 10,
      loading: false,
    };
  }),

  on(huntActions.filtersChanged, (state, { filter }) => {
    return {
      ...state,
      filter: filter as Filter,
      hunts: [],
      loading: false,
    };
  })

);


