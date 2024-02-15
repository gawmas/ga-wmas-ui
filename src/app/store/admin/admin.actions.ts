import { HistClimateLocation, Hunt, HuntPayload, MapCoords, Wma } from "@model";
import { createAction, props } from "@ngrx/store";

const prefix = '[Admin]';

export const getSingleHunt = createAction(
  `${prefix} Get Single Hunt`,
  props<{ id: string }>());

export const clearSingleHunt = createAction(
  `${prefix} Clear Single Hunt`
);

export const getSingleHuntComplete = createAction(
  `${prefix} Get Single Hunt Complete`,
  props<{ hunt: Hunt }>());

export const getSingleHuntError = createAction(
  `${prefix} Get Single Hunt Error`,
  props<{ error: string }>()
);

export const updateHunt = createAction(
  `${prefix} Update Hunt`,
  props<{ huntPayload: HuntPayload }>());

export const updateHuntComplete = createAction(
  `${prefix} Update Hunt Complete`,
  props<{ hunt: Hunt }>());

export const updateHuntError = createAction(
  `${prefix} Update Hunt Error`,
  props<{ error: string }>()
);

export const enterWmasPage = createAction(
  `${prefix} Enter Wmas Page`
);

export const getWmasComplete = createAction(
  `${prefix} Get Wmas Complete`,
  props<{ wmas: Wma[], histClimateLocations: HistClimateLocation[], histClimateCoords: MapCoords[] }>());

export const getWmasError = createAction(
  `${prefix} Get Wmas Error`,
  props<{ error: string }>()
);
