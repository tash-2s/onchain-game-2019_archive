import BN from "bn.js"

import { UserState, TargetUserState } from "../reducers/userReducer"
import { NormalPlanets, initialNormalPlanetIds, getNormalPlanet } from "../data/NormalPlanets"
import {
  computeUserNormalPlanetParams,
  computeUserNormalPlanetRankStatuses
} from "./userNormalPlanetComputer"
import { computeUserSpecialPlanets } from "./userSpecialPlanetComputer"
import { computeGold } from "./goldComputer"
import { computeMap } from "./mapComputer"

type ComputedUserState = ReturnType<typeof computeUserState>
export type ComputedTargetUserState = NonNullable<ComputedUserState["targetUser"]>

export const computeUserState = (state: UserState, now: number) => {
  if (!state.targetUser) {
    return { targetUser: null }
  }

  const {
    userNormalPlanets,
    population: normalPopulation,
    productivity: normalProductivity,
    knowledge,
    biggestUserNormalPlanetPopulation,
    biggestUserNormalPlanetProductivity
  } = computeUserNormalPlanetParams(state.targetUser.userNormalPlanets)
  const {
    userSpecialPlanets,
    population: specialPopulation,
    productivity: specialProductivity
  } = computeUserSpecialPlanets(
    state.targetUser.userSpecialPlanets,
    biggestUserNormalPlanetPopulation,
    biggestUserNormalPlanetProductivity
  )
  const population = normalPopulation.add(specialPopulation)
  const productivity = normalProductivity.add(specialProductivity)

  const { goldPerSec, ongoingGold } = computeGold(
    population,
    productivity,
    state.targetUser.gold,
    now
  )

  const computedUserPlanets = computeUserNormalPlanetRankStatuses(
    userNormalPlanets,
    ongoingGold,
    knowledge,
    now
  )

  return {
    targetUser: {
      address: state.targetUser.address,
      gold: ongoingGold,
      userNormalPlanets: computedUserPlanets.sort((a, b) => a.createdAt - b.createdAt),
      userSpecialPlanets: userSpecialPlanets,
      population: population,
      productivity: productivity,
      knowledge: knowledge,
      goldPerSec: goldPerSec,
      map: computeMap(ongoingGold, computedUserPlanets, userSpecialPlanets),
      normalPlanets: computeNormalPlanets(ongoingGold, computedUserPlanets.length),
      specialPlanetToken: computeSpecialPlanetToken(state.targetUser.specialPlanetToken)
    }
  }
}

const computeSpecialPlanetToken = (token: TargetUserState["specialPlanetToken"]) => {
  if (!token) {
    return null
  }
  return {
    ...token,
    ethTokens: token.ethTokens.map(t => ({ ...t, artSeed: new BN(t.artSeed) })),
    loomTokens: token.loomTokens.map(t => ({ ...t, artSeed: new BN(t.artSeed) }))
  }
}

const computeNormalPlanets = (gold: BN, userPlanetCount: number) => {
  if (initialNormalPlanetIds.length !== 2) {
    throw new Error("you need to check this impl")
  }

  let onlyAvailableId: null | number = null
  if (gold.eqn(0) && userPlanetCount === 0) {
    onlyAvailableId = initialNormalPlanetIds[0]
  }
  if (gold.eq(getNormalPlanet(initialNormalPlanetIds[1]).priceGold) && userPlanetCount === 1) {
    onlyAvailableId = initialNormalPlanetIds[1]
  }

  return NormalPlanets.map(p => {
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
