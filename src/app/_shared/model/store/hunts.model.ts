import { Filter, Hunt } from "@model";

export interface HuntState {
  hunts: Hunt[];
  filter: Filter | null;
  endOfResults: boolean;
  loading: boolean;
  loadingMore: boolean;
}

export const initialHuntState: HuntState = {
  hunts: [],
  filter: {
    skip: 0,
    successRate: 0,
    wmas: [],
    seasons: [],
    weapons: [],
    isStatePark: null,
    isVpa: null,
    isBonusQuota: null,
    sort: null
  },
  endOfResults: false,
  loading: false,
  loadingMore: false
};
