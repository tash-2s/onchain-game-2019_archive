import BN from "bn.js"

import { UserState, TargetUserState } from "../reducers/userReducer"
import { InGameAsterisks, initialInGameAsteriskIds, getInGameAsterisk } from "../data/InGameAsterisks"
import {
  computeUserInGameAsteriskParams,
  computeUserInGameAsteriskRankStatuses
} from "./userInGameAsteriskComputer"
import { computeUserTradableAsterisks } from "./userTradableAsteriskComputer"
import { computeGold } from "./goldComputer"
import { computeUserAsteriskMap } from "./userAsteriskMapComputer"

export type ComputedUserState = ReturnType<typeof computeUserState>
export type ComputedTargetUserState = NonNullable<ComputedUserState["targetUser"]>

export const computeUserState = (state: UserState, now: number) => {
  if (!state.targetUser) {
    return { targetUser: null }
  }

  const {
    userInGameAsterisks,
    population: inGamePopulation,
    productivity: inGameProductivity,
    knowledge,
    biggestUserInGameAsteriskPopulation,
    biggestUserInGameAsteriskProductivity
  } = computeUserInGameAsteriskParams(state.targetUser.userInGameAsterisks)
  const {
    userTradableAsterisks,
    population: tradablePopulation,
    productivity: tradableProductivity
  } = computeUserTradableAsterisks(
    state.targetUser.userTradableAsterisks,
    biggestUserInGameAsteriskPopulation,
    biggestUserInGameAsteriskProductivity
  )
  const population = inGamePopulation.add(tradablePopulation)
  const productivity = inGameProductivity.add(tradableProductivity)

  const { goldPerSec, ongoingGold } = computeGold(
    population,
    productivity,
    state.targetUser.gold,
    now
  )

  const computedUserAsterisks = computeUserInGameAsteriskRankStatuses(
    userInGameAsterisks,
    ongoingGold,
    knowledge,
    now
  )

  return {
    targetUser: {
      address: state.targetUser.address,
      gold: ongoingGold,
      userInGameAsterisks: computedUserAsterisks.sort((a, b) => a.createdAt - b.createdAt),
      userTradableAsterisks: userTradableAsterisks,
      population: population,
      productivity: productivity,
      knowledge: knowledge,
      goldPerSec: goldPerSec,
      userAsteriskMap: computeUserAsteriskMap(ongoingGold, computedUserAsterisks, userTradableAsterisks),
      inGameAsterisks: computeInGameAsterisks(ongoingGold, computedUserAsterisks.length),
      tradableAsteriskToken: computeTradableAsteriskToken(state.targetUser.tradableAsteriskToken)
    }
  }
}

const computeTradableAsteriskToken = (token: TargetUserState["tradableAsteriskToken"]) => {
  if (!token) {
    return null
  }
  return {
    ...token,
    ethTokens: token.ethTokens.map(t => ({ ...t, artSeed: new BN(t.artSeed) })),
    loomTokens: token.loomTokens.map(t => ({ ...t, artSeed: new BN(t.artSeed) }))
  }
}

const computeInGameAsterisks = (gold: BN, userAsteriskCount: number) => {
  if (initialInGameAsteriskIds.length !== 2) {
    throw new Error("you need to check this impl")
  }

  let onlyAvailableId: null | number = null
  if (gold.eqn(0) && userAsteriskCount === 0) {
    onlyAvailableId = initialInGameAsteriskIds[0]
  }
  if (gold.eq(getInGameAsterisk(initialInGameAsteriskIds[1]).priceGold) && userAsteriskCount === 1) {
    onlyAvailableId = initialInGameAsteriskIds[1]
  }

  return InGameAsterisks.map(p => {
    let gettable = false
    if (onlyAvailableId) {
      gettable = onlyAvailableId === p.id
    } else {
      gettable = gold.gte(p.priceGold)
    }

    return { ...p, gettable }
  })
}
