import { reducerWithInitialState } from "typescript-fsa-reducers"

import { CommonActions } from "../actions/CommonActions"
import { historyLib, convertHashToRouteIdWithParams } from "../misc/route"

const createInitialState = () => ({
  route: convertHashToRouteIdWithParams(historyLib.location.hash),
  isLoading: false,
  isError: false
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
    .build()
