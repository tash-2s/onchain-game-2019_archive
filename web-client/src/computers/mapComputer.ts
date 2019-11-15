import BN from "bn.js"

import { MapUtil } from "../models/MapUtil"

interface Coordinates {
  axialCoordinateQ: number
  axialCoordinateR: number
}

export const computeMap = <T1 extends Coordinates, T2 extends Coordinates>(
  gold: BN,
  userNormalPlanets: Array<T1>,
  userSpecialPlanets: Array<T2>
) => {
  const usableRadius = MapUtil.mapRadiusFromGold(gold)
  const {
    userPlanetsByCoordinates,
    userPlanetsBiggestRadius
  } = MapUtil.userPlanetsAndThierBiggestRadius(userNormalPlanets, userSpecialPlanets)
  const shownRadius = Math.max(userPlanetsBiggestRadius, usableRadius)
  const hexes = MapUtil.hexesFromMapRadius(shownRadius).map(h => {
    const q = h[0]
    const r = h[1]
    const userPlanet = userPlanetsByCoordinates[MapUtil.coordinatesKey(q, r)]
    return { q, r, userPlanet }
  })
  const requiredGoldForNextRadius = MapUtil.requiredGoldFromMapRadius(usableRadius + 1)

  return {
    usableRadius,
    shownRadius,
    hexes,
    requiredGoldForNextRadius
  }
}
