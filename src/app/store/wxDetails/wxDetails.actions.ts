import { WxDetails } from "@model";
import { createAction, props } from "@ngrx/store";

const prefix = '[WxDetails]';

export const getWxDetails = createAction(
  `${prefix} Get Wx Details`,
  props<{ id: string }>());

export const getWxDetailsComplete = createAction(
  `${prefix} Get Wx Details Complete`,
  props<{ wxDetails: WxDetails }>());

export const clearWxDetails = createAction(
  `${prefix} Clear Wx Details`
);

export const getWxDetailsError = createAction(
  `${prefix} Get Wx Details Error`,
  props<{ error: string }>());
