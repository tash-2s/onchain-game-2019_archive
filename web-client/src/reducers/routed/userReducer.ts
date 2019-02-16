import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UserActions } from "../../actions/routed/UserActions"
import { UserState } from "../../types/routed/userTypes"
import {
  buildTargetUser,
  restructureUserFromResponse,
  calculateOngoingGold,
  mergeNewPlanet
} from "./userReducer/functions"

const initialState: UserState = {
  targetUser: null
}

export const createUserReducer = () =>
  reducerWithInitialState(initialState)
    .case(UserActions.setTargetUser, (state, payload) => ({
      ...state,
      targetUser: buildTargetUser(payload.address, restructureUserFromResponse(payload.response))
    }))
    .case(UserActions.updateTargetUserOngoings, state => {
      if (!state.targetUser) {
        return state
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          gold: {
            ...state.targetUser.gold,
            ongoing: calculateOngoingGold(state.targetUser.gold, state.targetUser.userNormalPlanets)
          }
        }
      }
    })
    .case(UserActions.clearTargetUser, state => ({
      ...state,
      targetUser: null
    }))
    .case(UserActions.getPlanet, (state, payload) => {
      if (!state.targetUser) {
        return state
      }

      return {
        ...state,
        targetUser: buildTargetUser(
          state.targetUser.address,
          mergeNewPlanet(state.targetUser.userNormalPlanets, payload)
        )
      }
    })
    .build()
