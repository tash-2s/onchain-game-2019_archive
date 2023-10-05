import { AbstractActions } from "./AbstractActions"

import {
  getUserInGameAsterisks,
  ReturnTypeOfGetUserInGameAsterisks,
  getUserTradableAsterisks,
  ReturnTypeOfGetUserTradableAsterisks
} from "../chain/clients/loom/organized"

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<{
    address: string
    inGame: ReturnTypeOfGetUserInGameAsterisks
    tradable: ReturnTypeOfGetUserTradableAsterisks
  }>("setTargetUser")
  setTargetUser = async (address: string) => {
    const [inGame, tradable] = await Promise.all([
      getUserInGameAsterisks(address),
      getUserTradableAsterisks(address)
    ])

    this.dispatch(
      UserActions.setTargetUser({
        address,
        inGame,
        tradable
      })
    )
  }

  static clearTargetUser = UserActions.creator("clearTargetUser")
  clearTargetUser = () => {
    this.dispatch(UserActions.clearTargetUser())
  }
}
