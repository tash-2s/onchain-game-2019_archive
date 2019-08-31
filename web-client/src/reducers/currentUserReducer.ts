import { reducerWithInitialState } from "typescript-fsa-reducers"

import { CurrentUserActions } from "../actions/CurrentUserActions"
import { chain } from "../misc/chain"

const createInitialState = () => {
  return {
    loomAddress: chain.loom.address,
    ethAddress: null as string | null, // TODO
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
