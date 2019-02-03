import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UsersActions } from "../../actions/routed/UsersActions"
import { UsersState } from "../../types/routed/usersTypes"

const initialState: UsersState = {
  users: []
}

export const createUsersReducer = () =>
  reducerWithInitialState(initialState)
    .case(UsersActions.setUsers, (state, payload) => ({
      ...state,
      users: payload
    }))
    .build()
