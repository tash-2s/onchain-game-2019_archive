import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UserActions } from "../../actions/routed/UserActions"
import { UserState } from "../../types/routed/userTypes"
import { buildTargetUser, restructureUserFromResponse } from "./userReducer/functions"

const initialState: UserState = {
  targetUser: null
}

export const createUserReducer = () =>
  reducerWithInitialState(initialState)
    .case(UserActions.setTargetUser, (state, payload) => ({
      ...state,
      targetUser: buildTargetUser(payload.address, restructureUserFromResponse(payload.response))
    }))
    .case(UserActions.clearTargetUser, state => ({
      ...state,
      targetUser: null
    }))
    .case(UserActions.setPlanetToGet, (state, payload) => ({
      ...state,
      normalPlanetIdToGet: payload.planetId
    }))
    .case(UserActions.getPlanet, (state, payload) => ({
      ...state,
      targetUser: buildTargetUser(payload.address, restructureUserFromResponse(payload.response))
    }))
    .case(UserActions.rankupUserNormalPlanet, (state, payload) => ({
      ...state,
      targetUser: buildTargetUser(payload.address, restructureUserFromResponse(payload.response))
    }))
    .build()
