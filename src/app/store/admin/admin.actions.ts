import { HistClimateLocation, Hunt, HuntPayload, MapCoords, ScrapedHunt, Season, Weapon, Wma } from "@model";
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

export const updateWma = createAction(
  `${prefix} Update Wma`,
  props<{ wma: Wma }>());

export const updateWmaComplete = createAction(
  `${prefix} Update Wma Complete`,
  props<{ wma: Wma }>());

export const updateWmaError = createAction(
  `${prefix} Update Wma Error`,
  props<{ error: string }>());

// Add Hunts page ...
export const enterAddHuntsPage = createAction(
  `${prefix} Enter Add Hunts Page`);

export const enterAddHuntsPageComplete = createAction(
  `${prefix} Enter Add Hunts Page`,
);

export const loadScrapedHunts = createAction(
  `${prefix} Load Scraped Hunts`);

export const loadScrapedHuntsError = createAction(
  `${prefix} Load Scrapped Hunts Error`,
  props<{ error: string }>());

export const loadScrapedHuntsComplete = createAction(
  `${prefix} Load Scraped Hunts Complete`,
  props<{ scrapedHunts: ScrapedHunt[] }>());

export const addHunts = createAction(
  `${prefix} Add Hunts`,
  props<{ seasonId: string, newHunts: any[] }>());

export const addHuntsComplete = createAction(
  `${prefix} Add Hunts Complete`);

export const addHuntsError = createAction(
  `${prefix} Add Hunts Error`,
  props<{ error: string }>());

