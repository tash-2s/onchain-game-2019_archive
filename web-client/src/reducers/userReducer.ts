import { reducerWithInitialState } from "typescript-fsa-reducers"

import {
  UserActions,
  UserAllExceptForTokens,
  UserAllExceptForEthTokens
} from "../actions/UserActions"
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
  id: string // short id, not token id
  kind: PlanetKind
  originalParamCommonLogarithm: number
  createdAt: number
  rankupedAt: number
  axialCoordinateQ: number
  axialCoordinateR: number
  artSeed: string
}

interface SpecialPlanetToken {
  id: string // token id
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
        ...restructureFromUserAllResponse(payload.response),
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
            ethTokens: restructureTokens(payload.ethTokenIds, payload.ethTokenFields),
            loomTokens: restructureTokens(payload.loomTokenIds, payload.loomTokenFields),
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
    .case(UserActions.getPlanet, buildStateFromUserAllExceptForTokens)
    .case(UserActions.rankupUserPlanet, buildStateFromUserAllExceptForTokens)
    .case(UserActions.removeUserPlanet, buildStateFromUserAllExceptForTokens)
    .case(UserActions.setSpecialPlanetTokenToMap, buildStateFromUserAllExceptForEthTokens)
    .case(UserActions.removeUserSpecialPlanetFromMap, buildStateFromUserAllExceptForEthTokens)
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

const buildStateFromUserAllExceptForTokens = (
  state: UserState,
  payload: UserAllExceptForTokens
): UserState => {
  if (!state.targetUser) {
    return { ...state }
  }
  return {
    ...state,
    targetUser: {
      ...state.targetUser,
      ...restructureFromUserAllResponse(payload.response),
      address: payload.address
    }
  }
}

const buildStateFromUserAllExceptForEthTokens = (
  state: UserState,
  payload: UserAllExceptForEthTokens
) => {
  if (!state.targetUser || !state.targetUser.specialPlanetToken) {
    return { ...state }
  }

  return {
    ...state,
    targetUser: {
      ...state.targetUser,
      ...restructureFromUserAllResponse(payload.response),
      address: payload.address,
      specialPlanetToken: {
        ...state.targetUser.specialPlanetToken,
        loomTokens: restructureTokens(payload.loomTokenIds, payload.loomTokenFields)
      }
    }
  }
}

const strToNum = (str: string): number => parseInt(str, 10)

const restructureFromUserAllResponse = (
  response: UserAllExceptForTokens["response"]
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
  let iNormal = 0
  let counterNormal = 0

  while (iNormal < unpRanks.length) {
    unps.push({
      id: unpIds[counterNormal],
      normalPlanetId: strToNum(unpIds[counterNormal + 1]),
      rank: strToNum(unpRanks[iNormal]),
      rankupedAt: strToNum(unpTimes[counterNormal]),
      createdAt: strToNum(unpTimes[counterNormal + 1]),
      axialCoordinateQ: strToNum(unpAxialCoordinates[counterNormal]),
      axialCoordinateR: strToNum(unpAxialCoordinates[counterNormal + 1])
    })

    iNormal += 1
    counterNormal += 2
  }

  const usps: Array<UserSpecialPlanet> = []
  let iSpecial = 0
  let counterSpecial = 0

  while (iSpecial < uspIds.length) {
    usps.push({
      id: uspIds[iSpecial],
      kind: planetKinds[strToNum(uspKinds[iSpecial]) - 1],
      originalParamCommonLogarithm: strToNum(uspParams[iSpecial]),
      rankupedAt: strToNum(uspTimes[counterSpecial]),
      createdAt: strToNum(uspTimes[counterSpecial + 1]),
      axialCoordinateQ: strToNum(uspCoordinates[counterSpecial]),
      axialCoordinateR: strToNum(uspCoordinates[counterSpecial + 1]),
      artSeed: uspArtSeeds[iSpecial]
    })

    iSpecial += 1
    counterSpecial += 2
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
