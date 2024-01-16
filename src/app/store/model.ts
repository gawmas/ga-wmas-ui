import { Filter, Hunt } from "@model";

export interface AppInterface  {
  huntState: HuntState;
}

export interface HuntState {
  hunts: Hunt[];
  filter: Filter | null;
  endOfResults: boolean;
  loading: boolean;
}

export const initialState: HuntState = {
  hunts: [],
  filter: null,
  endOfResults: false,
  loading: false
};
