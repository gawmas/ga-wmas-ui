import { Wma } from '@model';
import { createSelector } from '@ngrx/store';
import { FilterAuxDataState, AppStateInterface } from '@store-model';

export const selectFiltersState = (state: AppStateInterface) => state.filterAuxDataState;

export const selectFiltersAuxData = createSelector(
  selectFiltersState,
  (state: FilterAuxDataState) => state.filterAuxData
);

export const selectWmas = createSelector(
  selectFiltersAuxData,
  (filterAuxData) => filterAuxData.wmas as Wma[]
);

export const selectSeasons = createSelector(
  selectFiltersAuxData,
  (filterAuxData) => filterAuxData.seasons
);

export const selectWeapons = createSelector(
  selectFiltersAuxData,
  (filterAuxData) => filterAuxData.weapons
);

export const selectFiltersAuxDataLoading = createSelector(
  selectFiltersState,
  (state: FilterAuxDataState) => state.loading
);



