import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"

import { chains } from "../chain/chains"
import { InGameAsteriskController } from "../chain/clients/loom/InGameAsteriskController"
import {
  getUserInGameAsterisks,
  ReturnTypeOfGetUserInGameAsterisks
} from "../chain/clients/loom/organized"

export class UserActionsForInGameAsterisk extends AbstractActions {
  private static creator = UserActionsForInGameAsterisk.getActionCreator()

  static setAsterisksToMap = UserActionsForInGameAsterisk.creator<ReturnTypeOfGetUserInGameAsterisks>(
    "setAsterisksToMap"
  )
  setAsterisksToMap = (
    asteriskId: number,
    axialCoordinates: Array<{ axialCoordinateQ: number; axialCoordinateR: number }>,
    isInitial: boolean
  ) => {
    new AppActions(this.dispatch).withLoading(async () => {
      const controller = new InGameAsteriskController(chains.loom)
      if (isInitial) {
        await controller.claimInitialGold()
      }
      await controller.setAsterisks(
        asteriskId,
        axialCoordinates.map(o => o.axialCoordinateQ),
        axialCoordinates.map(o => o.axialCoordinateR)
      )

      const response = await getUserInGameAsterisks(loginedAddress())

      this.dispatch(UserActionsForInGameAsterisk.setAsterisksToMap(response))
    })
  }

  static rankupUserAsterisks = UserActionsForInGameAsterisk.creator<ReturnTypeOfGetUserInGameAsterisks>(
    "rankupUserAsterisks"
  )
  rankupUserAsterisks = (arr: Array<{ userInGameAsteriskId: string; targetRank: number }>) => {
    new AppActions(this.dispatch).withLoading(async () => {
      await new InGameAsteriskController(chains.loom).rankupAsterisks(
        arr.map(o => o.userInGameAsteriskId),
        arr.map(o => o.targetRank)
      )

      const response = await getUserInGameAsterisks(loginedAddress())

      this.dispatch(UserActionsForInGameAsterisk.rankupUserAsterisks(response))
    })
  }

  static removeUserAsterisks = UserActionsForInGameAsterisk.creator<ReturnTypeOfGetUserInGameAsterisks>(
    "removeUserAsterisks"
  )
  removeUserAsterisks = (userAsteriskIds: Array<string>) => {
    new AppActions(this.dispatch).withLoading(async () => {
      await new InGameAsteriskController(chains.loom).removeAsterisks(userAsteriskIds)

      const response = await getUserInGameAsterisks(loginedAddress())

      this.dispatch(UserActionsForInGameAsterisk.removeUserAsterisks(response))
    })
  }
}

const loginedAddress = () => {
  const address = chains.loom.address
  if (!address) {
    throw new Error("must login")
  }
  return address
}
