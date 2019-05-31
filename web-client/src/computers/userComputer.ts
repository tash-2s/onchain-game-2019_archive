import BN from "bn.js"

import { UserState } from "../types/routed/userTypes"
import { NormalPlanetsData, initialPlanetIds, getNormalPlanet } from "../data/planets"
import { OngoingGoldCalculator } from "../models/OngoingGoldCalculator"
import { UserPlanetsMapUtil } from "../models/UserPlanetsMapUtil"
import {
  computeUserNormalPlanetParams,
  computeUserNormalPlanetRankStatuses
} from "./userNormalPlanetComputer"

type ComputedUserState = ReturnType<typeof computeUserState>
export type ComputedTargetUserState = NonNullable<ComputedUserState["targetUser"]>

export const computeUserState = (state: UserState, now: number) => {
  if (!state.targetUser) {
    return { targetUser: null }
  }

  const { userNormalPlanets, population, goldPower, techPower } = computeUserNormalPlanetParams(
    state.targetUser.userNormalPlanets
  )

  const { goldPerSec, ongoingGold } = computeGold(population, goldPower, state.targetUser.gold, now)

  const computedUserPlanets = computeUserNormalPlanetRankStatuses(
    userNormalPlanets,
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
