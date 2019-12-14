import { AbstractActions } from "./AbstractActions"

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
    this.withLoading(async () => {
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
    this.withLoading(async () => {
      await new NormalPlanetController(chains.loom).rankupPlanets(
        arr.map(o => o.userNormalPlanetId),
        arr.map(o => o.targetRank)
      )

      const response = await getUserNormalPlanets(loginedAddress())

      this.dispatch(UserActionsForNormalPlanet.rankupUserPlanets(response))
    })
  }

  static removeUserPlanet = UserActionsForNormalPlanet.creator<ReturnTypeOfGetUserNormalPlanets>(
    "removeUserPlanet"
  )
  removeUserPlanet = (userPlanetId: string) => {
    this.withLoading(async () => {
      await new NormalPlanetController(chains.loom).removePlanets([userPlanetId])

      const response = await getUserNormalPlanets(loginedAddress())

      this.dispatch(UserActionsForNormalPlanet.removeUserPlanet(response))
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
