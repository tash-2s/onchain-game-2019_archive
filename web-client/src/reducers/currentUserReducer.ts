import { reducerWithInitialState } from "typescript-fsa-reducers"

import { CurrentUserActions } from "../actions/CurrentUserActions"
import { LoomWeb3 } from "../misc/loom"

const createInitialState = () => {
  return {
    address: LoomWeb3.isGuest ? null : LoomWeb3.loginAddress,
    logining: false
  }
}

export type CurrentUserState = ReturnType<typeof createInitialState>

export const createCurrentUserReducer = () =>
  reducerWithInitialState(createInitialState())
    .case(CurrentUserActions.login, (state, payload) => ({
      ...state,
      address: payload,
      logining: !payload
    }))
    .build()
