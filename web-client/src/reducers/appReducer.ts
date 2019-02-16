import { reducerWithInitialState } from "typescript-fsa-reducers"
import { AppActions } from "../actions/AppActions"
import { AppState } from "../types/appTypes"

const initialState: AppState = {}

export const createAppReducer = () => reducerWithInitialState(initialState).build()
