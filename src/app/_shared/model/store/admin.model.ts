import { HistClimateLocation, Hunt, MapCoords, ScrapedHunt, Wma } from "@model";

export interface AdminState {
  hunt: Hunt | null;
  wmas?: Wma[] | null;
  histClimateLocations?: HistClimateLocation[] | null;
  histClimateCoords?: MapCoords[] | null;
  scrapedHunts?: ScrapedHunt[] | null;
  loading: boolean;
}

export const initialAdminState: AdminState = {
  hunt: null,
  loading: false
};
