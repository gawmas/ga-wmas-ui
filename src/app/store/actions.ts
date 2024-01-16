import { createAction, props } from "@ngrx/store";
import { Filter, Hunt } from "@model";

const prefix = '[Hunts]';

export const getInitialHunts = createAction(
  `${prefix} Get Initial Hunts`,
  props<{ filter?: Filter }>());

export const getMoreHunts = createAction(
  `${prefix} Get More Hunts`,
  props<{ filter?: Filter }>());

export const filtersChanged = createAction(
  `${prefix} Filters Changed`,
  props<{ filter?: Filter }>());

export const getHuntsComplete = createAction(
  `${prefix} Get Hunts Complete`,
  props<{ hunts: Hunt[] }>());

export const huntsError = createAction(
  `${prefix} Get Hunts Error`,
  props<{ error: string }>()
);
