import BN from "bn.js"

import { UserState, TargetUserState, OldTargetUserState } from "../types/routed/userTypes"
import { UserNormalPlanet, ExtendedUserState } from "../models/UserNormalPlanet"
import { getNormalPlanet } from "../data/planets"

export const computeUserState = (state: UserState): ExtendedUserState => {
  if (!state.targetUser) {
    return { ...state, targetUser: null }
  }

  const [userPlanets, population, goldPower, techPower] = processUserNormalPlanets(
    state.targetUser.userNormalPlanets
  )

  return {
    ...state,
    targetUser: {
      ...state.targetUser,
      userNormalPlanets: userPlanets.map(up => new UserNormalPlanet(up)),
      population: population.toString(),
      goldPower: goldPower.toString(),
      techPower: techPower,
      goldPerSec: population.mul(goldPower).toString(),
      selectedUserPlanetsTab: "map", // TODO: remove
      normalPlanetIdToGet: null // TODO: remove
    }
  }
}

const processUserNormalPlanets = (
  userPlanets: TargetUserState["userNormalPlanets"]
): [OldTargetUserState["userNormalPlanets"], BN, BN, number] => {
  const newUserPlanets: OldTargetUserState["userNormalPlanets"] = []
  let population = new BN(0)
  let goldPower = new BN(0)
  let techPower = new BN(0)

  userPlanets.forEach(up => {
    const p = getNormalPlanet(up.normalPlanetId)
    if (p.kind === "magic") {
      throw new Error("magic planets are not supported yet")
    }

    const previousRank = new BN(up.rank - 1)
    const param = new BN(10)
      .pow(new BN(p.paramCommonLogarithm))
      .mul(new BN(13).pow(previousRank))
      .div(new BN(10).pow(previousRank))

    switch (p.kind) {
      case "residence":
        population = population.add(param)
        break
      case "goldvein":
        goldPower = goldPower.add(param)
        break
      case "technology":
        techPower = techPower.add(param)
        break
      default:
        throw new Error("undefined kind")
    }

    const newUp = {
      ...up,
      paramMemo: param.toString()
    }

    newUserPlanets.push(newUp)
  })

  return [newUserPlanets, population, goldPower, techPower.toNumber()]
}
