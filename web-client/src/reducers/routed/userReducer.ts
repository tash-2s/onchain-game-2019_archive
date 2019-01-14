import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UserActions } from "../../actions/routed/UserActions"
import { UserState } from "../../types/routed/userTypes"

const initialState: UserState = {
  targetUser: null
}

export const userReducer = reducerWithInitialState(initialState)
  .case(UserActions.getTargetUser.started, (state, params) => ({
    ...state
  }))
  // todo: error handling
  .case(UserActions.getTargetUser.failed, (state, { params, error }) => ({
    ...state
  }))
  .case(UserActions.getTargetUser.done, (state, { params, result }) => ({
    ...state,
    targetUser: { id: result.id }
  }))
  .build()
