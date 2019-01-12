import { reducerWithInitialState } from "typescript-fsa-reducers"
import { AppActions } from "../actions/AppActions"
import { RouteId, AppState } from "../types/appTypes"
import { history, convertPathnameToRouteId } from "../utils/history"

const getInitialRouteId = (): RouteId => {
  return convertPathnameToRouteId(history.location.pathname)
}

const initialState: AppState = {
  test: "",
  routeId: getInitialRouteId()
}

export const appReducer = reducerWithInitialState(initialState)
  .case(AppActions.test, state => {
    return { ...state, test: "abc" }
  })
  .case(AppActions.changeRoute, (state, payload) => {
    return { ...state, routeId: payload }
  })
  .build()
