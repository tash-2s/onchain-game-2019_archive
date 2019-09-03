import BN from "bn.js"

import { UserSpecialPlanet } from "../reducers/userReducer"

export const computeUserSpecialPlanets = (rawUserPlanets: Array<UserSpecialPlanet>) => {
  let population = new BN(0)
  let productivity = new BN(0)
  let knowledge = new BN(0)

  const userSpecialPlanets = rawUserPlanets.map(up => {
    const param = new BN(10).pow(new BN(up.originalParamCommonLogarithm))

    switch (up.kind) {
      case "residence":
        population = population.add(param)
        break
      case "goldmine":
        productivity = productivity.add(param)
        break
      case "technology":
        knowledge = knowledge.add(param)
        break
      default:
        throw new Error("undefined kind")
    }

    return {
      ...up,
      artSeed: new BN(up.artSeed),
      param: param
    }
  })

  return { userSpecialPlanets, population, productivity, knowledge: knowledge.toNumber() }
}
