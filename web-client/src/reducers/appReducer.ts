import { reducerWithInitialState } from "typescript-fsa-reducers"
import { AppActions } from "../actions/AppActions"
import { AppState } from "../types/appTypes"

const initialState: AppState = { balance: -1 }

export const createAppReducer = () =>
  reducerWithInitialState(initialState)
    .case(AppActions.setBalance, (state, payload) => {
      return { balance: payload }
    })
    .build()
