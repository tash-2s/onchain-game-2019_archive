import { UserNormalPlanet } from "./UserNormalPlanet"

export class UserPlanetsMapUtil {
  static hexSize = 50
  static hexWidth = UserPlanetsMapUtil.hexSize * 2
  static hexHeight = Math.sqrt(3) * UserPlanetsMapUtil.hexSize

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

  static coordinatesKey = (q: number, r: number) => `${q}/${r}`

  static mapRadiusFromGold = (gold: number) => {
    if (gold < 1) {
      return 1
    }
    let digit = 0
    let g = gold
    while (g !== 0) {
      g = Math.floor(g / 10)
      digit++
    }
    return Math.min(digit, 17)
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
