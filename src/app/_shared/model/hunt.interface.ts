export interface Hunt {
  id: number;
  wmaId: number;
  wmaName: string;
  seasonId: number;
  season: string;
  details: string;
  weapon: string;
  does: number;
  bucks: number;
  hunterCount: number;
  startDate: string;
  endDate: string;
  quota: number | null;
  location: string;
  climateTown: string;
  coords: string;
  histClimateId: number;
}
