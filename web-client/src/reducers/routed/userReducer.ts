import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UserActions } from "../../actions/routed/UserActions"
import { UserState } from "../../types/routed/userTypes"
import {
  buildTargetUser,
  restructureUserFromResponse,
  currentTabFromState
} from "./userReducer/functions"

const initialState: UserState = {
  targetUser: null
}

export const createUserReducer = () =>
  reducerWithInitialState(initialState)
    .case(UserActions.setTargetUser, (state, payload) => ({
      ...state,
      targetUser: buildTargetUser(
        payload.address,
        restructureUserFromResponse(payload.response),
        currentTabFromState(state)
      )
    }))
    .case(UserActions.clearTargetUser, state => ({
      ...state,
      targetUser: null
    }))
    .case(UserActions.changeSelectedUserPlanetsTab, (state, tab) => {
      if (!state.targetUser) {
        return state
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          selectedUserPlanetsTab: tab
        }
      }
    })
    .case(UserActions.setPlanetToGet, (state, planetId) => {
      if (!state.targetUser) {
        return state
      }

      return {
        ...state,
        targetUser: {
          ...state.targetUser,
          selectedUserPlanetsTab: "map",
          normalPlanetIdToGet: planetId
        }
      }
    })
    .case(UserActions.getPlanet, (state, payload) => ({
      ...state,
      targetUser: buildTargetUser(
        payload.address,
        restructureUserFromResponse(payload.response),
        currentTabFromState(state)
      )
    }))
    .case(UserActions.rankupUserNormalPlanet, (state, payload) => ({
      ...state,
      targetUser: buildTargetUser(
        payload.address,
        restructureUserFromResponse(payload.response),
        currentTabFromState(state)
      )
    }))
    .build()
