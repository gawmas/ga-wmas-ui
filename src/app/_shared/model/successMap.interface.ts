export interface WmaCoord {
  id: number;
  name: string;
  lat: number;
  lng: number;
  // acreage: number | null;
}

export interface MapData {
  id: number;
  value: number;
}

export interface MapDataResult {
  type: string;
  weapons: WeaponResult[];
}

export interface WeaponResult {
  weapon: string;
  weaponId: number;
  data: MapData[];
}

export interface LegendCategory {
  min: number;
  max: number;
  factor: number;
  color: string;
}
