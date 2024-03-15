import { createSelector } from '@ngrx/store';
import { AppStateInterface } from '@store-model';
import { WxDetailsState } from '_shared/model/store/wxDetails.model';

export const selectWxDetailsState = (state: AppStateInterface) => state.wxDetailsState;

export const selectWxDetails = createSelector(
  selectWxDetailsState,
  (state: WxDetailsState) => state.wxDetails
);

export const selectWxDetailsLoading = createSelector(
  selectWxDetailsState,
  (state: WxDetailsState) => state.loading
);
