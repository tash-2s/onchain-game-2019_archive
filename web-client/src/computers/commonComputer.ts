import { CommonState } from "../reducers/commonReducer"
import { Time } from "../models/time"

export type ComputedCommonState = ReturnType<typeof computeCommonState>

export const computeCommonState = (state: CommonState) => {
  const now = Time.build(state.webTime, state.loomTimeDifference)
  return { ...state, now: now }
}
