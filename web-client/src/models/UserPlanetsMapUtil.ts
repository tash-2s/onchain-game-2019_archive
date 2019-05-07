import { UserNormalPlanet } from "./UserNormalPlanet"

export class UserPlanetsMapUtil {
  static hexSize = 50
  static hexWidth = UserPlanetsMapUtil.hexSize * 2
  static hexHeight = Math.sqrt(3) * UserPlanetsMapUtil.hexSize
  static mapRadiusAndRequiredGold = [
    [1, 0],
    [2, 10000],
    [3, 400000],
    [4, 25600000],
    [5, 2611200000],
    [6, 425625600000],
    [7, 110662656000000],
    [8, 46035664896000000],
    [9, 30613717155840000000],
    [10, 32572995053813760000000],
    [11, 55439237581591019520000000],
    [12, 150961043934672346152960000000],
    [13, 657586307379432739842293760000000],
    [14, 4582718976127266763960945213440000000],
    [15, 51097316583819024418164539129856000000000],
    [16, 911576127855331395620055378076631040000000000],
    [17, 26020028993502579356578860711819356405760000000000]
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
