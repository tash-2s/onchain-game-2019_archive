import { AbstractActions } from "./AbstractActions"

import {
  getUserNormalPlanets,
  ReturnTypeOfGetUserNormalPlanets,
  getUserSpecialPlanets,
  ReturnTypeOfGetUserSpecialPlanets
} from "../chain/clients/loom/organized"

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<{
    address: string
    normal: ReturnTypeOfGetUserNormalPlanets
    special: ReturnTypeOfGetUserSpecialPlanets
  }>("setTargetUser")
  setTargetUser = async (address: string) => {
    const [normal, special] = await Promise.all([
      getUserNormalPlanets(address),
      getUserSpecialPlanets(address)
    ])

    this.dispatch(
      UserActions.setTargetUser({
        address,
        normal,
        special
      })
    )
  }

  static clearTargetUser = UserActions.creator("clearTargetUser")
  clearTargetUser = () => {
    this.dispatch(UserActions.clearTargetUser())
  }
}
