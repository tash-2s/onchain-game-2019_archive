import BN from "bn.js"

import { UserPlanetsMapUtil } from "../models/UserPlanetsMapUtil"

interface Coordinates {
  axialCoordinateQ: number
  axialCoordinateR: number
}

export const computeMap = <T1 extends Coordinates, T2 extends Coordinates>(
  gold: BN,
  userNormalPlanets: Array<T1>,
  userSpecialPlanets: Array<T2>
) => {
  const usableRadius = UserPlanetsMapUtil.mapRadiusFromGold(gold)
  const {
    userPlanetsByCoordinates,
    userPlanetsBiggestRadius
  } = UserPlanetsMapUtil.userPlanetsAndThierBiggestRadius(userNormalPlanets, userSpecialPlanets)
  const shownRadius = Math.max(userPlanetsBiggestRadius, usableRadius)
  const hexes = UserPlanetsMapUtil.hexesFromMapRadius(shownRadius).map(h => {
    const q = h[0]
    const r = h[1]
    const userPlanet = userPlanetsByCoordinates[UserPlanetsMapUtil.coordinatesKey(q, r)]
    return { q, r, userPlanet }
  })
  const requiredGoldForNextRadius = UserPlanetsMapUtil.requiredGoldFromMapRadius(usableRadius + 1)

  return {
    usableRadius,
    shownRadius,
    hexes,
    requiredGoldForNextRadius
  }
}
