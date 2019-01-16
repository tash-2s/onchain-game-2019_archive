import { reducerWithInitialState } from "typescript-fsa-reducers"
import { CommonActions } from "../actions/CommonActions"
import { CommonState, RouteState } from "../types/commonTypes"
import { history, convertPathnameToRouteIdWithParams } from "../utils/route"

const getInitialRoute = (): RouteState => {
  return convertPathnameToRouteIdWithParams(history.location.pathname)
}

const initialState: CommonState = {
  route: getInitialRoute(),
  currentUser: null,
  isError: false
}

export const commonReducer = reducerWithInitialState(initialState)
  .case(CommonActions.changeRoute, (state, payload) => {
    return { ...state, route: payload }
  })
  .case(CommonActions.throwError, (state, error) => {
    return { ...state, isError: true }
  })
  .case(CommonActions.login, (state, payload) => ({
    ...state,
    currentUser: { id: payload }
  }))
  .build()
