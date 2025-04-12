import { WxDetailsHuntDetails } from "./store/wxDetails.model";

export interface WxDetails {
  primetimes: WxPrimetime[];
  astros: WxAstro[];
  histAvgs: WxHistAvg[];
  huntDetails: WxDetailsHuntDetails;
}

export interface WxPrimetime {
  id: number;
  location: string;
  huntDate: string;
  stdTime: string;
  icon: string;
  descr: string;
  windDir: string;
  windSpeed: number;
  windGust: number;
  viz: number;
  temp: number;
  feltLike: number;
}

export interface WxAstro {
  id: number;
  sunRise: string;
  sunSet: string;
  moonRise: string;
  moonSet: string;
  moonIllum: number;
  moonPhase: string;
}

export interface WxHistAvg {
  day: number;
  low: number;
  high: number;
  month: number;
}
