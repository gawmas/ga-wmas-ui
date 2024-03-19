import { createReducer, on } from "@ngrx/store";
import { initialMapState } from "_shared/model/store/successMap.model";
import * as mapActions from "./successMap.actions";
import { MapData, MapDataResult, Season } from "@model";

export const mapReducers = createReducer(

  initialMapState,

  on(
    mapActions.enterSuccessMap, mapActions.getSeasonMapData, (state) => {
      return {
        ...state,
        loading: true
      };
    }),

  on(mapActions.enterSuccessMapComplete, (state, { wmaCoords, seasons, mapData }) => {
    return {
      ...state,
      wmaCoords: wmaCoords,
      seasons: seasons,
      mapData: mapData,
      selectedWeapon: 0,
      selectedSeason: seasons[0].id,
      loading: false,
      mapTitle: `WMA Success Rate - All Weapons`
    };
  }),

  on(mapActions.getMapCoordsComplete, (state, { wmaCoords }) => {
    return {
      ...state,
      wmaCoords: wmaCoords,
      loading: false
    };
  }),

  on(mapActions.getSeasonMapDataComplete, (state, { mapData, dataType, seasonId, }) => {
    return {
      ...state,
      mapData: mapData,
      selectedSeason: seasonId,
      loading: false,
      mapTitle: `WMA ${titleDescr(dataType)} - ${weaponText(state.selectedWeapon)}`
    };
  }),

  on(mapActions.weaponChange, (state, { weaponId }) => {
    return {
      ...state,
      selectedWeapon: weaponId,
      mapTitle: `WMA ${titleDescr(state.mapData?.type!)} - ${weaponText(weaponId)}`
    };
  })

);

function titleDescr(type: string) {
  return type === 'success' ? 'Success Rate' : type === 'harvestrate' ? 'Harvest per Acre' : 'Total Harvest';
}

function weaponText(weaponId: number) {
  return weaponId === 0 ? 'All Weapons' : weaponId === 1 ? 'Firearms' : weaponId === 2 ? 'Archery' : 'Primitive';
}
