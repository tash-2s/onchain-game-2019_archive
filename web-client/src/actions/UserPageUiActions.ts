import { AbstractActions } from "./AbstractActions"
import { UserPlanetSortKind, PlanetKindWithAll } from "../constants"

export class UserPageUiActions extends AbstractActions {
  private static creator = UserPageUiActions.getActionCreator()

  static toggleUserPlanetViewKind = UserPageUiActions.creator("toggleUserPlanetViewKind")
  toggleUserPlanetViewKind = () => {
    this.dispatch(UserPageUiActions.toggleUserPlanetViewKind())
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

  static selectUserPlanetKindForUserPlanetList = UserPageUiActions.creator<PlanetKindWithAll>(
    "selectUserPlanetKindForUserPlanetList"
  )
  selectUserPlanetKindForUserPlanetList = (kind: PlanetKindWithAll) => {
    this.dispatch(UserPageUiActions.selectUserPlanetKindForUserPlanetList(kind))
  }

  static selectSortKindForUserPlanetList = UserPageUiActions.creator<UserPlanetSortKind>(
    "selectSortKindForUserPlanetList"
  )
  selectSortKindForUserPlanetList = (kind: UserPlanetSortKind) => {
    this.dispatch(UserPageUiActions.selectSortKindForUserPlanetList(kind))
  }

  static togglePlanetListVisibilityForMobile = UserPageUiActions.creator(
    "togglePlanetListVisibilityForMobile"
  )
  togglePlanetListVisibilityForMobile = () => {
    this.dispatch(UserPageUiActions.togglePlanetListVisibilityForMobile())
  }

  static clear = UserPageUiActions.creator("clear")
  clear = () => {
    this.dispatch(UserPageUiActions.clear())
  }
}
