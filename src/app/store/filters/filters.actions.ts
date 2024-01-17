import { Filter, FilterAuxData } from "@model";
import { createAction, props } from "@ngrx/store";

const prefix = '[Filters]';

export const getFilterAuxData = createAction(`${prefix} Get Filter Aux Data`);

export const getFilterAuxDataComplete = createAction(
  `${prefix} Get Filter Aux Data Complete`,
  props<{ filterAuxData: FilterAuxData }>());

export const filtersChanged = createAction(
  `${prefix} Filters Changed`,
  props<{ filter?: Filter }>());

  export const getFilterAuxDataError = createAction(
    `${prefix} Get Filter Aux Data Error`,
    props<{ error: string }>()
  );
