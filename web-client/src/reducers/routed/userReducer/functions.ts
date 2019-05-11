import { GetUserResponse } from "../../../actions/routed/UserActions"
import { UserState, TargetUserState } from "../../../types/routed/userTypes"
import { getNormalPlanet } from "../../../data/planets"
import BN from "bn.js"

const strToNum = (str: string): number => parseInt(str, 10)

interface _User {
  gold: { confirmed: string; confirmedAt: number }
  userNormalPlanets: Array<{
    id: string
    normalPlanetId: number
    rank: number
    rankupedAt: number
    createdAt: number
    axialCoordinateQ: number
    axialCoordinateR: number
  }>
}

export const restructureUserFromResponse = (response: GetUserResponse): _User => {
  const confirmedGold = response[0]
  const goldConfirmedAt = response[1]
  const unpIds = response[2]
  const unpRanks = response[3]
  const unpTimes = response[4]
  const unpAxialCoordinates = response[5]

  const unps: _User["userNormalPlanets"] = []
  let i = 0
  let counter = 0

  while (i < unpRanks.length) {
    unps.push({
      id: unpIds[counter],
      normalPlanetId: strToNum(unpIds[counter + 1]),
      rank: strToNum(unpRanks[i]),
      rankupedAt: strToNum(unpTimes[counter]),
      createdAt: strToNum(unpTimes[counter + 1]),
      axialCoordinateQ: strToNum(unpAxialCoordinates[counter]),
      axialCoordinateR: strToNum(unpAxialCoordinates[counter + 1])
    })

    i += 1
    counter += 2
  }
  return {
    gold: {
      confirmed: confirmedGold,
      confirmedAt: strToNum(goldConfirmedAt)
    },
    userNormalPlanets: unps
  }
}

export const buildTargetUser = (
  address: string,
  user: _User,
  tab: TargetUserState["selectedUserPlanetsTab"]
): TargetUserState => {
  const [userPlanets, population, goldPower, techPower] = processUserNormalPlanets(
    user.userNormalPlanets
  )

  return {
    address: address,
    gold: user.gold,
    userNormalPlanets: userPlanets,
    population: population.toString(),
    goldPower: goldPower.toString(),
    techPower: techPower.toString(),
    goldPerSec: population.mul(goldPower).toString(),
    normalPlanetIdToGet: null,
    selectedUserPlanetsTab: tab
  }
}

const processUserNormalPlanets = (
  userPlanets: _User["userNormalPlanets"]
): [TargetUserState["userNormalPlanets"], BN, BN, BN] => {
  const newUserPlanets: TargetUserState["userNormalPlanets"] = []
  let population = new BN(0)
  let goldPower = new BN(0)
  let techPower = new BN(0)

  userPlanets.forEach(up => {
    const p = getNormalPlanet(up.normalPlanetId)
    if (p.kind === "magic") {
      throw new Error("magic planets are not supported yet")
    }

    const previousRank = new BN(up.rank - 1)
    const param = new BN(10)
      .pow(new BN(p.param))
      .mul(new BN(13).pow(previousRank))
      .div(new BN(10).pow(previousRank))

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

    const newUp = {
      ...up,
      paramMemo: param.toString()
    }

    newUserPlanets.push(newUp)
  })

  return [newUserPlanets, population, goldPower, techPower]
}

export const currentTabFromState = (
  state: UserState
): TargetUserState["selectedUserPlanetsTab"] => {
  if (!state.targetUser) {
    return "map"
  }

  return state.targetUser.selectedUserPlanetsTab
}
