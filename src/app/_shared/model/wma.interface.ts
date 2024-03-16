export interface Wma {
  id: number;
  name: string;
  isSP: boolean;
  isVPA: boolean;
  locationId: number;
  visible?: boolean;
  physLat?: number;
  physLong?: number;
  hasBonusQuotas?: boolean;
  physTown?: string;
  histClimateTown?: string;
  histClimateLat?: number;
  histClimateLong?: number;
  hasDailyData?: boolean;
  acres: number;
}

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
