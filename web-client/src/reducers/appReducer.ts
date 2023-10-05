import { reducerWithInitialState } from "typescript-fsa-reducers"

import { AppActions } from "../actions/AppActions"
import { historyLib, convertHashToRouteIdWithParams } from "../misc/route"

const createInitialState = () => ({
  route: convertHashToRouteIdWithParams(historyLib.location.hash),
  isLoading: false,
  errorMessage: null as string | null
})

export type AppState = ReturnType<typeof createInitialState>

export const createAppReducer = () =>
  reducerWithInitialState(createInitialState())
    .case(AppActions.changeRoute, (state, payload) => {
      return { ...state, route: payload }
    })
    .case(AppActions.startLoading, state => {
      return { ...state, isLoading: true }
    })
    .case(AppActions.stopLoading, state => {
      return { ...state, isLoading: false }
    })
    .case(AppActions.showError, (state, payload) => {
      return { ...state, errorMessage: payload }
    })
    .build()
