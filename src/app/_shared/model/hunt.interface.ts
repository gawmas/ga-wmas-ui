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
  wxDetails?: WxHistDetailedHunt[] | WxHistSummaryHunt[];
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

export interface WxHistDetailedHunt {
  date: string;
  high: number;
  low: number;
  middayDescr: string;
  middayIcon: string;
  moonIllum: number;
  moonPhase: string;
}

export interface WxHistSummaryHunt {
  start: string;
  end: string;
  location: string;
  avgMaxTemp: number;
  avgMinTemp: number;
  maxTemp: number;
  minTemp: number;
}
