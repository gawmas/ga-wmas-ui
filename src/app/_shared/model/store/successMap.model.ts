import { MapData, MapDataResult, Season, WmaCoord } from "@model";

export interface MapState {
  wmaCoords: WmaCoord[];
  mapData?: MapDataResult;
  seasons: Season[];
  selectedWeapon: number;
  selectedSeason: number;
  mapTitle: string;
  loading: boolean;
}

export const initialMapState: MapState = {
  loading: false,
  seasons: [],
  wmaCoords: [],
  mapData: undefined,
  selectedWeapon: 0,
  selectedSeason: 0,
  mapTitle: ''
};
