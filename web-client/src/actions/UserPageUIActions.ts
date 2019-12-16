import { AbstractActions } from "./AbstractActions"
import { UserPageViewKind, UserPlanetsSortKind, PlanetKindWithAll } from "../constants"

export class UserPageUIActions extends AbstractActions {
  private static creator = UserPageUIActions.getActionCreator()

  static selectPageViewKind = UserPageUIActions.creator<UserPageViewKind>("selectPageViewKind")
  selectPageViewKind = (kind: UserPageViewKind) => {
    this.dispatch(UserPageUIActions.selectPageViewKind(kind))
  }

  static toggleUserPlanetsViewKind = UserPageUIActions.creator("toggleUserPlanetsViewKind")
  toggleUserPlanetsViewKind = () => {
    this.dispatch(UserPageUIActions.toggleUserPlanetsViewKind())
  }

  static selectNormalPlanetForSet = UserPageUIActions.creator<number>("selectNormalPlanetForSet")
  selectNormalPlanetForSet = (planetId: number) => {
    this.dispatch(UserPageUIActions.selectNormalPlanetForSet(planetId))
  }

  static unselectNormalPlanetForSet = UserPageUIActions.creator("unselectNormalPlanetForSet")
  unselectNormalPlanetForSet = () => {
    this.dispatch(UserPageUIActions.unselectNormalPlanetForSet())
  }

  static selectUserNormalPlanetForModal = UserPageUIActions.creator<string>(
    "selectUserNormalPlanetForModal"
  )
  selectUserNormalPlanetForModal = (userPlanetId: string) => {
    this.dispatch(UserPageUIActions.selectUserNormalPlanetForModal(userPlanetId))
  }

  static unselectUserNormalPlanetForModal = UserPageUIActions.creator(
    "unselectUserNormalPlanetForModal"
  )
  unselectUserNormalPlanetForModal = () => {
    this.dispatch(UserPageUIActions.unselectUserNormalPlanetForModal())
  }

  static selectPlanetKindForUserPlanetList = UserPageUIActions.creator<PlanetKindWithAll>(
    "selectPlanetKindForUserPlanetList"
  )
  selectPlanetKindForUserPlanetList = (kind: PlanetKindWithAll) => {
    this.dispatch(UserPageUIActions.selectPlanetKindForUserPlanetList(kind))
  }

  static selectSortKindForUserPlanetList = UserPageUIActions.creator<UserPlanetsSortKind>(
    "selectSortKindForUserPlanetList"
  )
  selectSortKindForUserPlanetList = (kind: UserPlanetsSortKind) => {
    this.dispatch(UserPageUIActions.selectSortKindForUserPlanetList(kind))
  }

  static togglePlanetListVisibilityForMobile = UserPageUIActions.creator(
    "togglePlanetListVisibilityForMobile"
  )
  togglePlanetListVisibilityForMobile = () => {
    this.dispatch(UserPageUIActions.togglePlanetListVisibilityForMobile())
  }

  static clear = UserPageUIActions.creator("clear")
  clear = () => {
    this.dispatch(UserPageUIActions.clear())
  }

  static selectSpecialPlanetTokenForSet = UserPageUIActions.creator<string>(
    "selectSpecialPlanetTokenForSet"
  )
  selectSpecialPlanetTokenForSet = (tokenId: string) => {
    this.dispatch(UserPageUIActions.selectSpecialPlanetTokenForSet(tokenId))
  }

  static unselectSpecialPlanetTokenForSet = UserPageUIActions.creator(
    "unselectSpecialPlanetTokenForSet"
  )
  unselectSpecialPlanetTokenForSet = () => {
    this.dispatch(UserPageUIActions.unselectSpecialPlanetTokenForSet())
  }

  static selectUserSpecialPlanetForModal = UserPageUIActions.creator<string>(
    "selectUserSpecialPlanetForModal"
  )
  selectUserSpecialPlanetForModal = (userSpecialPlanetId: string) => {
    this.dispatch(UserPageUIActions.selectUserSpecialPlanetForModal(userSpecialPlanetId))
  }

  static unselectUserSpecialPlanetForModal = UserPageUIActions.creator(
    "unselectUserSpecialPlanetForModal"
  )
  unselectUserSpecialPlanetForModal = () => {
    this.dispatch(UserPageUIActions.unselectUserSpecialPlanetForModal())
  }

  static selectPlanetHexForSet = UserPageUIActions.creator<{
    axialCoordinateQ: number
    axialCoordinateR: number
  }>("selectPlanetHexForSet")
  selectPlanetHexForSet = (axialCoordinateQ: number, axialCoordinateR: number) => {
    this.dispatch(UserPageUIActions.selectPlanetHexForSet({ axialCoordinateQ, axialCoordinateR }))
  }

  static unselectPlanetHexesForSet = UserPageUIActions.creator("unselectPlanetHexesForSet")
  unselectPlanetHexesForSet = () => {
    this.dispatch(UserPageUIActions.unselectPlanetHexesForSet())
  }

  static startSelectingUserNormalPlanetForRemoval = UserPageUIActions.creator(
    "startSelectingUserNormalPlanetForRemoval"
  )
  startSelectingUserNormalPlanetForRemoval = () => {
    this.dispatch(UserPageUIActions.startSelectingUserNormalPlanetForRemoval())
  }

  static selectUserNormalPlanetForRemoval = UserPageUIActions.creator<string>(
    "selectUserNormalPlanetForRemoval"
  )
  selectUserNormalPlanetForRemoval = (userPlanetId: string) => {
    this.dispatch(UserPageUIActions.selectUserNormalPlanetForRemoval(userPlanetId))
  }

  static endSelectingUserNormalPlanetForRemoval = UserPageUIActions.creator(
    "endSelectingUserNormalPlanetForRemoval"
  )
  endSelectingUserNormalPlanetForRemoval = () => {
    this.dispatch(UserPageUIActions.endSelectingUserNormalPlanetForRemoval())
  }
}
