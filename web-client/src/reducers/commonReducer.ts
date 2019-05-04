import { reducerWithInitialState } from "typescript-fsa-reducers"
import { CommonActions } from "../actions/CommonActions"
import { CommonState } from "../types/commonTypes"
import { historyLib, convertHashToRouteIdWithParams } from "../misc/route"
import { LoomWeb3 } from "../misc/loom"

const getInitialRoute = (): CommonState["route"] => {
  return convertHashToRouteIdWithParams(historyLib.location.hash)
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
  isLoading: false,
  isError: false,
  loomTimeDifference: 0
})

export const createCommonReducer = () =>
  reducerWithInitialState(createInitialState())
    .case(CommonActions.changeRoute, (state, payload) => {
      return { ...state, route: payload }
    })
    .case(CommonActions.throwError, (state, error) => {
      return { ...state, isError: true }
    })
    .case(CommonActions.startLoading, state => {
      return { ...state, isLoading: true }
    })
    .case(CommonActions.stopLoading, state => {
      return { ...state, isLoading: false }
    })
    .case(CommonActions.signup, (state, payload) => ({
      ...state,
      currentUser: { address: payload }
    }))
    .case(CommonActions.updateLoomTimeDifference, (state, payload) => {
      return { ...state, loomTimeDifference: payload }
    })
    .build()
