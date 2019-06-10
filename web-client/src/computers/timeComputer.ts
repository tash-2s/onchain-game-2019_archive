import { TimeState } from "../reducers/timeReducer"
import { Time } from "../models/time"

export type ComputedTimeState = ReturnType<typeof computeTimeState>

export const computeTimeState = (state: TimeState) => {
  const now = Time.build(state.webTime, state.loomTimeDifference)
  return { ...state, now: now }
}
