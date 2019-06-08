import { AbstractActions } from "./AbstractActions"
import { UiState } from "../types/uiTypes"

export class UserPageUiActions extends AbstractActions {
  private static creator = UserPageUiActions.getActionCreator()

  static selectUserPlanetViewType = UserPageUiActions.creator<
    UiState["userPage"]["selectedUserPlanetViewType"]
  >("selectUserPlanetViewType")
  selectUserPlanetViewType = (type: UiState["userPage"]["selectedUserPlanetViewType"]) => {
    this.dispatch(UserPageUiActions.selectUserPlanetViewType(type))
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

  static selectUserPlanetKindForUserPlanetList = UserPageUiActions.creator<
    UiState["userPage"]["selectedUserPlanetKindForUserPlanetList"]
  >("selectUserPlanetKindForUserPlanetList")
  selectUserPlanetKindForUserPlanetList = (
    kind: UiState["userPage"]["selectedUserPlanetKindForUserPlanetList"]
  ) => {
    this.dispatch(UserPageUiActions.selectUserPlanetKindForUserPlanetList(kind))
  }

  static selectSortKindForUserPlanetList = UserPageUiActions.creator<
    UiState["userPage"]["selectedSortKindForUserPlanetList"]
  >("selectSortKindForUserPlanetList")
  selectSortKindForUserPlanetList = (
    kind: UiState["userPage"]["selectedSortKindForUserPlanetList"]
  ) => {
    this.dispatch(UserPageUiActions.selectSortKindForUserPlanetList(kind))
  }

  static togglePlanetListVisibility = UserPageUiActions.creator("togglePlanetListVisibility")
  togglePlanetListVisibility = () => {
    this.dispatch(UserPageUiActions.togglePlanetListVisibility())
  }

  static clear = UserPageUiActions.creator("clear")
  clear = () => {
    this.dispatch(UserPageUiActions.clear())
  }
}

export class CommonUiActions extends AbstractActions {
  private static creator = CommonUiActions.getActionCreator()

  static toggleNavbarMenuOnMobile = CommonUiActions.creator("toggleNavbarMenuOnMobile")
  toggleNavbarMenuOnMobile = () => {
    this.dispatch(CommonUiActions.toggleNavbarMenuOnMobile())
  }
}
