import { AdminState } from './admin.model';
import { FilterAuxDataState } from './filters.model';
import { HuntState } from './hunts.model';

export { initialHuntState, HuntState } from './hunts.model';
export { initialFilterAuxDataState, FilterAuxDataState } from './filters.model';

export interface AppStateInterface  {
  huntState: HuntState;
  filterAuxDataState: FilterAuxDataState;
  adminState: AdminState;
}
