import { GetUserResponse } from "../../../actions/routed/UserActions"
import { UserState, TargetUserState } from "../../../types/routed/userTypes"
import { getNormalPlanet } from "../../../data/planets"

const strToNum = (str: string): number => parseInt(str, 10)

interface _User {
  gold: { confirmed: number; confirmedAt: number }
  userNormalPlanets: Array<{
    id: number
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
      id: strToNum(unpIds[counter]),
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
      confirmed: strToNum(confirmedGold),
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
    population: population,
    goldPower: goldPower,
    techPower: techPower,
    goldPerSec: population * goldPower,
    normalPlanetIdToGet: null,
    selectedUserPlanetsTab: tab
  }
}

const processUserNormalPlanets = (
  userPlanets: _User["userNormalPlanets"]
): [TargetUserState["userNormalPlanets"], number, number, number] => {
  const newUserPlanets: TargetUserState["userNormalPlanets"] = []
  let population = 0
  let goldPower = 0
  let techPower = 0

  userPlanets.forEach(up => {
    const p = getNormalPlanet(up.normalPlanetId)

    const rate = up.rank
    let param = 0

    switch (p.kind) {
      case "residence":
        param = 10 ** p.param * rate
        population += param
        break
      case "goldvein":
        param = 10 ** p.param * rate
        goldPower += param
        break
      case "technology":
        param = 10 ** p.param * rate
        techPower += param
        break
    }

    const newUp = {
      ...up,
      rateMemo: rate,
      paramMemo: param
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
