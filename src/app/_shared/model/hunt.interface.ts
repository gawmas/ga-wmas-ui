export interface Hunt {
  id: number;
  wmaId: number;
  wmaName: string;
  seasonId: number;
  season: string;
  details: string;
  weapon: string;
  weaponId: number;
  does: number;
  bucks: number;
  hunterCount: number;
  // startDate: string;
  // endDate: string;
  huntDates: HuntDate[];
  quota: number | null;
  location: string;
  climateTown: string;
  coords: string;
  histClimateId: number;
  physLat?: number;
  physLong?: number;
  isBonusQuota?: boolean;
}

export interface HuntDate {
  start: string;
  end: string;
}
