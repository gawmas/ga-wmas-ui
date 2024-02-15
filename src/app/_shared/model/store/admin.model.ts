import { HistClimateLocation, Hunt, MapCoords, Wma } from "@model";

export interface AdminState {
  hunt: Hunt | null;
  wmas?: Wma[] | null;
  histClimateLocations?: HistClimateLocation[] | null;
  histClimateCoords?: MapCoords[] | null;
  loading: boolean;
}

export const initialAdminState: AdminState = {
  hunt: null,
  loading: false
};
