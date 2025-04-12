import { HuntDate, Weapon, WxAstro, WxDetails, WxHistAvg, WxPrimetime } from "@model";

export interface WxDetailsState {
  wxDetails: WxDetails;
  loading: boolean;
  error: string;
}

export interface WxDetailsHuntDetails {
  weapon: string;
  hunterCount: number;
  bucks: number;
  does: number;
  location: string;
  huntDates: HuntDate[];
}

export const initialWxDetailsState = {
  wxDetails: {
    primetimes: [] as WxPrimetime[],
    astros: [] as WxAstro[],
    histAvgs: [] as WxHistAvg[],
    huntDetails: {} as WxDetailsHuntDetails,
  },
  loading: false,
  error: ''
}
