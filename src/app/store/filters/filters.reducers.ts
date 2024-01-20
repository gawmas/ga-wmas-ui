import { initialFilterAuxDataState } from '@store-model';
import { createReducer, on } from "@ngrx/store";
import { Filter } from '@model';
import * as filterActions from "./filters.actions";

export const filterAuxDataReducers = createReducer(

  initialFilterAuxDataState,

  on(filterActions.getFilterAuxData, (state) => {
    return {
      ...state,
      loading: true
    };
  }),

  on(filterActions.getFilterAuxDataComplete, (state, { filterAuxData }) => {
    return {
      ...state,
      filterAuxData: filterAuxData,
      loading: false
    };
  }),

);
