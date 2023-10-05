import BN from "bn.js"

import { UserInGameAsterisk } from "../reducers/userReducer"
import { getInGameAsterisk } from "../data/InGameAsterisks"

export const computeUserInGameAsteriskParams = (rawUserAsterisks: Array<UserInGameAsterisk>) => {
  const population = new BN(0)
  const productivity = new BN(0)
  const knowledge = new BN(0)

  let biggestUserInGameAsteriskPopulation = new BN(0)
  let biggestUserInGameAsteriskProductivity = new BN(0)

  const userInGameAsterisks = rawUserAsterisks.map(up => {
    const p = getInGameAsterisk(up.inGameAsteriskId)
    const param = paramBasedOnRank(p.param, up.rank)

    switch (p.kind) {
      case "residence":
        population.iadd(param)
        if (param.gt(biggestUserInGameAsteriskPopulation)) {
          biggestUserInGameAsteriskPopulation = param
        }
        break
      case "goldmine":
        productivity.iadd(param)
        if (param.gt(biggestUserInGameAsteriskProductivity)) {
          biggestUserInGameAsteriskProductivity = param
        }
        break
      case "technology":
        knowledge.iadd(param)
        break
      default:
        throw new Error("undefined kind")
    }

    return {
      ...up,
      param: param,
      asterisk: p
    }
  })

  return {
    userInGameAsterisks,
    population,
    productivity,
    knowledge: knowledge.toNumber(),
    biggestUserInGameAsteriskPopulation,
    biggestUserInGameAsteriskProductivity
  }
}

export const computeUserInGameAsteriskRankStatuses = (
  userAsterisks: ReturnType<typeof computeUserInGameAsteriskParams>["userInGameAsterisks"],
  gold: BN,
  knowledge: number,
  now: number
) => {
  return userAsterisks.map(up => {
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
      up.asterisk.priceGold,
      gold,
      knowledge,
      now
    )

    return {
      ...up,
      maxRank: MAX_RANK,
      rankupableCount: count,
      requiredGoldForRankup: requiredGoldForRankup(up.rank, up.asterisk.priceGold),
      requiredGoldForBulkRankup: requiredGold,
      remainingSecForRankup: withKnowledge,
      remainingSecForRankupWithoutKnowledge: withoutKnowledge
    }
  })
}

const paramBasedOnRank = (asteriskParam: BN, currentRank: number) => {
  const previousRank = new BN(currentRank - 1)
  return asteriskParam.mul(new BN(13).pow(previousRank)).div(new BN(10).pow(previousRank))
}

const requiredGoldForRankup = (currentRank: number, asteriskPriceGold: BN) => {
  const previousRank = new BN(currentRank - 1)
  return asteriskPriceGold.mul(new BN(14).pow(previousRank)).div(new BN(10).pow(previousRank))
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
  return Math.floor((300 * 14 ** (currentRank - 1)) / 10 ** (currentRank - 1))
}

const rankupableCount = (
  userAsteriskCurrentRank: number,
  userAsteriskRankupedAt: number,
  userAsteriskMaxRank: number,
  asteriskOriginalPriceGold: BN,
  gold: BN,
  knowledge: number,
  now: number
) => {
  let rankupableCount = 0
  let remainingGold = gold

  while (true) {
    const rank = userAsteriskCurrentRank + rankupableCount
    if (rank >= userAsteriskMaxRank) {
      break
    }

    const requiredGold = requiredGoldForRankup(rank, asteriskOriginalPriceGold)
    if (requiredGold.gt(remainingGold)) {
      break
    }

    if (requiredSecForRankup(rank) > knowledge) {
      if (rankupableCount !== 0) {
        break
      }
      if (remainingSecForRankup(rank, userAsteriskRankupedAt, knowledge, now).withKnowledge > 0) {
        break
      }
    }

    remainingGold = remainingGold.sub(requiredGold)
    rankupableCount++
  }

  return { count: rankupableCount, requiredGold: gold.sub(remainingGold) }
}
