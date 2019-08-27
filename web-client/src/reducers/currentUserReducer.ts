import { reducerWithInitialState } from "typescript-fsa-reducers"

import { CurrentUserActions } from "../actions/CurrentUserActions"
import { LoomWeb3 } from "../misc/loom"

const createInitialState = () => {
  return {
    loomAddress: LoomWeb3.isGuest ? null : LoomWeb3.address,
    ethAddress: LoomWeb3.isGuest ? null : LoomWeb3.web3FromAddress,
    logining: false,
    blocked: false
  }
}

export type CurrentUserState = ReturnType<typeof createInitialState>

export const createCurrentUserReducer = () =>
  reducerWithInitialState(createInitialState())
    .case(CurrentUserActions.login, (state, payload) => ({
      ...state,
      loomAddress: payload ? payload.loomAddress : null,
      ethAddress: payload ? payload.ethAddress : null,
      logining: !payload
    }))
    .case(CurrentUserActions.block, state => ({
      ...state,
      blocked: true
    }))
    .build()
