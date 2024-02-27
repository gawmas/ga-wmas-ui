import { Filter, Hunt } from "@model";

export interface HuntState {
  hunts: Hunt[];
  filter: Filter;
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
    isStatePark: false,
    isVpa: false,
    isBonusQuota: false,
    sort: ''
  },
  endOfResults: false,
  loading: false,
  loadingMore: false
};
