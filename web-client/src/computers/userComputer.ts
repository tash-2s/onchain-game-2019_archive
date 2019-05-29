import BN from "bn.js"

import { UserState, TargetUserState } from "../types/routed/userTypes"
import { NormalPlanetsData, initialPlanetIds, getNormalPlanet } from "../data/planets"
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
      mapRadius: UserPlanetsMapUtil.mapRadiusFromGold(ongoingGold),
      normalPlanets: processNormalPlanets(ongoingGold, userPlanets2.length)
    }
  }
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
    const param = userPlanetParam(up.rank, p.param)

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
      requiredGoldForRankup: userPlanetRequiredGoldForRankup(up.rank, p.priceGold),
      planetKind: p.kind,
      rankupedSec: now - up.rankupedAt,
      createdSec: now - up.createdAt
    }
  })

  userPlanets.sort((a, b) => a.createdAt - b.createdAt)

  return { userPlanets, population, goldPower, techPower: techPower.toNumber() }
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

const userPlanetParam = (currentRank: number, planetParam: BN) => {
  const previousRank = new BN(currentRank - 1)
  return planetParam.mul(new BN(13).pow(previousRank)).div(new BN(10).pow(previousRank))
}

const userPlanetRequiredGoldForRankup = (currentRank: number, planetPriceGold: BN) => {
  const previousRank = new BN(currentRank - 1)
  return planetPriceGold.mul(new BN(13).pow(previousRank)).div(new BN(10).pow(previousRank))
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

const processNormalPlanets = (gold: BN, userPlanetsCount: number) => {
  if (initialPlanetIds.length !== 2) {
    throw new Error("you need to check this impl")
  }

  let onlyAvailableId: null | number = null
  if (gold.eqn(0) && userPlanetsCount === 0) {
    onlyAvailableId = initialPlanetIds[0]
  }
  if (gold.eq(getNormalPlanet(initialPlanetIds[1]).priceGold) && userPlanetsCount === 1) {
    onlyAvailableId = initialPlanetIds[1]
  }

  return NormalPlanetsData.map(p => {
    let gettable = false
    if (onlyAvailableId) {
      if (onlyAvailableId === p.id) {
        gettable = true
      } else {
        gettable = false
      }
    } else {
      gettable = gold.gte(p.priceGold)
    }

    return { ...p, gettable }
  })
}
