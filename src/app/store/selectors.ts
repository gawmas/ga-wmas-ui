import { createSelector } from '@ngrx/store';
import { HuntState, AppInterface } from './model';

export const selectHuntState = (state: AppInterface) => state.huntState;

export const selectHunts = createSelector(
  selectHuntState,
  (state: HuntState) => state.hunts
);

export const selectFilter = createSelector(
  selectHuntState,
  (state: HuntState) => state.filter
);

export const selectHuntsLoaded = createSelector(
  selectHuntState,
  (state: HuntState) => state.hunts
);

export const selectAllHuntsLength = createSelector(
  selectHuntState,
  (state: HuntState) => state.hunts.length
);

export const selectHuntsLoading = createSelector(
  selectHuntState,
  (state: HuntState) => state.loading
);
