import BN from "bn.js"

import { UserAsteriskMapUtil } from "../models/UserAsteriskMapUtil"

interface Coordinates {
  axialCoordinateQ: number
  axialCoordinateR: number
}

export const computeUserAsteriskMap = <T1 extends Coordinates, T2 extends Coordinates>(
  gold: BN,
  userInGameAsterisks: Array<T1>,
  userTradableAsterisks: Array<T2>
) => {
  const usableRadius = UserAsteriskMapUtil.mapRadiusFromGold(gold)
  const { userAsterisksByCoordinates, userAsterisksBiggestRadius } = userAsterisksAndThierBiggestRadius(
    userInGameAsterisks,
    userTradableAsterisks
  )
  const shownRadius = Math.max(userAsterisksBiggestRadius, usableRadius)
  const hexes = UserAsteriskMapUtil.hexesFromMapRadius(shownRadius).map(h => {
    const q = h[0]
    const r = h[1]
    const userAsterisk = userAsterisksByCoordinates[UserAsteriskMapUtil.coordinatesKey(q, r)]
    return { q, r, userAsterisk }
  })
  const requiredGoldForNextRadius = UserAsteriskMapUtil.requiredGoldFromMapRadius(usableRadius + 1)

  return {
    usableRadius,
    shownRadius,
    hexes,
    requiredGoldForNextRadius
  }
}

const userAsterisksAndThierBiggestRadius = <T1 extends Coordinates, T2 extends Coordinates>(
  userInGameAsterisks: Array<T1>,
  userTradableAsterisks: Array<T2>
) => {
  const userAsterisksByCoordinates: {
    [key: string]: (T1 & { isInGame: true }) | (T2 & { isInGame: false }) | null
  } = {}
  let userAsterisksBiggestRadius = 0

  const tackleBiggestRadius = (up: T1 | T2) => {
    const distance = UserAsteriskMapUtil.distanceFromCenter(up.axialCoordinateQ, up.axialCoordinateR)
    if (userAsterisksBiggestRadius < distance) {
      userAsterisksBiggestRadius = distance
    }
  }

  userInGameAsterisks.forEach(up => {
    userAsterisksByCoordinates[
      UserAsteriskMapUtil.coordinatesKey(up.axialCoordinateQ, up.axialCoordinateR)
    ] = {
      ...up,
      isInGame: true
    }

    tackleBiggestRadius(up)
  })

  userTradableAsterisks.forEach(up => {
    userAsterisksByCoordinates[
      UserAsteriskMapUtil.coordinatesKey(up.axialCoordinateQ, up.axialCoordinateR)
    ] = {
      ...up,
      isInGame: false
    }

    tackleBiggestRadius(up)
  })

  return { userAsterisksByCoordinates, userAsterisksBiggestRadius }
}
