import BN from "bn.js"

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
    const settable = UserPlanetsMapUtil.distanceFromCenter(q, r) <= usableRadius
    return { q, r, userPlanet, settable }
  })
  const requiredGoldForNextRadius = UserPlanetsMapUtil.requiredGoldFromMapRadius(usableRadius + 1)

  return {
    usableRadius,
    shownRadius,
    hexes,
    requiredGoldForNextRadius
  }
}

const RADIUS_GOLD_THRESHOLD = [
  "100000",
  "10000000",
  "1000000000",
  "100000000000",
  "100000000000000",
  "1000000000000000000",
  "100000000000000000000000",
  "100000000000000000000000000",
  "10000000000000000000000000000",
  "1000000000000000000000000000000",
  "100000000000000000000000000000000",
  "1000000000000000000000000000000000",
  "10000000000000000000000000000000000",
  "100000000000000000000000000000000000",
  "1000000000000000000000000000000000000",
  "10000000000000000000000000000000000000"
].map(s => new BN(s))

class UserPlanetsMapUtil {
  static distanceFromCenter = (q: number, r: number) => {
    const x = q
    const z = r
    const y = -x - z
    return Math.max(Math.abs(x), Math.abs(y), Math.abs(z))
  }

  static hexesFromMapRadius = (radius: number) => {
    const arr: Array<Array<number>> = []
    UserPlanetsMapUtil.range(-radius, radius).forEach(q => {
      UserPlanetsMapUtil.range(
        Math.max(-radius, -q - radius),
        Math.min(radius, -q + radius)
      ).forEach(r => {
        arr.push([q, r])
      })
    })
    return arr
  }

  static hexesCountFromMapRadius = (radius: number) => {
    return 1 + 3 * radius * (radius + 1)
  }

  static coordinatesKey = (q: number, r: number) => `${q}/${r}`

  static mapRadiusFromGold = (gold: BN) => {
    for (let i = RADIUS_GOLD_THRESHOLD.length; i > 0; i--) {
      const bn = RADIUS_GOLD_THRESHOLD[i - 1]
      if (bn.lte(gold)) {
        return i + 1
      }
    }
    return 1
  }

  static requiredGoldFromMapRadius = (radius: number) => {
    if (radius <= 1) {
      return new BN(0)
    }
    const result = RADIUS_GOLD_THRESHOLD[radius - 2]
    if (result) {
      return result
    }
    return null
  }

  static userPlanetsAndThierBiggestRadius = <T1 extends Coordinates, T2 extends Coordinates>(
    userNormalPlanets: Array<T1>,
    userSpecialPlanets: Array<T2>
  ) => {
    const userPlanetsByCoordinates: {
      [key: string]: (T1 & { isNormal: true }) | (T2 & { isNormal: false }) | null
    } = {}
    let userPlanetsBiggestRadius = 0

    const tackleBiggestRadius = (up: T1 | T2) => {
      const distance = UserPlanetsMapUtil.distanceFromCenter(
        up.axialCoordinateQ,
        up.axialCoordinateR
      )
      if (userPlanetsBiggestRadius < distance) {
        userPlanetsBiggestRadius = distance
      }
    }

    userNormalPlanets.forEach(up => {
      userPlanetsByCoordinates[
        UserPlanetsMapUtil.coordinatesKey(up.axialCoordinateQ, up.axialCoordinateR)
      ] = { ...up, isNormal: true }

      tackleBiggestRadius(up)
    })

    userSpecialPlanets.forEach(up => {
      userPlanetsByCoordinates[
        UserPlanetsMapUtil.coordinatesKey(up.axialCoordinateQ, up.axialCoordinateR)
      ] = { ...up, isNormal: false }

      tackleBiggestRadius(up)
    })

    return { userPlanetsByCoordinates, userPlanetsBiggestRadius }
  }

  private static range = (from: number, to: number) => {
    if (from > to) {
      throw new Error("'to' must be bigger than 'from'")
    }
    const arr: Array<number> = []
    for (let i = from; i <= to; i++) {
      arr.push(i)
    }
    return arr
  }
}
