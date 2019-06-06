import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UserPageUiActions } from "../actions/UiActions"
import { UiState } from "../types/uiTypes"

const initialState: UiState = {
  userPage: {
    selectedUserPlanetsTab: "map",
    selectedNormalPlanetId: null,
    planetListVisibility: true,
    selectedUserPlanetId: null
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
    .case(UserPageUiActions.changePlanetListVisibility, (state, payload) => ({
      ...state,
      userPage: {
        ...state.userPage,
        planetListVisibility: payload
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
    .case(UserPageUiActions.selectUserPlanet, (state, payload) => ({
      ...state,
      userPage: {
        ...state.userPage,
        selectedUserPlanetId: payload
      }
    }))
    .case(UserPageUiActions.unselectUserPlanet, state => ({
      ...state,
      userPage: {
        ...state.userPage,
        selectedUserPlanetId: null
      }
    }))
    .build()
