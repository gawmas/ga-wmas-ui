import { createSelector } from '@ngrx/store';
import { FilterAuxDataState, AppStateInterface } from '@store-model';

export const selectFiltersState = (state: AppStateInterface) => state.filterAuxDataState;

export const selectFiltersAuxData = createSelector(
  selectFiltersState,
  (state: FilterAuxDataState) => state.filterAuxData
);

export const selectFiltersAuxDataLoading = createSelector(
  selectFiltersState,
  (state: FilterAuxDataState) => state.loading
);



