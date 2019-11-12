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
    axialCoordinates: Array<{ axialCoordinateQ: number; axialCoordinateR: number }>
  ) => {
    this.withLoading(async () => {
      await new NormalPlanetController(chains.loom).setPlanets(
        planetId,
        axialCoordinates.map(o => o.axialCoordinateQ),
        axialCoordinates.map(o => o.axialCoordinateR)
      )

      const response = await getUserNormalPlanets(loginedAddress())

      this.dispatch(UserActionsForNormalPlanet.setPlanetsToMap(response))
    })
  }

  static rankupUserPlanet = UserActionsForNormalPlanet.creator<ReturnTypeOfGetUserNormalPlanets>(
    "rankupUserPlanet"
  )
  rankupUserPlanet = (userPlanetId: string, targetRank: number) => {
    this.withLoading(async () => {
      await new NormalPlanetController(chains.loom).rankupPlanet(userPlanetId, targetRank)

      const response = await getUserNormalPlanets(loginedAddress())

      this.dispatch(UserActionsForNormalPlanet.rankupUserPlanet(response))
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

      // TODO: When I send a heavy tx, this is needed for some reason.
      // FIXME: This doen't work...
      // await sleep(1)
      // await chains.loom.reconnect(chains.eth.signer())

      const response = await getUserNormalPlanets(loginedAddress())

      this.dispatch(UserActionsForNormalPlanet.rankupUserPlanets(response))
    })
  }

  static removeUserPlanet = UserActionsForNormalPlanet.creator<ReturnTypeOfGetUserNormalPlanets>(
    "removeUserPlanet"
  )
  removeUserPlanet = (userPlanetId: string) => {
    this.withLoading(async () => {
      await new NormalPlanetController(chains.loom).removePlanet(userPlanetId)

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

const sleep = (sec: number) =>
  new Promise(resolve => {
    setTimeout(resolve, sec * 1000)
  })
