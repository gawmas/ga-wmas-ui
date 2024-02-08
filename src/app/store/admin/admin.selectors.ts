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


