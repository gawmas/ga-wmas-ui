import { FilterAuxData } from "@model";
import { createAction, props } from "@ngrx/store";

const prefix = '[Filters]';

export const getFilterAuxData = createAction(`${prefix} Get Filter Aux Data`);

export const getFilterAuxDataComplete = createAction(
  `${prefix} Filter Aux Data Complete`,
  props<{ filterAuxData: FilterAuxData }>());

export const getFilterAuxDataError = createAction(
  `${prefix} Filter Aux Data Error`,
  props<{ error: string }>()
);
