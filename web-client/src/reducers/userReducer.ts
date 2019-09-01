import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UserActions, GetUserResponse } from "../actions/UserActions"
import { PlanetKind, planetKinds } from "../constants"

export interface UserState {
  targetUser: TargetUserState | null
}

export interface TargetUserState {
  address: string
  gold: { confirmed: string; confirmedAt: number }
  userNormalPlanets: Array<UserNormalPlanet>
  specialPlanetToken: {
    ethTokens: Array<SpecialPlanetToken>
    loomTokens: Array<SpecialPlanetToken>
    needsTransferResume: boolean
    buyTx: string | null
    transferToLoomTx: string | null
    transferToEthTx: string | null
  } | null
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

interface SpecialPlanetToken {
  id: string
  shortId: string
  version: number
  kind: PlanetKind
  originalParamCommonLogarithm: number
  artSeed: string
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
        specialPlanetToken: null
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
          specialPlanetToken: {
            ethTokens: payload.ethFields.map((fs, i) => ({
              id: payload.eth[i],
              shortId: fs[0],
              version: strToNum(fs[1]),
              kind: planetKinds[strToNum(fs[2]) - 1],
              originalParamCommonLogarithm: strToNum(fs[3]),
              artSeed: fs[4]
            })),
            loomTokens: payload.loomFields.map((fs, i) => ({
              id: payload.loom[i],
              shortId: fs[0],
              version: strToNum(fs[1]),
              kind: planetKinds[strToNum(fs[2]) - 1],
              originalParamCommonLogarithm: strToNum(fs[3]),
              artSeed: fs[4]
            })),
            needsTransferResume: payload.needsTransferResume,
            buyTx: state.targetUser.specialPlanetToken
              ? state.targetUser.specialPlanetToken.buyTx
              : null,
            transferToLoomTx: state.targetUser.specialPlanetToken
              ? state.targetUser.specialPlanetToken.transferToLoomTx
              : null,
            transferToEthTx: state.targetUser.specialPlanetToken
              ? state.targetUser.specialPlanetToken.transferToEthTx
              : null
          }
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
      if (!state.targetUser || !state.targetUser.specialPlanetToken) {
        return { ...state }
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          specialPlanetToken: {
            ...state.targetUser.specialPlanetToken,
            buyTx: payload
          }
        }
      }
    })
    .case(UserActions.transferSpecialPlanetTokenToLoom, (state, payload) => {
      if (!state.targetUser || !state.targetUser.specialPlanetToken) {
        return { ...state }
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          specialPlanetToken: {
            ...state.targetUser.specialPlanetToken,
            transferToLoomTx: payload
          }
        }
      }
    })
    .case(UserActions.transferSpecialPlanetTokenToEth, (state, payload) => {
      if (!state.targetUser || !state.targetUser.specialPlanetToken) {
        return { ...state }
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          specialPlanetToken: {
            ...state.targetUser.specialPlanetToken,
            needsTransferResume: false,
            transferToEthTx: payload
          }
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
