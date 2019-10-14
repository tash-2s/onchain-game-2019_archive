import { reducerWithInitialState } from "typescript-fsa-reducers"

import {
  UserActions,
  UserResponse,
  UserNormalPlanetsResponse,
  UserAndUserNormalPlanetsResponse
} from "../actions/UserActions"
import { UserActionsForNormalPlanet } from "../actions/UserActionsForNormalPlanet"
import { UserActionsForSpecialPlanet } from "../actions/UserActionsForSpecialPlanet"
import { PlanetKind, planetKinds, planetKindNumToKind } from "../constants"
import {
  SpecialPlanetTokenFields,
  ReturnTypeOfGetUserSpecialPlanets
} from "../chain/clients/loom/organized"

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
  paramRate: number
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
  paramRate: number
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
        ...buildUser(payload.user),
        address: payload.address,
        userNormalPlanets: buildUserNormalPlanets(payload.userNormalPlanets),
        userSpecialPlanets: payload.userSpecialPlanets.userSpecialPlanets,
        specialPlanetToken: null
      }
    }))
    .case(UserActions.clearTargetUser, state => ({
      ...state,
      targetUser: null
    }))
    .case(UserActionsForNormalPlanet.setPlanetToMap, buildStateFromUserAndUserNormalPlanets)
    .case(UserActionsForNormalPlanet.rankupUserPlanet, buildStateFromUserAndUserNormalPlanets)
    .case(UserActionsForNormalPlanet.removeUserPlanet, buildStateFromUserAndUserNormalPlanets)
    .case(UserActionsForSpecialPlanet.setTargetUserPlanetTokens, (state, payload) => {
      if (!state.targetUser) {
        throw new Error("invalid state")
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          specialPlanetToken: {
            ethTokens: buildTokens(payload.ethTokenIds, payload.ethTokenFields),
            loomTokens: buildTokens(payload.loomTokenIds, payload.loomTokenFields),
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
    .case(UserActionsForSpecialPlanet.clearTargetUserPlanetTokens, state => {
      if (!state.targetUser) {
        throw new Error("invalid state")
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          specialPlanetToken: null
        }
      }
    })
    .case(UserActionsForSpecialPlanet.setPlanetTokenToMap, buildStateFromUserAndUserSpecialPlanets)
    .case(
      UserActionsForSpecialPlanet.removeUserPlanetFromMap,
      buildStateFromUserAndUserSpecialPlanets
    )
    .case(UserActionsForSpecialPlanet.buyPlanetToken, (state, payload) => {
      if (!state.targetUser || !state.targetUser.specialPlanetToken) {
        throw new Error("invalid state")
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
    .case(UserActionsForSpecialPlanet.transferPlanetTokenToLoom, (state, payload) => {
      if (!state.targetUser || !state.targetUser.specialPlanetToken) {
        throw new Error("invalid state")
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
    .case(UserActionsForSpecialPlanet.transferPlanetTokenToEth, (state, payload) => {
      if (!state.targetUser || !state.targetUser.specialPlanetToken) {
        throw new Error("invalid state")
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

const strToNum = (str: string) => parseInt(str, 10)

const buildUser = (response: UserResponse): Pick<TargetUserState, "gold"> => {
  return {
    gold: {
      confirmed: response[0],
      confirmedAt: strToNum(response[1])
    }
  }
}

const buildUserNormalPlanets = (
  response: UserNormalPlanetsResponse
): TargetUserState["userNormalPlanets"] => {
  const unpIds = response[0]
  const unpRanks = response[1]
  const unpTimes = response[2]
  const unpAxialCoordinates = response[3]

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

  return unps
}

const buildTokens = (
  tokenIds: Array<string>,
  tokenFields: Array<SpecialPlanetTokenFields>
): Array<SpecialPlanetToken> => {
  return tokenFields.map((fields, i) => {
    return {
      id: tokenIds[i],
      shortId: fields.shortId,
      version: fields.version,
      kind: fields.kind,
      paramRate: fields.paramRate,
      artSeed: fields.artSeed
    }
  })
}

const buildStateFromUserAndUserNormalPlanets = (
  state: UserState,
  payload: UserAndUserNormalPlanetsResponse
): UserState => {
  if (!state.targetUser) {
    throw new Error("invalid state")
  }

  return {
    ...state,
    targetUser: {
      ...state.targetUser,
      ...buildUser(payload.user),
      userNormalPlanets: buildUserNormalPlanets(payload.userNormalPlanets)
    }
  }
}

const buildStateFromUserAndUserSpecialPlanets = (
  state: UserState,
  payload: ReturnTypeOfGetUserSpecialPlanets
): UserState => {
  if (!state.targetUser) {
    throw new Error("invalid state")
  }

  return {
    ...state,
    targetUser: {
      ...state.targetUser,
      gold: { confirmed: payload.user.confirmedGold, confirmedAt: payload.user.goldConfirmedAt },
      userSpecialPlanets: payload.userSpecialPlanets,
      specialPlanetToken: null
    }
  }
}
