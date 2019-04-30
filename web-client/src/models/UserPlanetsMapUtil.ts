import { UserNormalPlanet } from "./UserNormalPlanet"

export class UserPlanetsMapUtil {
  static hexSize = 50
  static hexWidth = UserPlanetsMapUtil.hexSize * 2
  static hexHeight = Math.sqrt(3) * UserPlanetsMapUtil.hexSize
  static mapRadiusAndRequiredGold = [
    [1, 0],
    [2, 10000],
    [3, 400000],
    [4, 32000000],
    [5, 5120000000],
    [6, 1638400000000],
    [7, 786432000000000],
    [8, 566231040000000000],
    [9, 611529523200000000000],
    [10, 990677827584000000000000],
    [11, 1925877696823296000000000000],
    [12, 4491146788991926272000000000000],
    [13, 12566228715599409709056000000000000],
    [14, 42184829798267218393300992000000000000],
    [15, 169920494427420355688216395776000000000000],
    [16, 821225749567722579041149840785408000000000000],
    [17, 4762288121743223235859627926714580992000000000000]
  ].reverse()

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

  static mapRadiusFromGold = (gold: number) => {
    for (const d of UserPlanetsMapUtil.mapRadiusAndRequiredGold) {
      if (d[1] <= gold) {
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

  static userPlanetsAndThierBiggestRadius = (userNormalPlanets: Array<UserNormalPlanet>) => {
    const userPlanetsByCoordinates: { [key: string]: UserNormalPlanet | null } = {}
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
