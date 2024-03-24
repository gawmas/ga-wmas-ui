import { MapDataResult, Season, WmaCoord } from "@model";
import { createAction, props } from "@ngrx/store";

const prefix = '[SuccessMap]';

export const enterSuccessMap = createAction(
  `${prefix} Enter Success Map`
);

export const enterSuccessMapComplete = createAction(
  `${prefix} Enter Success Map Complete`,
  props<{ wmaCoords: WmaCoord[], seasons: Season[], mapData: MapDataResult }>());

export const enterSuccessMapError = createAction(
  `${prefix} Enter Success Map Error`,
  props<{ error: string }>()
);

// Base WMA map coords ...
export const getMapCoords = createAction(
  `${prefix} Get Success Map Coords`);

export const getMapCoordsComplete = createAction(
  `${prefix} Get Success Map Coords Complete`,
  props<{ wmaCoords: WmaCoord[] }>());

export const getMapCoordsError = createAction(
  `${prefix} Get Success Map Coords Error`,
  props<{ error: string }>()
);

// Seasons data ...
export const getSeasons = createAction(
  `${prefix} Get Seasons`);

export const getSeasonsComplete = createAction(
  `${prefix} Get Seasons Complete`,
  props<{ seasons: Season[] }>());

export const getSeasonsError = createAction(
  `${prefix} Get Seasons Error`,
  props<{ error: string }>()
);

export const getSeasonMapData = createAction(
  `${prefix} Get Season Map Data`,
  props<{ seasonId: number, dataType: string }>());

export const getSeasonMapDataComplete = createAction(
  `${prefix} Get Season Map Data Complete`,
  props<{ mapData: MapDataResult, dataType: string, seasonId: number }>());

export const getSeasonMapDataError = createAction(
  `${prefix} Get Season Map Data Error`,
  props<{ error: string, dataType: string }>()
);

export const weaponChange = createAction(
  `${prefix} Weapon Change`,
  props<{ weaponId: number }>()
);

export const setZoomFull = createAction(
  `${prefix} Set Zoom Full`,
  props<{ value: boolean }>()
);

