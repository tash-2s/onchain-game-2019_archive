import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UserActions, UserAllResponse } from "../actions/UserActions"
import { PlanetKind, planetKinds } from "../constants"

export interface UserState {
  targetUser: TargetUserState | null
}

export interface TargetUserState {
  address: string
  gold: { confirmed: string; confirmedAt: number }
  userNormalPlanets: Array<UserNormalPlanet>
  userSpecialPlanets: Array<UserSpecialPlanet>
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

export interface UserSpecialPlanet {
  id: string
  kind: PlanetKind
  originalParamCommonLogarithm: number
  createdAt: number
  rankupedAt: number
  axialCoordinateQ: number
  axialCoordinateR: number
  artSeed: string
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
            ethTokens: restructureTokens(payload.eth, payload.ethFields),
            loomTokens: restructureTokens(payload.loom, payload.loomFields),
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
    .case(UserActions.setSpecialPlanetTokenToMap, (state, payload) => {
      if (!state.targetUser || !state.targetUser.specialPlanetToken) {
        return { ...state }
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          ...restructureUserFromResponse(payload.response),
          address: payload.address,
          specialPlanetToken: {
            ...state.targetUser.specialPlanetToken,
            loomTokens: restructureTokens(payload.loomTokenIds, payload.loomFields)
          }
        }
      }
    })
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
  payload: { address: string; response: UserAllResponse }
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
  response: UserAllResponse
): Pick<TargetUserState, "gold" | "userNormalPlanets" | "userSpecialPlanets"> => {
  const confirmedGold = response[0][0]
  const goldConfirmedAt = response[0][1]
  const unpIds = response[0][2]
  const unpRanks = response[0][3]
  const unpTimes = response[0][4]
  const unpAxialCoordinates = response[0][5]
  const uspIds = response[1][0]
  const uspKinds = response[1][1]
  const uspParams = response[1][2]
  const uspTimes = response[1][3]
  const uspCoordinates = response[1][4]
  const uspArtSeeds = response[1][5]

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

  const usps: Array<UserSpecialPlanet> = []
  let iS = 0
  let counterS = 0

  while (iS < uspIds.length) {
    usps.push({
      id: uspIds[iS],
      kind: planetKinds[strToNum(uspKinds[iS]) - 1],
      originalParamCommonLogarithm: strToNum(uspParams[iS]),
      rankupedAt: strToNum(uspTimes[counterS]),
      createdAt: strToNum(uspTimes[counterS + 1]),
      axialCoordinateQ: strToNum(uspCoordinates[counterS]),
      axialCoordinateR: strToNum(uspCoordinates[counterS + 1]),
      artSeed: uspArtSeeds[iS]
    })

    iS += 1
    counterS += 2
  }

  return {
    gold: {
      confirmed: confirmedGold,
      confirmedAt: strToNum(goldConfirmedAt)
    },
    userNormalPlanets: unps,
    userSpecialPlanets: usps
  }
}

const restructureTokens = (tokenIds: Array<string>, tokenFields: Array<Array<string>>) => {
  return tokenFields.map((fields, i) => ({
    id: tokenIds[i],
    shortId: fields[0],
    version: strToNum(fields[1]),
    kind: planetKinds[strToNum(fields[2]) - 1],
    originalParamCommonLogarithm: strToNum(fields[3]),
    artSeed: fields[4]
  }))
}
