import { AbstractActions } from "./AbstractActions"
import { getUserAndUserNormalPlanets, UserAndUserNormalPlanetsResponse } from "./UserActions"

import { chains } from "../misc/chains"

export class UserActionsForNormalPlanet extends AbstractActions {
  private static creator = UserActionsForNormalPlanet.getActionCreator()

  static setPlanetToMap = UserActionsForNormalPlanet.creator<UserAndUserNormalPlanetsResponse>(
    "setPlanetToMap"
  )
  setPlanetToMap = (planetId: number, axialCoordinateQ: number, axialCoordinateR: number) => {
    this.withLoading(async () => {
      await chains.loom
        .normalPlanetController()
        .methods.setPlanet(planetId, axialCoordinateQ, axialCoordinateR)
        .send()

      const response = await getUserAndUserNormalPlanets(loginedAddress())

      this.dispatch(UserActionsForNormalPlanet.setPlanetToMap(response))
    })
  }

  static rankupUserPlanet = UserActionsForNormalPlanet.creator<UserAndUserNormalPlanetsResponse>(
    "rankupUserPlanet"
  )
  rankupUserPlanet = (userPlanetId: string, targetRank: number) => {
    this.withLoading(async () => {
      await chains.loom
        .normalPlanetController()
        .methods.rankupPlanet(userPlanetId, targetRank)
        .send()

      const response = await getUserAndUserNormalPlanets(loginedAddress())

      this.dispatch(UserActionsForNormalPlanet.rankupUserPlanet(response))
    })
  }

  static removeUserPlanet = UserActionsForNormalPlanet.creator<UserAndUserNormalPlanetsResponse>(
    "removeUserPlanet"
  )
  removeUserPlanet = (userPlanetId: string) => {
    this.withLoading(async () => {
      await chains.loom
        .normalPlanetController()
        .methods.removePlanet(userPlanetId)
        .send()

      const response = await getUserAndUserNormalPlanets(loginedAddress())

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
