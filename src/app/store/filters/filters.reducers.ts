import { initialFilterAuxDataState } from '@store-model';
import { createReducer, on } from "@ngrx/store";
import { Filter } from '@model';
import * as filterActions from "./filters.actions";
import { filter } from 'rxjs';
import { FormArray, FormControl } from '@angular/forms';

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

  on(filterActions.filtersChanged, (state, { filter }) => {
    return {
      ...state,
      filter: filter as Filter,
      hunts: [],
      loading: false,
    };
  }),

);
