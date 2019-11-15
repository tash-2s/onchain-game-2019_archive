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
  const { userPlanetsByCoordinates, userPlanetsBiggestRadius } = userPlanetsAndThierBiggestRadius(
    userNormalPlanets,
    userSpecialPlanets
  )
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

const userPlanetsAndThierBiggestRadius = <T1 extends Coordinates, T2 extends Coordinates>(
  userNormalPlanets: Array<T1>,
  userSpecialPlanets: Array<T2>
) => {
  const userPlanetsByCoordinates: {
    [key: string]: (T1 & { isNormal: true }) | (T2 & { isNormal: false }) | null
  } = {}
  let userPlanetsBiggestRadius = 0

  const tackleBiggestRadius = (up: T1 | T2) => {
    const distance = MapUtil.distanceFromCenter(up.axialCoordinateQ, up.axialCoordinateR)
    if (userPlanetsBiggestRadius < distance) {
      userPlanetsBiggestRadius = distance
    }
  }

  userNormalPlanets.forEach(up => {
    userPlanetsByCoordinates[MapUtil.coordinatesKey(up.axialCoordinateQ, up.axialCoordinateR)] = {
      ...up,
      isNormal: true
    }

    tackleBiggestRadius(up)
  })

  userSpecialPlanets.forEach(up => {
    userPlanetsByCoordinates[MapUtil.coordinatesKey(up.axialCoordinateQ, up.axialCoordinateR)] = {
      ...up,
      isNormal: false
    }

    tackleBiggestRadius(up)
  })

  return { userPlanetsByCoordinates, userPlanetsBiggestRadius }
}
