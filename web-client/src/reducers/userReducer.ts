import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UserActions, GetUserResponse } from "../actions/UserActions"

export interface UserState {
  targetUser: TargetUserState | null
}

interface TargetUserState {
  address: string
  gold: { confirmed: string; confirmedAt: number }
  userNormalPlanets: Array<UserNormalPlanet>
  specialPlanetTokens: { eth: Array<string>; loom: Array<string> } | null
  specialPlanetTokenBuyTx: string | null
  specialPlanetTokenTransferToLoomTx: string | null
}

export interface UserNormalPlanet {
  id: string
  normalPlanetId: number
  rank: number
  createdAt: number
  rankupedAt: number
  axialCoordinateQ: number
  axialCoordinateR: number
}

const initialState: UserState = {
  targetUser: null
}

export const createUserReducer = () =>
  reducerWithInitialState(initialState)
    .case(UserActions.setTargetUser, (state, payload) => ({
      ...state,
      targetUser: {
        ...restructureUserFromResponse(payload.response),
        address: payload.address,
        specialPlanetTokens: null,
        specialPlanetTokenBuyTx: null,
        specialPlanetTokenTransferToLoomTx: null
      }
    }))
    .case(UserActions.setTargetUserSpecialPlanetTokens, (state, payload) => {
      if (!state.targetUser) {
        return { ...state }
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          specialPlanetTokens: payload
        }
      }
    })
    .case(UserActions.clearTargetUser, state => ({
      ...state,
      targetUser: null
    }))
    .case(UserActions.getPlanet, buildStateFromGetUserResponse)
    .case(UserActions.rankupUserPlanet, buildStateFromGetUserResponse)
    .case(UserActions.removeUserPlanet, buildStateFromGetUserResponse)
    .case(UserActions.buySpecialPlanetToken, (state, payload) => {
      if (!state.targetUser) {
        return { ...state }
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          specialPlanetTokenBuyTx: payload
        }
      }
    })
    .case(UserActions.transferTokenToLoom, (state, payload) => {
      if (!state.targetUser) {
        return { ...state }
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          specialPlanetTokenTransferToLoomTx: payload
        }
      }
    })
    .build()

const buildStateFromGetUserResponse = (
  state: UserState,
  payload: { address: string; response: GetUserResponse }
): UserState => {
  if (!state.targetUser) {
    return { ...state }
  }
  return {
    ...state,
    targetUser: {
      ...state.targetUser,
      ...restructureUserFromResponse(payload.response),
      address: payload.address
    }
  }
}

const strToNum = (str: string): number => parseInt(str, 10)

const restructureUserFromResponse = (
  response: GetUserResponse
): Pick<TargetUserState, "gold" | "userNormalPlanets"> => {
  const confirmedGold = response[0]
  const goldConfirmedAt = response[1]
  const unpIds = response[2]
  const unpRanks = response[3]
  const unpTimes = response[4]
  const unpAxialCoordinates = response[5]

  const unps: Array<UserNormalPlanet> = []
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
