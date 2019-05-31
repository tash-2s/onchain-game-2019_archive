import BN from "bn.js"

import { TargetUserState } from "../types/routed/userTypes"
import { getNormalPlanet } from "../data/planets"

export const computeUserNormalPlanetParams = (
  rawUserPlanets: TargetUserState["userNormalPlanets"]
) => {
  let population = new BN(0)
  let goldPower = new BN(0)
  let techPower = new BN(0)

  const userNormalPlanets = rawUserPlanets.map(up => {
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

  return { userNormalPlanets, population, goldPower, techPower: techPower.toNumber() }
}

export const computeUserNormalPlanetRankStatuses = (
  userPlanets: ReturnType<typeof computeUserNormalPlanetParams>["userNormalPlanets"],
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
