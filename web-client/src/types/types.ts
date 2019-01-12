import { AppState } from "../types/appTypes"
import { CommonState } from "../types/commonTypes"

export interface State {
  common: CommonState
  app: AppState
  routed?: "todo" // This is used for specific container state
}
