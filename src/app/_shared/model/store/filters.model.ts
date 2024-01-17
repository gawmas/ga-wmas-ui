import { FormArray, FormControl } from "@angular/forms";
import { FilterAuxData } from "@model";

export interface FilterAuxDataState {
  filterAuxData: FilterAuxData;
  wmasFormArray: FormArray;
  loading: boolean;
}

export const initialFilterAuxDataState: FilterAuxDataState = {
  filterAuxData: {
    wmas: [],
    filteredWmas: [],
    seasons: [],
    weapons: []
  },
  wmasFormArray: new FormArray<FormControl>([]),
  loading: false
};
