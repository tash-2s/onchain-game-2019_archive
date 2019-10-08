import BN from "bn.js"

import { UserNormalPlanet } from "../reducers/userReducer"
import { getNormalPlanet } from "../data/NormalPlanets"

export const computeUserNormalPlanetParams = (rawUserPlanets: Array<UserNormalPlanet>) => {
  let population = new BN(0)
  let productivity = new BN(0)
  let knowledge = new BN(0)

  const userNormalPlanets = rawUserPlanets.map(up => {
    const p = getNormalPlanet(up.normalPlanetId)
    const param = paramBasedOnRank(p.param, up.rank)

    switch (p.kind) {
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
      param: param,
      planet: p
    }
  })

  return { userNormalPlanets, population, productivity, knowledge: knowledge.toNumber() }
}

export const computeUserNormalPlanetRankStatuses = (
  userPlanets: ReturnType<typeof computeUserNormalPlanetParams>["userNormalPlanets"],
  gold: BN,
  knowledge: number,
  now: number
) => {
  return userPlanets.map(up => {
    const { withKnowledge, withoutKnowledge } = remainingSecForRankup(
      up.rank,
      up.rankupedAt,
      knowledge,
      now
    )
    const MAX_RANK = 30
    const { count, requiredGold } = rankupableCount(
      up.rank,
      up.rankupedAt,
      MAX_RANK,
      up.planet.priceGold,
      gold,
      knowledge,
      now
    )

    return {
      ...up,
      maxRank: MAX_RANK,
      rankupableCount: count,
      requiredGoldForRankup: requiredGoldForRankup(up.rank, up.planet.priceGold),
      requiredGoldForBulkRankup: requiredGold,
      remainingSecForRankup: withKnowledge,
      remainingSecForRankupWithoutKnowledge: withoutKnowledge
    }
  })
}

const paramBasedOnRank = (planetParam: BN, currentRank: number) => {
  const previousRank = new BN(currentRank - 1)
  return planetParam.mul(new BN(13).pow(previousRank)).div(new BN(10).pow(previousRank))
}

const requiredGoldForRankup = (currentRank: number, planetPriceGold: BN) => {
  const previousRank = new BN(currentRank - 1)
  return planetPriceGold.mul(new BN(14).pow(previousRank)).div(new BN(10).pow(previousRank))
}

const remainingSecForRankup = (
  currentRank: number,
  rankupedAt: number,
  knowledge: number,
  now: number
) => {
  const prevDiffSec = now - rankupedAt
  const remainingSec = requiredSecForRankup(currentRank) - prevDiffSec
  const withoutKnowledge = Math.max(remainingSec, 0)
  return {
    withKnowledge: Math.max(withoutKnowledge - knowledge, 0),
    withoutKnowledge: withoutKnowledge
  }
}

const requiredSecForRankup = (currentRank: number) => {
  return 300 * 14 ** (currentRank - 1) / 10 ** (currentRank - 1)
}

const rankupableCount = (
  userPlanetCurrentRank: number,
  userPlanetRankupedAt: number,
  userPlanetMaxRank: number,
  planetOriginalPriceGold: BN,
  gold: BN,
  knowledge: number,
  now: number
) => {
  let rankupableCount = 0
  let remainingGold = gold

  while (true) {
    const rank = userPlanetCurrentRank + rankupableCount
    if (rank >= userPlanetMaxRank) {
      break
    }

    const requiredGold = requiredGoldForRankup(rank, planetOriginalPriceGold)
    if (requiredGold.gt(remainingGold)) {
      break
    }

    if (requiredSecForRankup(rank) > knowledge) {
      if (rankupableCount !== 0) {
        break
      }
      if (remainingSecForRankup(rank, userPlanetRankupedAt, knowledge, now).withKnowledge > 0) {
        break
      }
    }

    remainingGold = remainingGold.sub(requiredGold)
    rankupableCount++
  }

  return { count: rankupableCount, requiredGold: gold.sub(remainingGold) }
}
