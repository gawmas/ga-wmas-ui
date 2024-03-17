import { createReducer, on } from "@ngrx/store";
import { initialSuccessMapState } from "_shared/model/store/successMap.model";
import * as successMapActions from "./successMap.actions";

export const successMapReducers = createReducer(

  initialSuccessMapState,

  on(
    successMapActions.getSuccessMapCoords,
    successMapActions.getSeasonSuccessData,
    successMapActions.getSeasonHarvestData, (state) => {
      return {
        ...state,
        loading: true
      };
  }),

  on(successMapActions.getSuccessMapCoordsComplete, (state, { wmaCoords }) => {
    return {
      ...state,
      wmaCoords: wmaCoords,
      loading: false
    };
}),

  on(successMapActions.getSeasonHarvestDataComplete, (state, { seasonHarvestData }) => {
      return {
        ...state,
        seasonHarvestData: seasonHarvestData,
        loading: false
      };
  }),

  on(successMapActions.getSeasonSuccessDataComplete, (state, { seasonHarvestData }) => {
    return {
      ...state,
      seasonSuccessData: seasonHarvestData,
      loading: false
    };
  }),

);
