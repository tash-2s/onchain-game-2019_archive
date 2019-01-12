import { reducerWithInitialState } from "typescript-fsa-reducers"
import { AppActions } from "../actions/AppActions"
import { RouteId, AppState, RouteIdWithParams } from "../types/appTypes"
import { history, convertPathnameToRouteIdWithParams } from "../utils/history"

const getInitialRoute = (): RouteIdWithParams => {
  return convertPathnameToRouteIdWithParams(history.location.pathname)
}

const initialState: AppState = {
  test: "",
  route: getInitialRoute()
}

export const appReducer = reducerWithInitialState(initialState)
  .case(AppActions.test, state => {
    return { ...state, test: "abc" }
  })
  .case(AppActions.changeRoute, (state, payload) => {
    return { ...state, route: payload }
  })
  .build()
