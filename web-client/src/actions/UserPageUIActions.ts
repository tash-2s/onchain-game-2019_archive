import { AbstractActions } from "./AbstractActions"

import { UserPageViewKind, UserAsterisksSortKind, AsteriskKindWithAll } from "../constants"

export class UserPageUIActions extends AbstractActions {
  private static creator = UserPageUIActions.getActionCreator()

  static selectPageViewKind = UserPageUIActions.creator<UserPageViewKind>("selectPageViewKind")
  selectPageViewKind = (kind: UserPageViewKind) => {
    this.dispatch(UserPageUIActions.selectPageViewKind(kind))
  }

  static toggleUserAsterisksViewKind = UserPageUIActions.creator("toggleUserAsterisksViewKind")
  toggleUserAsterisksViewKind = () => {
    this.dispatch(UserPageUIActions.toggleUserAsterisksViewKind())
  }

  static selectInGameAsteriskForSet = UserPageUIActions.creator<number>(
    "selectInGameAsteriskForSet"
  )
  selectInGameAsteriskForSet = (asteriskId: number) => {
    this.dispatch(UserPageUIActions.selectInGameAsteriskForSet(asteriskId))
  }

  static unselectInGameAsteriskForSet = UserPageUIActions.creator("unselectInGameAsteriskForSet")
  unselectInGameAsteriskForSet = () => {
    this.dispatch(UserPageUIActions.unselectInGameAsteriskForSet())
  }

  static selectUserInGameAsteriskForModal = UserPageUIActions.creator<string>(
    "selectUserInGameAsteriskForModal"
  )
  selectUserInGameAsteriskForModal = (userAsteriskId: string) => {
    this.dispatch(UserPageUIActions.selectUserInGameAsteriskForModal(userAsteriskId))
  }

  static unselectUserInGameAsteriskForModal = UserPageUIActions.creator(
    "unselectUserInGameAsteriskForModal"
  )
  unselectUserInGameAsteriskForModal = () => {
    this.dispatch(UserPageUIActions.unselectUserInGameAsteriskForModal())
  }

  static selectAsteriskKindForUserAsteriskList = UserPageUIActions.creator<AsteriskKindWithAll>(
    "selectAsteriskKindForUserAsteriskList"
  )
  selectAsteriskKindForUserAsteriskList = (kind: AsteriskKindWithAll) => {
    this.dispatch(UserPageUIActions.selectAsteriskKindForUserAsteriskList(kind))
  }

  static selectSortKindForUserAsteriskList = UserPageUIActions.creator<UserAsterisksSortKind>(
    "selectSortKindForUserAsteriskList"
  )
  selectSortKindForUserAsteriskList = (kind: UserAsterisksSortKind) => {
    this.dispatch(UserPageUIActions.selectSortKindForUserAsteriskList(kind))
  }

  static toggleAsteriskListVisibilityForMobile = UserPageUIActions.creator(
    "toggleAsteriskListVisibilityForMobile"
  )
  toggleAsteriskListVisibilityForMobile = () => {
    this.dispatch(UserPageUIActions.toggleAsteriskListVisibilityForMobile())
  }

  static clear = UserPageUIActions.creator("clear")
  clear = () => {
    this.dispatch(UserPageUIActions.clear())
  }

  static selectTradableAsteriskTokenForSet = UserPageUIActions.creator<string>(
    "selectTradableAsteriskTokenForSet"
  )
  selectTradableAsteriskTokenForSet = (tokenId: string) => {
    this.dispatch(UserPageUIActions.selectTradableAsteriskTokenForSet(tokenId))
  }

  static unselectTradableAsteriskTokenForSet = UserPageUIActions.creator(
    "unselectTradableAsteriskTokenForSet"
  )
  unselectTradableAsteriskTokenForSet = () => {
    this.dispatch(UserPageUIActions.unselectTradableAsteriskTokenForSet())
  }

  static selectUserTradableAsteriskForModal = UserPageUIActions.creator<string>(
    "selectUserTradableAsteriskForModal"
  )
  selectUserTradableAsteriskForModal = (userTradableAsteriskId: string) => {
    this.dispatch(UserPageUIActions.selectUserTradableAsteriskForModal(userTradableAsteriskId))
  }

  static unselectUserTradableAsteriskForModal = UserPageUIActions.creator(
    "unselectUserTradableAsteriskForModal"
  )
  unselectUserTradableAsteriskForModal = () => {
    this.dispatch(UserPageUIActions.unselectUserTradableAsteriskForModal())
  }

  static selectAsteriskHexForSet = UserPageUIActions.creator<{
    axialCoordinateQ: number
    axialCoordinateR: number
  }>("selectAsteriskHexForSet")
  selectAsteriskHexForSet = (axialCoordinateQ: number, axialCoordinateR: number) => {
    this.dispatch(UserPageUIActions.selectAsteriskHexForSet({ axialCoordinateQ, axialCoordinateR }))
  }

  static unselectAsteriskHexesForSet = UserPageUIActions.creator("unselectAsteriskHexesForSet")
  unselectAsteriskHexesForSet = () => {
    this.dispatch(UserPageUIActions.unselectAsteriskHexesForSet())
  }

  static startSelectingUserInGameAsteriskForRemoval = UserPageUIActions.creator(
    "startSelectingUserInGameAsteriskForRemoval"
  )
  startSelectingUserInGameAsteriskForRemoval = () => {
    this.dispatch(UserPageUIActions.startSelectingUserInGameAsteriskForRemoval())
  }

  static selectUserInGameAsteriskForRemoval = UserPageUIActions.creator<string>(
    "selectUserInGameAsteriskForRemoval"
  )
  selectUserInGameAsteriskForRemoval = (userAsteriskId: string) => {
    this.dispatch(UserPageUIActions.selectUserInGameAsteriskForRemoval(userAsteriskId))
  }

  static endSelectingUserInGameAsteriskForRemoval = UserPageUIActions.creator(
    "endSelectingUserInGameAsteriskForRemoval"
  )
  endSelectingUserInGameAsteriskForRemoval = () => {
    this.dispatch(UserPageUIActions.endSelectingUserInGameAsteriskForRemoval())
  }
}
