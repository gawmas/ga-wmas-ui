import { Filter, Hunt } from "@model";

export interface HuntState {
  hunts: Hunt[];
  filter: Filter | null;
  endOfResults: boolean;
  loading: boolean;
}

export const initialHuntState: HuntState = {
  hunts: [],
  filter: null,
  endOfResults: false,
  loading: false
};
