import { createSelector } from '@ngrx/store';
import { HuntState, AppStateInterface } from '@store-model';

export const selectHuntsState = (state: AppStateInterface) => state.huntState;

export const selectHunts = createSelector(
  selectHuntsState,
  (state: HuntState) => state.hunts
);

export const selectFilter = createSelector(
  selectHuntsState,
  (state: HuntState) => state.filter
);

export const selectAllHuntsLength = createSelector(
  selectHuntsState,
  (state: HuntState) => state.hunts.length
);

export const selectHuntsLoading = createSelector(
  selectHuntsState,
  (state: HuntState) => state.loading
);

export const selectEndOfResults = createSelector(
  selectHuntsState,
  (state: HuntState) => state.endOfResults
);
