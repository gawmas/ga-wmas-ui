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
}
