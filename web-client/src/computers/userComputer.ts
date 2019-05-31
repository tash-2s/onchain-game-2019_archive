import BN from "bn.js"

import { UserState, TargetUserState } from "../types/routed/userTypes"
import { NormalPlanetsData, initialPlanetIds, getNormalPlanet } from "../data/planets"
import { OngoingGoldCalculator } from "../models/OngoingGoldCalculator"
import { UserPlanetsMapUtil } from "../models/UserPlanetsMapUtil"

type ComputedUserState = ReturnType<typeof computeUserState>
export type ComputedTargetUserState = NonNullable<ComputedUserState["targetUser"]>

export const computeUserState = (state: UserState, now: number) => {
  if (!state.targetUser) {
    return { targetUser: null }
  }

  const { userPlanets, population, goldPower, techPower } = computeUserPlanetParams(
    state.targetUser.userNormalPlanets
  )

  const { goldPerSec, ongoingGold } = computeGold(population, goldPower, state.targetUser.gold, now)

  const computedUserPlanets = computeUserPlanetRankStatuses(
    userPlanets,
    ongoingGold,
    techPower,
    now
  )

  return {
    targetUser: {
      address: state.targetUser.address,
      gold: ongoingGold,
      userNormalPlanets: computedUserPlanets.sort((a, b) => a.createdAt - b.createdAt),
      population: population,
      goldPower: goldPower,
      techPower: techPower,
      goldPerSec: goldPerSec,
      mapRadius: UserPlanetsMapUtil.mapRadiusFromGold(ongoingGold),
      normalPlanets: processNormalPlanets(ongoingGold, computedUserPlanets.length)
    }
  }
}

const computeGold = (
  population: BN,
  goldPower: BN,
  userGold: { confirmed: string; confirmedAt: number },
  now: number
) => {
  const goldPerSec = population.mul(goldPower)

  const ongoingGold = OngoingGoldCalculator.calculate(
    new BN(userGold.confirmed),
    userGold.confirmedAt,
    goldPerSec,
    now
  )

  return { goldPerSec, ongoingGold }
}

const computeUserPlanetParams = (rawUserPlanets: TargetUserState["userNormalPlanets"]) => {
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
      planet: p
    }
  })

  return { userPlanets, population, goldPower, techPower: techPower.toNumber() }
}

const computeUserPlanetRankStatuses = (
  userPlanets: ReturnType<typeof computeUserPlanetParams>["userPlanets"],
  gold: BN,
  techPower: number,
  now: number
) => {
  return userPlanets.map(up => {
    const [remainingSec, remainingSecWithoutTechPower] = remainingSecForRankup(
      up.rank,
      up.rankupedAt,
      techPower,
      now
    )
    const [rankupableCount, requiredGoldForBulkRankup] = userPlanetRankupableCount(
      up.rank,
      up.rankupedAt,
      gold,
      techPower,
      up.planet.priceGold,
      now
    )
    return {
      ...up,
      maxRank: MAX_RANK,
      rankupableCount: rankupableCount,
      requiredGoldForRankup: requiredGoldForRankup(up.rank, up.planet.priceGold),
      requiredGoldForBulkRankup: requiredGoldForBulkRankup,
      remainingSecForRankup: remainingSec,
      remainingSecForRankupWithoutTechPower: remainingSecWithoutTechPower
    }
  })
}

const userPlanetParam = (currentRank: number, planetParam: BN) => {
  const previousRank = new BN(currentRank - 1)
  return planetParam.mul(new BN(13).pow(previousRank)).div(new BN(10).pow(previousRank))
}

const requiredGoldForRankup = (currentRank: number, planetPriceGold: BN) => {
  const previousRank = new BN(currentRank - 1)
  return planetPriceGold.mul(new BN(13).pow(previousRank)).div(new BN(10).pow(previousRank))
}

const remainingSecForRankup = (
  currentRank: number,
  rankupedAt: number,
  techPower: number,
  now: number
): [number, number] => {
  const prevDiffSec = now - rankupedAt
  const remainingSec = requiredSecForRankup(currentRank) - prevDiffSec
  const withoutTechPower = Math.max(remainingSec, 0)
  return [Math.max(withoutTechPower - techPower, 0), withoutTechPower]
}

const requiredSecForRankup = (currentRank: number) => {
  let i = 1
  let memo = 300
  while (i < currentRank) {
    memo = Math.floor((memo * 14) / 10)
    i++
  }
  return memo
}

const MAX_RANK = 30
const userPlanetRankupableCount = (
  userPlanetCurrentRank: number,
  userPlanetRankupedAt: number,
  gold: BN,
  techPower: number,
  planetOriginalPriceGold: BN,
  now: number
): [number, BN] => {
  let rankupableCount = 0
  let remainingGold = gold

  while (true) {
    const rank = userPlanetCurrentRank + rankupableCount
    if (rank >= MAX_RANK) {
      break
    }

    const requiredGold = requiredGoldForRankup(rank, planetOriginalPriceGold)
    if (requiredGold.gt(remainingGold)) {
      break
    }

    if (requiredSecForRankup(rank) > techPower) {
      if (rankupableCount !== 0) {
        break
      }
      if (remainingSecForRankup(rank, userPlanetRankupedAt, techPower, now)[0] > 0) {
        break
      }
    }

    remainingGold = remainingGold.sub(requiredGold)
    rankupableCount++
  }

  return [rankupableCount, gold.sub(remainingGold)]
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
