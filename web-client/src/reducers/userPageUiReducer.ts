import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UserPageUiActions } from "../actions/UserPageUiActions"
import { UserPlanetViewKind, PlanetKindWithAll, UserPlanetSortKind } from "../constants"

export const initialUserPageUiState = {
  selectedUserPlanetViewKind: "map" as UserPlanetViewKind,
  selectedNormalPlanetId: null as number | null,
  planetListVisibilityForMobile: false,
  selectedUserPlanetId: null as string | null,
  selectedUserPlanetKindForUserPlanetList: "all" as PlanetKindWithAll,
  selectedSortKindForUserPlanetList: "Newest" as UserPlanetSortKind
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
    .case(UserPageUiActions.selectUserPlanetKindForUserPlanetList, (state, payload) => ({
      ...state,
      selectedUserPlanetKindForUserPlanetList: payload
    }))
    .case(UserPageUiActions.selectSortKindForUserPlanetList, (state, payload) => ({
      ...state,
      selectedSortKindForUserPlanetList: payload
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
