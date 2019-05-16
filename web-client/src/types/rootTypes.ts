import { CommonState } from "../types/commonTypes"
import { AppState } from "../types/appTypes"
import { UiState } from "../types/uiTypes"
import { UserState } from "../types/routed/userTypes"
import { UsersState } from "../types/routed/usersTypes"

export interface RootState {
  common: CommonState
  app: AppState
  ui: UiState
  routed: { user: UserState; users: UsersState }
}
