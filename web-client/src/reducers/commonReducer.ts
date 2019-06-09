import { reducerWithInitialState } from "typescript-fsa-reducers"

import { CommonActions } from "../actions/CommonActions"
import { historyLib, convertHashToRouteIdWithParams } from "../misc/route"
import { LoomWeb3 } from "../misc/loom"
import { Time } from "../models/time"

const getInitialRoute = () => {
  return convertHashToRouteIdWithParams(historyLib.location.hash)
}

const getCurrentUser = () => {
  if (LoomWeb3.isGuest) {
    return null
  }
  return { address: LoomWeb3.accountAddress }
}

const createInitialState = () => ({
  route: getInitialRoute(),
  currentUser: getCurrentUser(),
  isLoading: false,
  isError: false,
  webTime: Time.now(),
  loomTimeDifference: 0
})

export type CommonState = ReturnType<typeof createInitialState>

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
    .case(CommonActions.updateTime, (state, payload) => {
      return {
        ...state,
        webTime: payload.webTime,
        loomTimeDifference: payload.loomTime - payload.webTime
      }
    })
    .case(CommonActions.updateWebTime, (state, payload) => {
      return { ...state, webTime: payload }
    })
    .build()
