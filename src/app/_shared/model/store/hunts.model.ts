import { Filter, Hunt } from "@model";

export interface HuntState {
  hunts: Hunt[];
  filter: Filter | null;
  endOfResults: boolean;
  loading: boolean;
}

export const initialHuntState: HuntState = {
  hunts: [],
  filter: {
    skip: 0,
    successRate: 0,
    wmas: [],
    seasons: [],
    weapons: [],
  },
  endOfResults: false,
  loading: false
};
