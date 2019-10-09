import BN from "bn.js"

import { UserSpecialPlanet } from "../reducers/userReducer"

export const computeUserSpecialPlanets = (
  rawUserPlanets: Array<UserSpecialPlanet>,
  biggestUserNormalPlanetPopulation: BN,
  biggestUserNormalPlanetProductivity: BN
) => {
  const population = new BN(0)
  const productivity = new BN(0)

  const userSpecialPlanets = rawUserPlanets.map(up => {
    let param: BN

    switch (up.kind) {
      case "residence":
        param = biggestUserNormalPlanetPopulation.muln(up.paramRate)
        population.iadd(param)
        break
      case "goldmine":
        param = biggestUserNormalPlanetProductivity.muln(up.paramRate)
        productivity.iadd(param)
        break
      default:
        throw new Error("undefined or unsupported kind")
    }

    return {
      ...up,
      artSeed: new BN(up.artSeed),
      param: param
    }
  })

  return { userSpecialPlanets, population, productivity }
}
