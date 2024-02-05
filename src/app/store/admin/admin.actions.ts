import { Hunt } from "@model";
import { createAction, props } from "@ngrx/store";

const prefix = '[Admin]';

export const getSingleHunt = createAction(
  `${prefix} Get Single Hunt`,
  props<{ id: string }>());

export const getSingleHuntComplete = createAction(
  `${prefix} Get Single Hunt Complete`,
  props<{ hunt: Hunt }>());

export const getSingleHuntError = createAction(
  `${prefix} Get Single Hunt Error`,
  props<{ error: string }>()
);
