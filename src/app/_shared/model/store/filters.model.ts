import { FilterAuxData } from "@model";

export interface FilterAuxDataState {
  filterAuxData: FilterAuxData;
  loading: boolean;
}

export const initialFilterAuxDataState: FilterAuxDataState = {
  filterAuxData: {
    wmas: [],
    filteredWmas: [],
    seasons: [],
    weapons: [],
    histClimateLocations: []
  },
  loading: false
};
