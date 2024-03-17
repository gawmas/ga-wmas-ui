import { SeasonHarvestData, SeasonSuccessData, WmaCoord } from "@model";
import { createAction, props } from "@ngrx/store";

const prefix = '[SuccessMap]';

export const enterSuccessMap = createAction(
  `${prefix} Enter Success Map`);

// Base WMA map coords ...
export const getSuccessMapCoords = createAction(
  `${prefix} Get Success Map Coords`);

export const getSuccessMapCoordsComplete = createAction(
  `${prefix} Get Success Map Coords Complete`,
  props<{ wmaCoords: WmaCoord[] }>());

export const getSuccessMapCoordsError = createAction(
  `${prefix} Get Success Map Coords Error`,
  props<{ error: string }>()
);

// Season harvest data ...
export const getSeasonHarvestData = createAction(
  `${prefix} Get Season Harvest Data`,
  props<{ seasonId: number }>());

export const getSeasonHarvestDataComplete = createAction(
  `${prefix} Get Season Harvest Data Complete`,
  props<{ seasonHarvestData: SeasonHarvestData }>());

export const getSeasonHarvestDataError = createAction(
  `${prefix} Get Season Harvest Data Error`,
  props<{ error: string }>()
);

// Season harvest data ...
export const getSeasonSuccessData = createAction(
  `${prefix} Get Season Success Data`,
  props<{ seasonId: number }>());

export const getSeasonSuccessDataComplete = createAction(
  `${prefix} Get Season Success Data Complete`,
  props<{ seasonHarvestData: SeasonSuccessData }>());

export const getSeasonSuccessDataError = createAction(
  `${prefix} Get Season Success Data Error`,
  props<{ error: string }>()
);


