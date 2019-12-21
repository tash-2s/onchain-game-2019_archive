import BN from "bn.js"

import { UserTradableAsterisk } from "../reducers/userReducer"

export const computeUserTradableAsterisks = (
  rawUserAsterisks: Array<UserTradableAsterisk>,
  biggestUserInGameAsteriskPopulation: BN,
  biggestUserInGameAsteriskProductivity: BN
) => {
  const population = new BN(0)
  const productivity = new BN(0)

  const userTradableAsterisks = rawUserAsterisks.map(up => {
    let param: BN

    switch (up.kind) {
      case "residence":
        param = biggestUserInGameAsteriskPopulation.muln(up.paramRate)
        population.iadd(param)
        break
      case "goldmine":
        param = biggestUserInGameAsteriskProductivity.muln(up.paramRate)
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

  return { userTradableAsterisks, population, productivity }
}
