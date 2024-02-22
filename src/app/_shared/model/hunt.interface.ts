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
  hunterDensity: number;
  wmaAcres: number;
  huntDates: HuntDate[];
  quota: number | null;
  location: string;
  climateTown: string;
  coords: string;
  histClimateId: number;
  physLat?: number;
  physLong?: number;
  isBonusQuota?: boolean;
  wxHistAvgs?: WxHistAverageTemps[];
}

export interface HuntDate {
  start: string;
  end: string;
}

export interface HuntPayload extends Hunt {
  startDates: string[];
  endDates: string[];
}

export interface WxHistAverageTemps {
  avgHigh: number;
  avgLow: number;
  startDate: string;
  endDate: string;
}
