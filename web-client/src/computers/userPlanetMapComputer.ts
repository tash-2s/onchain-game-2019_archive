import BN from "bn.js"

import { UserPlanetMapUtil } from "../models/UserPlanetMapUtil"

interface Coordinates {
  axialCoordinateQ: number
  axialCoordinateR: number
}

export const computeUserPlanetMap = <T1 extends Coordinates, T2 extends Coordinates>(
  gold: BN,
  userNormalPlanets: Array<T1>,
  userSpecialPlanets: Array<T2>
) => {
  const usableRadius = UserPlanetMapUtil.mapRadiusFromGold(gold)
  const { userPlanetsByCoordinates, userPlanetsBiggestRadius } = userPlanetsAndThierBiggestRadius(
    userNormalPlanets,
    userSpecialPlanets
  )
  const shownRadius = Math.max(userPlanetsBiggestRadius, usableRadius)
  const hexes = UserPlanetMapUtil.hexesFromMapRadius(shownRadius).map(h => {
    const q = h[0]
    const r = h[1]
    const userPlanet = userPlanetsByCoordinates[UserPlanetMapUtil.coordinatesKey(q, r)]
    return { q, r, userPlanet }
  })
  const requiredGoldForNextRadius = UserPlanetMapUtil.requiredGoldFromMapRadius(usableRadius + 1)

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
    const distance = UserPlanetMapUtil.distanceFromCenter(up.axialCoordinateQ, up.axialCoordinateR)
    if (userPlanetsBiggestRadius < distance) {
      userPlanetsBiggestRadius = distance
    }
  }

  userNormalPlanets.forEach(up => {
    userPlanetsByCoordinates[
      UserPlanetMapUtil.coordinatesKey(up.axialCoordinateQ, up.axialCoordinateR)
    ] = {
      ...up,
      isNormal: true
    }

    tackleBiggestRadius(up)
  })

  userSpecialPlanets.forEach(up => {
    userPlanetsByCoordinates[
      UserPlanetMapUtil.coordinatesKey(up.axialCoordinateQ, up.axialCoordinateR)
    ] = {
      ...up,
      isNormal: false
    }

    tackleBiggestRadius(up)
  })

  return { userPlanetsByCoordinates, userPlanetsBiggestRadius }
}
