export interface WmaCoord {
  id: number;
  name: string;
  lat: number;
  lng: number;
  // acreage: number | null;
}

export interface WmaSuccess {
  id: number;
  success: number;
}

export interface WmaHarvest {
  id: number;
  harvest: number;
}

export interface WeaponHarvest {
  weapon: string;
  weaponId: number;
  data: WmaHarvest[];
}

export interface WeaponSuccess {
  weapon: string;
  weaponId: number;
  data: WmaSuccess[];
}

export interface SeasonHarvestData {
  weapons: WeaponHarvest[];
  totalHarvest: WmaHarvest[];
}

export interface SeasonSuccessData {
  weapons: WeaponSuccess[];
  totalSuccess: WmaSuccess[];
}
