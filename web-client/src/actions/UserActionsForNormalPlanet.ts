import { AbstractActions } from "./AbstractActions"

import { chains } from "../misc/chains"
import { NormalPlanetController } from "../chain/clients/loom/NormalPlanetController"
import {
  getUserNormalPlanets,
  ReturnTypeOfGetUserNormalPlanets
} from "../chain/clients/loom/organized"

export class UserActionsForNormalPlanet extends AbstractActions {
  private static creator = UserActionsForNormalPlanet.getActionCreator()

  static setPlanetToMap = UserActionsForNormalPlanet.creator<ReturnTypeOfGetUserNormalPlanets>(
    "setPlanetToMap"
  )
  setPlanetToMap = (planetId: number, axialCoordinateQ: number, axialCoordinateR: number) => {
    this.withLoading(async () => {
      await NormalPlanetController.setPlanet(planetId, axialCoordinateQ, axialCoordinateR)

      const response = await getUserNormalPlanets(loginedAddress())

      this.dispatch(UserActionsForNormalPlanet.setPlanetToMap(response))
    })
  }

  static rankupUserPlanet = UserActionsForNormalPlanet.creator<ReturnTypeOfGetUserNormalPlanets>(
    "rankupUserPlanet"
  )
  rankupUserPlanet = (userPlanetId: string, targetRank: number) => {
    this.withLoading(async () => {
      await NormalPlanetController.rankupPlanet(userPlanetId, targetRank)

      const response = await getUserNormalPlanets(loginedAddress())

      this.dispatch(UserActionsForNormalPlanet.rankupUserPlanet(response))
    })
  }

  static removeUserPlanet = UserActionsForNormalPlanet.creator<ReturnTypeOfGetUserNormalPlanets>(
    "removeUserPlanet"
  )
  removeUserPlanet = (userPlanetId: string) => {
    this.withLoading(async () => {
      await NormalPlanetController.removePlanet(userPlanetId)

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
