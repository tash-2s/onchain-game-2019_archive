import { reducerWithInitialState } from "typescript-fsa-reducers"

import { CurrentUserActions } from "../actions/CurrentUserActions"
import { chains } from "../chain/chains"

const createInitialState = () => {
  return {
    loomAddress: chains.loom.address,
    ethAddress: chains.eth.address,
    logining: false
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
    .build()
