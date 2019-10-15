import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UserActions } from "../actions/UserActions"
import { UserActionsForNormalPlanet } from "../actions/UserActionsForNormalPlanet"
import { UserActionsForSpecialPlanet } from "../actions/UserActionsForSpecialPlanet"
import { PlanetKind, planetKinds, planetKindNumToKind } from "../constants"
import {
  SpecialPlanetToken,
  ReturnTypeOfGetUserSpecialPlanets,
  ReturnTypeOfGetUserNormalPlanets
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

const initialState: UserState = {
  targetUser: null
}

export const createUserReducer = () =>
  reducerWithInitialState(initialState)
    .case(UserActions.setTargetUser, (state, payload) => ({
      ...state,
      targetUser: {
        ...buildUser(payload.normal.user),
        address: payload.address,
        userNormalPlanets: payload.normal.userNormalPlanets,
        userSpecialPlanets: payload.special.userSpecialPlanets,
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
            ethTokens: payload.ethTokens,
            loomTokens: payload.loomTokens,
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

const buildUser = (obj: {
  confirmedGold: string
  goldConfirmedAt: number
}): Pick<TargetUserState, "gold"> => {
  return {
    gold: {
      confirmed: obj.confirmedGold,
      confirmedAt: obj.goldConfirmedAt
    }
  }
}

const buildStateFromUserAndUserNormalPlanets = (
  state: UserState,
  payload: ReturnTypeOfGetUserNormalPlanets
): UserState => {
  if (!state.targetUser) {
    throw new Error("invalid state")
  }

  return {
    ...state,
    targetUser: {
      ...state.targetUser,
      ...buildUser(payload.user),
      userNormalPlanets: payload.userNormalPlanets
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
      ...buildUser(payload.user),
      userSpecialPlanets: payload.userSpecialPlanets,
      specialPlanetToken: null
    }
  }
}
