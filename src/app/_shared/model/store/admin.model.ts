import { Hunt } from "@model";

export interface AdminState {
  hunt: Hunt;
  loading: boolean;
}

export const initialAdminState: AdminState = {
  hunt: {} as Hunt,
  loading: false
};
