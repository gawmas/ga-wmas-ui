import { Hunt } from "@model";

export interface AdminState {
  hunt: Hunt | null;
  loading: boolean;
}

export const initialAdminState: AdminState = {
  hunt: null,
  loading: false
};
