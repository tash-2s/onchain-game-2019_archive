import BN from "bn.js"

import { UserPlanetsMapUtil } from "../models/UserPlanetsMapUtil"

export const computeMap = <T extends { axialCoordinateQ: number; axialCoordinateR: number }>(
  gold: BN,
  userPlanets: Array<T>
) => {
  const usableRadius = UserPlanetsMapUtil.mapRadiusFromGold(gold)
  const {
    userPlanetsByCoordinates,
    userPlanetsBiggestRadius
  } = UserPlanetsMapUtil.userPlanetsAndThierBiggestRadius(userPlanets)
  const shownRadius = Math.max(userPlanetsBiggestRadius, usableRadius)
  const hexes = UserPlanetsMapUtil.hexesFromMapRadius(shownRadius).map(h => {
    const q = h[0]
    const r = h[1]
    const userPlanet = userPlanetsByCoordinates[UserPlanetsMapUtil.coordinatesKey(q, r)]
    const settable = UserPlanetsMapUtil.distanceFromCenter(q, r) <= usableRadius
    return { q, r, userPlanet, settable }
  })

  return {
    usableRadius,
    shownRadius,
    hexes
  }
}
