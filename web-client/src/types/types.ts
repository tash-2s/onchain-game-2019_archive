import { CommonState } from "../types/commonTypes"
import { AppState } from "../types/appTypes"
import { UserState } from "../types/routed/userTypes"

export interface State {
  common: CommonState
  app: AppState
  routed: { user: UserState } // This is used for specific container state
}
