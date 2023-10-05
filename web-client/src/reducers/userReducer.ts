import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UserActions } from "../actions/UserActions"
import { UserActionsForInGameAsterisk } from "../actions/UserActionsForInGameAsterisk"
import { UserActionsForTradableAsterisk } from "../actions/UserActionsForTradableAsterisk"
import { AsteriskKind, asteriskKinds, asteriskKindNumToKind } from "../constants"
import {
  TradableAsteriskToken,
  ReturnTypeOfGetUserTradableAsterisks,
  ReturnTypeOfGetUserInGameAsterisks
} from "../chain/clients/loom/organized"

export interface UserState {
  targetUser: TargetUserState | null
}

export interface TargetUserState {
  address: string
  gold: { confirmed: string; confirmedAt: number }
  userInGameAsterisks: Array<UserInGameAsterisk>
  userTradableAsterisks: Array<UserTradableAsterisk>
  tradableAsteriskToken: {
    ethTokens: Array<TradableAsteriskToken>
    loomTokens: Array<TradableAsteriskToken>
    needsTransferResume: boolean
    buyTx: string | null
    transferToLoomTx: string | null
    transferToEthTx: string | null
  } | null
}

export interface UserInGameAsterisk {
  id: string
  inGameAsteriskId: number
  rank: number
  createdAt: number
  rankupedAt: number
  axialCoordinateQ: number
  axialCoordinateR: number
}

export interface UserTradableAsterisk {
  id: string // short id, not token id
  kind: AsteriskKind
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
        ...buildUser(payload.inGame.user),
        address: payload.address,
        userInGameAsterisks: payload.inGame.userInGameAsterisks,
        userTradableAsterisks: payload.tradable.userTradableAsterisks,
        tradableAsteriskToken: null
      }
    }))
    .case(UserActions.clearTargetUser, state => ({
      ...state,
      targetUser: null
    }))
    .case(UserActionsForInGameAsterisk.setAsterisksToMap, buildStateFromUserAndUserInGameAsterisks)
    .case(
      UserActionsForInGameAsterisk.rankupUserAsterisks,
      buildStateFromUserAndUserInGameAsterisks
    )
    .case(
      UserActionsForInGameAsterisk.removeUserAsterisks,
      buildStateFromUserAndUserInGameAsterisks
    )
    .case(UserActionsForTradableAsterisk.setTargetUserAsteriskTokens, (state, payload) => {
      if (!state.targetUser) {
        throw new Error("invalid state")
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          tradableAsteriskToken: {
            ethTokens: payload.ethTokens,
            loomTokens: payload.loomTokens,
            needsTransferResume: payload.needsTransferResume,
            buyTx: state.targetUser.tradableAsteriskToken
              ? state.targetUser.tradableAsteriskToken.buyTx
              : null,
            transferToLoomTx: state.targetUser.tradableAsteriskToken
              ? state.targetUser.tradableAsteriskToken.transferToLoomTx
              : null,
            transferToEthTx: state.targetUser.tradableAsteriskToken
              ? state.targetUser.tradableAsteriskToken.transferToEthTx
              : null
          }
        }
      }
    })
    .case(UserActionsForTradableAsterisk.clearTargetUserAsteriskTokens, state => {
      if (!state.targetUser) {
        return { ...state }
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          tradableAsteriskToken: null
        }
      }
    })
    .case(
      UserActionsForTradableAsterisk.setAsteriskTokenToMap,
      buildStateFromUserAndUserTradableAsterisks
    )
    .case(
      UserActionsForTradableAsterisk.removeUserAsteriskFromMap,
      buildStateFromUserAndUserTradableAsterisks
    )
    .case(UserActionsForTradableAsterisk.buyAsteriskToken, (state, payload) => {
      if (!state.targetUser || !state.targetUser.tradableAsteriskToken) {
        throw new Error("invalid state")
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          tradableAsteriskToken: {
            ...state.targetUser.tradableAsteriskToken,
            buyTx: payload
          }
        }
      }
    })
    .case(UserActionsForTradableAsterisk.transferAsteriskTokenToLoom, (state, payload) => {
      if (!state.targetUser || !state.targetUser.tradableAsteriskToken) {
        throw new Error("invalid state")
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          tradableAsteriskToken: {
            ...state.targetUser.tradableAsteriskToken,
            transferToLoomTx: payload
          }
        }
      }
    })
    .case(UserActionsForTradableAsterisk.transferAsteriskTokenToEth, (state, payload) => {
      if (!state.targetUser || !state.targetUser.tradableAsteriskToken) {
        throw new Error("invalid state")
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          tradableAsteriskToken: {
            ...state.targetUser.tradableAsteriskToken,
            needsTransferResume: false,
            transferToEthTx: payload
          }
        }
      }
    })
    .build()

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

const buildStateFromUserAndUserInGameAsterisks = (
  state: UserState,
  payload: ReturnTypeOfGetUserInGameAsterisks
): UserState => {
  if (!state.targetUser) {
    throw new Error("invalid state")
  }

  return {
    ...state,
    targetUser: {
      ...state.targetUser,
      ...buildUser(payload.user),
      userInGameAsterisks: payload.userInGameAsterisks
    }
  }
}

const buildStateFromUserAndUserTradableAsterisks = (
  state: UserState,
  payload: ReturnTypeOfGetUserTradableAsterisks
): UserState => {
  if (!state.targetUser) {
    throw new Error("invalid state")
  }

  return {
    ...state,
    targetUser: {
      ...state.targetUser,
      ...buildUser(payload.user),
      userTradableAsterisks: payload.userTradableAsterisks,
      tradableAsteriskToken: null
    }
  }
}
