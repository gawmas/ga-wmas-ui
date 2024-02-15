import { select } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { AppStateInterface } from '@store-model';
import { AdminState } from '_shared/model/store/admin.model';

export const selectAdminState = (state: AppStateInterface) => state.adminState;

export const selectHunt = createSelector(
  selectAdminState,
  (state: AdminState) => state.hunt
);

export const selectHuntLoading = createSelector(
  selectAdminState,
  (state: AdminState) => state.loading
);

export const selectWmas = createSelector(
  selectAdminState,
  (state: AdminState) => state.wmas
);

export const selectHistClimateLocations = createSelector(
  selectAdminState,
  (state: AdminState) => state.histClimateLocations
);

export const selectHistClimateCoords = createSelector(
  selectAdminState,
  (state: AdminState) => state.histClimateCoords
);


