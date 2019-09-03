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

  static selectPlanetKind = UserPageUiActions.creator<PlanetKindWithAll>("selectPlanetKind")
  selectPlanetKind = (kind: PlanetKindWithAll) => {
    this.dispatch(UserPageUiActions.selectPlanetKind(kind))
  }

  static selectUserPlanetSortKind = UserPageUiActions.creator<UserPlanetSortKind>(
    "selectUserPlanetSortKind"
  )
  selectUserPlanetSortKind = (kind: UserPlanetSortKind) => {
    this.dispatch(UserPageUiActions.selectUserPlanetSortKind(kind))
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

  static selectSpecialPlanetTokenForSet = UserPageUiActions.creator<string>(
    "selectSpecialPlanetTokenForSet"
  )
  selectSpecialPlanetTokenForSet = (tokenId: string) => {
    this.dispatch(UserPageUiActions.selectSpecialPlanetTokenForSet(tokenId))
  }

  static unselectSpecialPlanetTokenForSet = UserPageUiActions.creator(
    "unselectSpecialPlanetTokenForSet"
  )
  unselectSpecialPlanetTokenForSet = () => {
    this.dispatch(UserPageUiActions.unselectSpecialPlanetTokenForSet())
  }

  static selectUserSpecialPlanetForModal = UserPageUiActions.creator<string>(
    "selectUserSpecialPlanetForModal"
  )
  selectUserSpecialPlanetForModal = (userSpecialPlanetId: string) => {
    this.dispatch(UserPageUiActions.selectUserSpecialPlanetForModal(userSpecialPlanetId))
  }

  static unselectUserSpecialPlanetForModal = UserPageUiActions.creator(
    "unselectUserSpecialPlanetForModal"
  )
  unselectUserSpecialPlanetForModal = () => {
    this.dispatch(UserPageUiActions.unselectUserSpecialPlanetForModal())
  }
}
