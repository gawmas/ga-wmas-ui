import { createSelector } from '@ngrx/store';
import { AppStateInterface } from '@store-model';
import { MapState } from '_shared/model/store/successMap.model';

export const selectSuccessMapState = (state: AppStateInterface) => state.mapState;

export const selectSuccessMapWmaCoords = createSelector(
  selectSuccessMapState,
  (state: MapState) => state.wmaCoords
);

export const selectSuccessMapLoading = createSelector(
  selectSuccessMapState,
  (state: MapState) => state.loading
);

export const selectSeasons = createSelector(
  selectSuccessMapState,
  (state: MapState) => state.seasons
);

export const selectSelectedSeason = createSelector(
  selectSuccessMapState,
  (state: MapState) => state.selectedSeason
);

export const selectMapData = createSelector(
  selectSuccessMapState,
  (state: MapState) => state.mapData
);

export const selectWeapon = createSelector(
  selectSuccessMapState,
  (state: MapState) => state.selectedWeapon
);

export const selectMapTitle = createSelector(
  selectSuccessMapState,
  (state: MapState) => state.mapTitle
);

export const selectSetZoomFull = createSelector(
  selectSuccessMapState,
  (state: MapState) => state.setZoomFull
);

export const selectChanges = createSelector(
  selectSuccessMapWmaCoords,
  selectSeasons,
  selectSelectedSeason,
  selectMapData,
  selectWeapon,
  selectSetZoomFull,
  (wmaCoords, seasons, selectedSeason, mapData, weapon, zoomFull) => {
    return { wmaCoords, seasons, selectedSeason, mapData, weapon, zoomFull };
});

export const selectMapWmaResults = createSelector(
  selectSuccessMapState,
  (state: MapState) => state.mapWmaResults
);

export const selectMapWmaHuntFilter = createSelector(
  selectSuccessMapState,
  (state: MapState) => state.mapWmaHuntFilter
);

