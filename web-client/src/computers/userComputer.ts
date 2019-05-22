import BN from "bn.js"

import { UserState, TargetUserState, UserNormalPlanetType } from "../types/routed/userTypes"
import { UserNormalPlanet } from "../models/UserNormalPlanet"
import { getNormalPlanet } from "../data/planets"
import { BNFormatter } from "../models/BNFormatter"
import { OngoingGoldCalculator } from "../models/OngoingGoldCalculator"
import { UserPlanetsMapUtil } from "../models/UserPlanetsMapUtil"

type ComputedUserState = ReturnType<typeof computeUserState>
export type ComputedTargetUserState = NonNullable<ComputedUserState["targetUser"]>

export const computeUserState = (state: UserState, now: number) => {
  if (!state.targetUser) {
    return { ...state, targetUser: null }
  }

  const [userPlanets, population, goldPower, techPower] = processUserNormalPlanets(
    state.targetUser.userNormalPlanets
  )
  const goldPerSec = population.mul(goldPower)

  const ongoingGold = OngoingGoldCalculator.calculate(
    new BN(state.targetUser.gold.confirmed),
    state.targetUser.gold.confirmedAt,
    goldPerSec,
    now
  )

  return {
    targetUser: {
      address: state.targetUser.address,
      gold: BNFormatter.pretty(ongoingGold),
      goldBN: ongoingGold, // TODO: remove
      userNormalPlanets: userPlanets.map(up => new UserNormalPlanet(up, now, ongoingGold)), // TODO: they should be objs
      population: BNFormatter.pretty(population),
      goldPower: BNFormatter.pretty(goldPower),
      techPower: techPower,
      goldPerSec: BNFormatter.pretty(goldPerSec),
      mapRadius: UserPlanetsMapUtil.mapRadiusFromGold(ongoingGold)
    }
  }
}

const processUserNormalPlanets = (
  userPlanets: TargetUserState["userNormalPlanets"]
): [Array<UserNormalPlanetType & { paramMemo: BN }>, BN, BN, number] => {
  const newUserPlanets: Array<UserNormalPlanetType & { paramMemo: BN }> = []
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
      paramMemo: param
    }

    newUserPlanets.push(newUp)
  })

  return [newUserPlanets, population, goldPower, techPower.toNumber()]
}
