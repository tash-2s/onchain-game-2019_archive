import { reducerWithInitialState } from "typescript-fsa-reducers"
import { AppActions } from "../actions/AppActions"
import { AppState } from "../types/appTypes"

const initialState: AppState = {
  test: "",
  routeId: "/"
}

export const appReducer = reducerWithInitialState(initialState)
  .case(AppActions.test, state => {
    return { ...state, test: "abc" }
  })
  .case(AppActions.changeRoute, (state, payload) => {
    return { ...state, routeId: payload }
  })
  .build()
