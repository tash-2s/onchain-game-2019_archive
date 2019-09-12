import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UserPageUiActions } from "../actions/UserPageUiActions"
import {
  UserPageViewKind,
  UserPlanetViewKind,
  PlanetKindWithAll,
  UserPlanetSortKind
} from "../constants"

export const initialUserPageUiState = {
  selectedViewKind: "main" as UserPageViewKind,
  selectedUserPlanetViewKind: "map" as UserPlanetViewKind,
  selectedNormalPlanetId: null as number | null,
  selectedUserPlanetId: null as string | null,
  selectedPlanetKind: "all" as PlanetKindWithAll,
  selectedUserPlanetSortKind: "Newest" as UserPlanetSortKind,
  planetListVisibilityForMobile: false,
  selectedSpecialPlanetTokenIdForSet: null as string | null,
  selectedUserSpecialPlanetIdForModal: null as string | null
}

export type UserPageUiState = typeof initialUserPageUiState

export const createUserPageUiReducer = () =>
  reducerWithInitialState(initialUserPageUiState)
    .case(UserPageUiActions.selectViewKind, (state, payload) => ({
      ...state,
      selectedViewKind: payload
    }))
    .case(UserPageUiActions.toggleUserPlanetViewKind, state => ({
      ...state,
      selectedUserPlanetViewKind: state.selectedUserPlanetViewKind === "map" ? "list" : "map"
    }))
    .case(UserPageUiActions.selectPlanet, (state, payload) => ({
      ...state,
      selectedUserPlanetViewKind: "map",
      selectedNormalPlanetId: payload,
      selectedSpecialPlanetTokenIdForSet: null
    }))
    .case(UserPageUiActions.unselectPlanet, state => ({
      ...state,
      selectedNormalPlanetId: null
    }))
    .case(UserPageUiActions.selectUserPlanet, (state, payload) => ({
      ...state,
      selectedUserPlanetId: payload,
      selectedUserSpecialPlanetIdForModal: null
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
    .case(UserPageUiActions.selectSpecialPlanetTokenForSet, (state, payload) => ({
      ...state,
      selectedViewKind: "main",
      selectedUserPlanetViewKind: "map",
      selectedNormalPlanetId: null,
      selectedSpecialPlanetTokenIdForSet: payload
    }))
    .case(UserPageUiActions.unselectSpecialPlanetTokenForSet, state => ({
      ...state,
      selectedSpecialPlanetTokenIdForSet: null
    }))
    .case(UserPageUiActions.selectUserSpecialPlanetForModal, (state, payload) => ({
      ...state,
      selectedUserPlanetId: null,
      selectedUserSpecialPlanetIdForModal: payload
    }))
    .case(UserPageUiActions.unselectUserSpecialPlanetForModal, state => ({
      ...state,
      selectedUserSpecialPlanetIdForModal: null
    }))
    .build()
