import { AbstractActions } from "./AbstractActions"
import { UiState } from "../types/uiTypes"

export class UserPageUiActions extends AbstractActions {
  private static creator = UserPageUiActions.getActionCreator()

  static selectUserPlanetsTab = UserPageUiActions.creator<
    UiState["userPage"]["selectedUserPlanetsTab"]
  >("selectUserPlanetsTab")
  selectUserPlanetsTab = (tab: UiState["userPage"]["selectedUserPlanetsTab"]) => {
    this.dispatch(UserPageUiActions.selectUserPlanetsTab(tab))
  }

  static selectPlanet = UserPageUiActions.creator<number>("selectPlanet")
  selectPlanet = (planetId: number) => {
    this.dispatch(UserPageUiActions.selectPlanet(planetId))
  }
}
