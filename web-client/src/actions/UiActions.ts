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

  static changePlanetListVisibility = UserPageUiActions.creator<boolean>(
    "changePlanetListVisibility"
  )
  changePlanetListVisibility = (visibility: boolean) => {
    this.dispatch(UserPageUiActions.changePlanetListVisibility(visibility))
  }

  static selectPlanet = UserPageUiActions.creator<number>("selectPlanet")
  selectPlanet = (planetId: number) => {
    this.dispatch(UserPageUiActions.selectPlanet(planetId))
  }

  static unselectPlanet = UserPageUiActions.creator("unselectPlanet")
  unselectPlanet = () => {
    this.dispatch(UserPageUiActions.unselectPlanet())
  }

  static selectUserPlanet = UserPageUiActions.creator<string>("selectUserPlanet")
  selectUserPlanet = (userPlanetId: string) => {
    this.dispatch(UserPageUiActions.selectUserPlanet(userPlanetId))
  }

  static unselectUserPlanet = UserPageUiActions.creator("unselectUserPlanet")
  unselectUserPlanet = () => {
    this.dispatch(UserPageUiActions.unselectUserPlanet())
  }

  static clear = UserPageUiActions.creator("clear")
  clear = () => {
    this.dispatch(UserPageUiActions.clear())
  }
}
