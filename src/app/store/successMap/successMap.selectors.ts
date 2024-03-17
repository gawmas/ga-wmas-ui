import { createSelector } from '@ngrx/store';
import { AppStateInterface } from '@store-model';
import { SuccessMapState } from '_shared/model/store/successMap.model';

export const selectSuccessMapState = (state: AppStateInterface) => state.successMapState;

export const selectSuccessMapWmaCoords = createSelector(
  selectSuccessMapState,
  (state: SuccessMapState) => state.wmaCoords
);

export const selectSuccessMapLoading = createSelector(
  selectSuccessMapState,
  (state: SuccessMapState) => state.loading
);

export const selectSuccessMapHarvestData = createSelector(
  selectSuccessMapState,
  (state: SuccessMapState) => state.seasonHarvestData
);

export const selectSuccessMapSuccessData = createSelector(
  selectSuccessMapState,
  (state: SuccessMapState) => state.seasonSuccessData
);


