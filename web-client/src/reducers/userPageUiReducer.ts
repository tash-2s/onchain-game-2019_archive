import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UserPageUiActions } from "../actions/UserPageUiActions"
import { UserPlanetViewKind, PlanetKindWithAll, UserPlanetSortKind } from "../constants"

export const initialUserPageUiState = {
  selectedUserPlanetViewKind: "map" as UserPlanetViewKind,
  selectedNormalPlanetId: null as number | null,
  selectedUserPlanetId: null as string | null,
  selectedPlanetKind: "all" as PlanetKindWithAll,
  selectedUserPlanetSortKind: "Newest" as UserPlanetSortKind,
  planetListVisibilityForMobile: false
}

export type UserPageUiState = typeof initialUserPageUiState

export const createUserPageUiReducer = () =>
  reducerWithInitialState(initialUserPageUiState)
    .case(UserPageUiActions.toggleUserPlanetViewKind, state => ({
      ...state,
      selectedUserPlanetViewKind: state.selectedUserPlanetViewKind === "map" ? "list" : "map"
    }))
    .case(UserPageUiActions.selectPlanet, (state, payload) => ({
      ...state,
      selectedUserPlanetViewKind: "map",
      selectedNormalPlanetId: payload
    }))
    .case(UserPageUiActions.unselectPlanet, state => ({
      ...state,
      selectedNormalPlanetId: null
    }))
    .case(UserPageUiActions.selectUserPlanet, (state, payload) => ({
      ...state,
      selectedUserPlanetId: payload
    }))
    .case(UserPageUiActions.unselectUserPlanet, state => ({
      ...state,
      selectedUserPlanetId: null
    }))
    .case(UserPageUiActions.selectPlanetKind, (state, payload) => ({
      ...state,
      selectedPlanetKind: payload
    }))
    .case(UserPageUiActions.selectUserPlanetSortKind, (state, payload) => ({
      ...state,
      selectedUserPlanetSortKind: payload
    }))
    .case(UserPageUiActions.togglePlanetListVisibilityForMobile, state => ({
      ...state,
      planetListVisibilityForMobile: !state.planetListVisibilityForMobile
    }))
    .case(UserPageUiActions.clear, state => ({
      ...state,
      ...initialUserPageUiState
    }))
    .build()
