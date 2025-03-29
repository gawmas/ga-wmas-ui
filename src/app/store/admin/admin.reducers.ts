import { createReducer, on } from "@ngrx/store";
import { initialAdminState } from '_shared/model/store/admin.model';
import * as adminActions from "./admin.actions";

export const adminReducers = createReducer(

  initialAdminState,

  on(adminActions.getSingleHunt, adminActions.updateHunt, (state) => {
    return {
      ...state,
      loading: true
    };
  }),

  on(adminActions.getSingleHuntComplete, adminActions.updateHuntComplete, (state, { hunt }) => {
    return {
      ...state,
      hunt: hunt,
      loading: false
    };
  }),

  on(adminActions.clearSingleHunt, (state) => {
    return {
      ...state,
      hunt: null
    };
  }),

  on(adminActions.getWmasComplete, (state, { wmas, histClimateLocations, histClimateCoords }) => {
    return {
      ...state,
      wmas: wmas,
      histClimateLocations: histClimateLocations,
      histClimateCoords: histClimateCoords,
    };
  }),

  on(adminActions.loadScrapedHuntsComplete, (state, { scrapedHunts }) => {
    return {
      ...state,
      scrapedHunts: scrapedHunts
    };
  }),

  on(adminActions.addHunts, (state) => {
    return {
      ...state,
      loading: true
    }
  }),

  on(adminActions.addHuntsComplete, (state) => {
    return {
      ...state,
      loading: false
    }
  }),

);
