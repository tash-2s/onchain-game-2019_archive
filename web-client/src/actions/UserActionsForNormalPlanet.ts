import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"

import { chains } from "../chain/chains"
import { NormalPlanetController } from "../chain/clients/loom/NormalPlanetController"
import {
  getUserNormalPlanets,
  ReturnTypeOfGetUserNormalPlanets
} from "../chain/clients/loom/organized"

export class UserActionsForNormalPlanet extends AbstractActions {
  private static creator = UserActionsForNormalPlanet.getActionCreator()

  static setPlanetsToMap = UserActionsForNormalPlanet.creator<ReturnTypeOfGetUserNormalPlanets>(
    "setPlanetsToMap"
  )
  setPlanetsToMap = (
    planetId: number,
    axialCoordinates: Array<{ axialCoordinateQ: number; axialCoordinateR: number }>,
    isInitial: boolean
  ) => {
    new AppActions(this.dispatch).withLoading(async () => {
      const controller = new NormalPlanetController(chains.loom)
      if (isInitial) {
        await controller.claimInitialGold()
      }
      await controller.setPlanets(
        planetId,
        axialCoordinates.map(o => o.axialCoordinateQ),
        axialCoordinates.map(o => o.axialCoordinateR)
      )

      const response = await getUserNormalPlanets(loginedAddress())

      this.dispatch(UserActionsForNormalPlanet.setPlanetsToMap(response))
    })
  }

  static rankupUserPlanets = UserActionsForNormalPlanet.creator<ReturnTypeOfGetUserNormalPlanets>(
    "rankupUserPlanets"
  )
  rankupUserPlanets = (arr: Array<{ userNormalPlanetId: string; targetRank: number }>) => {
    new AppActions(this.dispatch).withLoading(async () => {
      await new NormalPlanetController(chains.loom).rankupPlanets(
        arr.map(o => o.userNormalPlanetId),
        arr.map(o => o.targetRank)
      )

      const response = await getUserNormalPlanets(loginedAddress())

      this.dispatch(UserActionsForNormalPlanet.rankupUserPlanets(response))
    })
  }

  static removeUserPlanets = UserActionsForNormalPlanet.creator<ReturnTypeOfGetUserNormalPlanets>(
    "removeUserPlanets"
  )
  removeUserPlanets = (userPlanetIds: Array<string>) => {
    new AppActions(this.dispatch).withLoading(async () => {
      await new NormalPlanetController(chains.loom).removePlanets(userPlanetIds)

      const response = await getUserNormalPlanets(loginedAddress())

      this.dispatch(UserActionsForNormalPlanet.removeUserPlanets(response))
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
