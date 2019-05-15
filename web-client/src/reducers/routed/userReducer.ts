import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UserActions, GetUserResponse } from "../../actions/routed/UserActions"
import { UserState, TargetUserState } from "../../types/routed/userTypes"

const initialState: UserState = {
  targetUser: null
}

export const createUserReducer = () =>
  reducerWithInitialState(initialState)
    .case(UserActions.setTargetUser, (state, payload) => ({
      ...state,
      targetUser: {
        ...restructureUserFromResponse(payload.response),
        address: payload.address
      }
    }))
    .case(UserActions.clearTargetUser, state => ({
      ...state,
      targetUser: null
    }))
    .case(UserActions.getPlanet, (state, payload) => ({
      ...state,
      targetUser: {
        ...restructureUserFromResponse(payload.response),
        address: payload.address
      }
    }))
    .case(UserActions.rankupUserNormalPlanet, (state, payload) => ({
      ...state,
      targetUser: {
        ...restructureUserFromResponse(payload.response),
        address: payload.address
      }
    }))
    .case(UserActions.removeUserNormalPlanet, (state, payload) => ({
      ...state,
      targetUser: {
        ...restructureUserFromResponse(payload.response),
        address: payload.address
      }
    }))
    .build()

const strToNum = (str: string): number => parseInt(str, 10)
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

const restructureUserFromResponse = (
  response: GetUserResponse
): Omit<TargetUserState, "address"> => {
  const confirmedGold = response[0]
  const goldConfirmedAt = response[1]
  const unpIds = response[2]
  const unpRanks = response[3]
  const unpTimes = response[4]
  const unpAxialCoordinates = response[5]

  const unps: TargetUserState["userNormalPlanets"] = []
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
