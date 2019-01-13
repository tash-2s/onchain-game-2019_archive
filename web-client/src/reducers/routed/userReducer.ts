import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UserActions } from "../../actions/routed/UserActions"
import { UserState } from "../../types/routed/userTypes"

const initialState: UserState = {}

export const userReducer = reducerWithInitialState(initialState).build()
