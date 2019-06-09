import { reducerWithInitialState } from "typescript-fsa-reducers"
import { AppActions } from "../actions/AppActions"

const initialState = {}

export const createAppReducer = () => reducerWithInitialState(initialState).build()
