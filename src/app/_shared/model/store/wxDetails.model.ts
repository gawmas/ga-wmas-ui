import { WxAstro, WxDetails, WxHistAvg, WxPrimetime } from "@model";

export interface WxDetailsState {
  wxDetails: WxDetails;
  loading: boolean;
  error: string;
}

export const initialWxDetailsState = {
  wxDetails: {
    primetimes: [] as WxPrimetime[],
    astros: [] as WxAstro[],
    histAvgs: [] as WxHistAvg[]
  },
  loading: false,
  error: ''
}
