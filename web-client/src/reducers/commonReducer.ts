import { reducerWithInitialState } from "typescript-fsa-reducers"
import { CommonActions } from "../actions/CommonActions"
import { CommonState } from "../types/commonTypes"

const initialState: CommonState = {
  currentUser: "todo user info"
}

export const commonReducer = reducerWithInitialState(initialState).build()
