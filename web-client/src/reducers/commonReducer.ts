import { reducerWithInitialState } from "typescript-fsa-reducers"
import { CommonActions } from "../actions/CommonActions"
import { CommonState, RouteIdWithParams } from "../types/commonTypes"
import { history, convertPathnameToRouteIdWithParams } from "../utils/route"

const getInitialRoute = (): RouteIdWithParams => {
  return convertPathnameToRouteIdWithParams(history.location.pathname)
}

const initialState: CommonState = {
  route: getInitialRoute(),
  currentUser: "todo user info"
}

export const commonReducer = reducerWithInitialState(initialState)
  .case(CommonActions.changeRoute, (state, payload) => {
    return { ...state, route: payload }
  })
  .build()
