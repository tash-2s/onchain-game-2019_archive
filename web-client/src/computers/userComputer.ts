import BN from "bn.js"

import { UserState, TargetUserState, UserNormalPlanetType } from "../types/routed/userTypes"
import { getNormalPlanet } from "../data/planets"
import { OngoingGoldCalculator } from "../models/OngoingGoldCalculator"
import { UserPlanetsMapUtil } from "../models/UserPlanetsMapUtil"
import { PlanetKind } from "../types/commonTypes"

type ComputedUserState = ReturnType<typeof computeUserState>
export type ComputedTargetUserState = NonNullable<ComputedUserState["targetUser"]>

export const computeUserState = (state: UserState, now: number) => {
  if (!state.targetUser) {
    return { ...state, targetUser: null }
  }

  const { userPlanets, population, goldPower, techPower } = processUserNormalPlanets(
    state.targetUser.userNormalPlanets,
    now
  )
  const goldPerSec = population.mul(goldPower)

  const ongoingGold = OngoingGoldCalculator.calculate(
    new BN(state.targetUser.gold.confirmed),
    state.targetUser.gold.confirmedAt,
    goldPerSec,
    now
  )

  const userPlanets2 = processUserNormalPlanets2(userPlanets, ongoingGold, techPower, now)

  return {
    targetUser: {
      address: state.targetUser.address,
      gold: ongoingGold,
      userNormalPlanets: userPlanets2,
      population: population,
      goldPower: goldPower,
      techPower: techPower,
      goldPerSec: goldPerSec,
      mapRadius: UserPlanetsMapUtil.mapRadiusFromGold(ongoingGold)
    }
  }
}

const processUserNormalPlanets2 = (
  userPlanets: ReturnType<typeof processUserNormalPlanets>["userPlanets"],
  gold: BN,
  techPower: number,
  now: number
) => {
  return userPlanets.map(up => {
    const [remainingSec, remainingSecWithoutTechPower] = userPlanetRemainingSecForRankup(
      up.rank,
      up.rankupedAt,
      techPower,
      now
    )
    return {
      ...up,
      isRankupable: userPlanetIsRankupable(
        up.rank,
        up.maxRank,
        remainingSec,
        up.requiredGoldForRankup,
        gold
      ),
      remainingSecForRankup: remainingSec,
      remainingSecForRankupWithoutTechPower: remainingSecWithoutTechPower
    }
  })
}

const processUserNormalPlanets = (
  rawUserPlanets: TargetUserState["userNormalPlanets"],
  now: number
) => {
  let population = new BN(0)
  let goldPower = new BN(0)
  let techPower = new BN(0)

  const userPlanets = rawUserPlanets.map(up => {
    const p = getNormalPlanet(up.normalPlanetId)
    if (p.kind === "magic") {
      throw new Error("magic planets are not supported yet")
    }

    const param = userPlanetParam(up.rank, p.paramCommonLogarithm)

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

    return {
      ...up,
      param: param,
      maxRank: 30,
      requiredGoldForRankup: userPlanetRequiredGoldForRankup(up.rank, p.priceGoldCommonLogarithm),
      planetKind: p.kind,
      rankupedSec: now - up.rankupedAt,
      createdSec: now - up.createdAt
    }
  })

  return { userPlanets, population, goldPower, techPower: techPower.toNumber() }
}

const userPlanetParam = (currentRank: number, planetParamCommonLogarithm: number) => {
  const previousRank = new BN(currentRank - 1)
  return new BN(10)
    .pow(new BN(planetParamCommonLogarithm))
    .mul(new BN(13).pow(previousRank))
    .div(new BN(10).pow(previousRank))
}

const userPlanetRequiredGoldForRankup = (
  currentRank: number,
  planetPriceGoldCommonLogarithm: number
) => {
  const previousRank = new BN(currentRank - 1)
  return new BN(10)
    .pow(new BN(planetPriceGoldCommonLogarithm))
    .mul(new BN(13).pow(previousRank))
    .div(new BN(10).pow(previousRank))
}

const userPlanetRemainingSecForRankup = (
  rank: number,
  rankupedAt: number,
  techPower: number,
  now: number
): [number, number] => {
  const prevDiffSec = now - rankupedAt
  const remainingSec = requiredSecForRankup(rank) - prevDiffSec
  const withoutTechPower = Math.max(remainingSec, 0)
  return [Math.max(withoutTechPower - techPower, 0), withoutTechPower]
}

const requiredSecForRankup = (rank: number) => {
  let i = 1
  let memo = 300
  while (i < rank) {
    memo = Math.floor((memo * 14) / 10)
    i++
  }
  return memo
}

const userPlanetIsRankupable = (
  rank: number,
  maxRank: number,
  remainingSec: number,
  requiredGoldForRankup: BN,
  gold: BN
) => {
  return rank < maxRank && remainingSec <= 0 && requiredGoldForRankup.lte(gold)
}
