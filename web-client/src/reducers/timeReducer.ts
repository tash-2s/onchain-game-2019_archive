import { reducerWithInitialState } from "typescript-fsa-reducers"

import { TimeActions } from "../actions/TimeActions"
import { Time } from "../models/time"

const initialState = {
  webTime: Time.now(),
  loomTimeDifference: 0
}

export type TimeState = typeof initialState

export const createTimeReducer = () =>
  reducerWithInitialState(initialState)
    .case(TimeActions.updateTime, (state, payload) => {
      return {
        ...state,
        webTime: payload.webTime,
        loomTimeDifference: payload.loomTime - payload.webTime
      }
    })
    .case(TimeActions.updateWebTime, (state, payload) => {
      return { ...state, webTime: payload }
    })
    .build()
