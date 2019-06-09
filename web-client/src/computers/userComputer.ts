import BN from "bn.js"

import { UserState } from "../reducers/routed/userReducer"
import { NormalPlanetsData, initialPlanetIds, getNormalPlanet } from "../data/planets"
import {
  computeUserNormalPlanetParams,
  computeUserNormalPlanetRankStatuses
} from "./userNormalPlanetComputer"
import { computeGold } from "./goldComputer"
import { computeMap } from "./mapComputer"

type ComputedUserState = ReturnType<typeof computeUserState>
export type ComputedTargetUserState = NonNullable<ComputedUserState["targetUser"]>

export const computeUserState = (state: UserState, now: number) => {
  if (!state.targetUser) {
    return { targetUser: null }
  }

  const { userNormalPlanets, population, productivity, knowledge } = computeUserNormalPlanetParams(
    state.targetUser.userNormalPlanets
  )

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
      population: population,
      productivity: productivity,
      knowledge: knowledge,
      goldPerSec: goldPerSec,
      map: computeMap(ongoingGold, computedUserPlanets),
      normalPlanets: computeNormalPlanets(ongoingGold, computedUserPlanets.length)
    }
  }
}

const computeNormalPlanets = (gold: BN, userPlanetCount: number) => {
  if (initialPlanetIds.length !== 2) {
    throw new Error("you need to check this impl")
  }

  let onlyAvailableId: null | number = null
  if (gold.eqn(0) && userPlanetCount === 0) {
    onlyAvailableId = initialPlanetIds[0]
  }
  if (gold.eq(getNormalPlanet(initialPlanetIds[1]).priceGold) && userPlanetCount === 1) {
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
