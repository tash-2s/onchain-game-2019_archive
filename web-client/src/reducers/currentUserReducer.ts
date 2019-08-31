import { reducerWithInitialState } from "typescript-fsa-reducers"

import { CurrentUserActions } from "../actions/CurrentUserActions"
import { chains } from "../misc/chains"

const createInitialState = () => {
  return {
    loomAddress: chains.loom.address,
    ethAddress: chains.eth.address,
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
