import { Filter, Hunt, MapData, MapDataResult, Season, WmaCoord } from "@model";

export interface MapState {
  wmaCoords: WmaCoord[];
  mapData?: MapDataResult;
  seasons: Season[];
  mapWmaResults?: Hunt[];
  mapWmaHuntFilter?: Filter;
  selectedWeapon: number;
  selectedSeason: number;
  mapTitle: string;
  setZoomFull: boolean;
  loading: boolean;
  showLegend: boolean;
}

export const initialMapState: MapState = {
  loading: false,
  seasons: [],
  wmaCoords: [],
  mapData: undefined,
  selectedWeapon: 0,
  selectedSeason: 0,
  mapTitle: '',
  setZoomFull: false,
  showLegend: true
};
