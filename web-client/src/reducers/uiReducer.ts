import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UserPageUiActions } from "../actions/UiActions"
import { UiState } from "../types/uiTypes"

const initialState: UiState = {
  userPage: {
    selectedUserPlanetsTab: "map",
    selectedNormalPlanetId: null
  }
}

export const createUiReducer = () =>
  reducerWithInitialState(initialState)
    .case(UserPageUiActions.selectUserPlanetsTab, (state, payload) => ({
      ...state,
      userPage: {
        ...state.userPage,
        selectedUserPlanetsTab: payload
      }
    }))
    .case(UserPageUiActions.selectPlanet, (state, payload) => ({
      ...state,
      userPage: {
        ...state.userPage,
        selectedUserPlanetsTab: "map",
        selectedNormalPlanetId: payload
      }
    }))
    .case(UserPageUiActions.unselectPlanet, state => ({
      ...state,
      userPage: {
        ...state.userPage,
        selectedNormalPlanetId: null
      }
    }))
    .build()
