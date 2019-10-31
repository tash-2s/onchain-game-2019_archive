import { AbstractActions } from "./AbstractActions"
import { UserPageViewKind, UserPlanetSortKind, PlanetKindWithAll } from "../constants"

export class UserPageUIActions extends AbstractActions {
  private static creator = UserPageUIActions.getActionCreator()

  static selectViewKind = UserPageUIActions.creator<UserPageViewKind>("selectViewKind")
  selectViewKind = (kind: UserPageViewKind) => {
    this.dispatch(UserPageUIActions.selectViewKind(kind))
  }

  static toggleUserPlanetViewKind = UserPageUIActions.creator("toggleUserPlanetViewKind")
  toggleUserPlanetViewKind = () => {
    this.dispatch(UserPageUIActions.toggleUserPlanetViewKind())
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

  static selectPlanetKind = UserPageUIActions.creator<PlanetKindWithAll>("selectPlanetKind")
  selectPlanetKind = (kind: PlanetKindWithAll) => {
    this.dispatch(UserPageUIActions.selectPlanetKind(kind))
  }

  static selectUserPlanetSortKind = UserPageUIActions.creator<UserPlanetSortKind>(
    "selectUserPlanetSortKind"
  )
  selectUserPlanetSortKind = (kind: UserPlanetSortKind) => {
    this.dispatch(UserPageUIActions.selectUserPlanetSortKind(kind))
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
}
