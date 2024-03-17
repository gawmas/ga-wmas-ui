import { HistClimateLocation, Hunt, MapCoords, SeasonHarvestData, SeasonSuccessData, Wma, WmaCoord, WmaHarvest, WmaSuccess } from "@model";

export interface SuccessMapState {
  wmaCoords: WmaCoord[];
  seasonHarvestData: SeasonHarvestData;
  seasonSuccessData: SeasonSuccessData;
  loading: boolean;
}

export const initialSuccessMapState: SuccessMapState = {
  loading: false,
  wmaCoords: [],
  seasonHarvestData: {} as SeasonHarvestData,
  seasonSuccessData: {} as SeasonSuccessData
};
