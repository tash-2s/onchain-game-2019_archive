import BN from "bn.js"

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
  const requiredGoldForNextRadius = UserPlanetsMapUtil.requiredGoldFromMapRadius(usableRadius + 1)

  return {
    usableRadius,
    shownRadius,
    hexes,
    requiredGoldForNextRadius
  }
}

class UserPlanetsMapUtil {
  static mapRadiusAndRequiredGold = [
    [1, new BN("0")],
    [2, new BN("10000")],
    [3, new BN("400000")],
    [4, new BN("25600000")],
    [5, new BN("2611200000")],
    [6, new BN("425625600000")],
    [7, new BN("110662656000000")],
    [8, new BN("46035664896000000")],
    [9, new BN("30613717155840000000")],
    [10, new BN("32572995053813760000000")],
    [11, new BN("55439237581591019520000000")],
    [12, new BN("150961043934672346152960000000")],
    [13, new BN("657586307379432739842293760000000")],
    [14, new BN("4582718976127266763960945213440000000")],
    [15, new BN("51097316583819024418164539129856000000000")],
    [16, new BN("911576127855331395620055378076631040000000000")],
    [17, new BN("26020028993502579356578860711819356405760000000000")]
  ].reverse() as Array<[number, BN]>

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
    for (const d of UserPlanetsMapUtil.mapRadiusAndRequiredGold) {
      if (d[1].lte(gold)) {
        return d[0]
      }
    }

    throw new Error("'data' must be wrong")
  }

  static requiredGoldFromMapRadius = (radius: number) => {
    const d = UserPlanetsMapUtil.mapRadiusAndRequiredGold.find(d => d[0] === radius)
    if (d) {
      return d[1]
    }
    return null
  }

  static userPlanetsAndThierBiggestRadius = <
    T extends { axialCoordinateQ: number; axialCoordinateR: number }
  >(
    userNormalPlanets: Array<T>
  ) => {
    const userPlanetsByCoordinates: {
      [key: string]: T | null
    } = {}
    let userPlanetsBiggestRadius = 0

    userNormalPlanets.forEach(up => {
      userPlanetsByCoordinates[
        UserPlanetsMapUtil.coordinatesKey(up.axialCoordinateQ, up.axialCoordinateR)
      ] = up

      const distance = UserPlanetsMapUtil.distanceFromCenter(
        up.axialCoordinateQ,
        up.axialCoordinateR
      )
      if (userPlanetsBiggestRadius < distance) {
        userPlanetsBiggestRadius = distance
      }
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
