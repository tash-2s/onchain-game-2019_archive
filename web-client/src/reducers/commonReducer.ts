import { reducerWithInitialState } from "typescript-fsa-reducers"
import { CommonActions } from "../actions/CommonActions"
import { CommonState } from "../types/commonTypes"
import { historyLib, convertPathnameToRouteIdWithParams } from "../misc/route"
import { LoomWeb3 } from "../misc/loom"

const getInitialRoute = (): CommonState["route"] => {
  return convertPathnameToRouteIdWithParams(historyLib.location.pathname)
}

const getCurrentUser = (): CommonState["currentUser"] => {
  if (LoomWeb3.isGuest) {
    return null
  }
  return { address: LoomWeb3.accountAddress }
}

const createInitialState: () => CommonState = () => ({
  route: getInitialRoute(),
  currentUser: getCurrentUser(),
  isError: false
})

export const createCommonReducer = () =>
  reducerWithInitialState(createInitialState())
    .case(CommonActions.changeRoute, (state, payload) => {
      return { ...state, route: payload }
    })
    .case(CommonActions.throwError, (state, error) => {
      return { ...state, isError: true }
    })
    .case(CommonActions.signup, (state, payload) => ({
      ...state,
      currentUser: { address: payload }
    }))
    .build()
