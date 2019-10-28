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
  selectedNormalPlanetIdForSet: null as number | null,
  selectedUserNormalPlanetIdForModal: null as string | null,
  selectedPlanetKind: "all" as PlanetKindWithAll,
  selectedUserPlanetSortKind: "Newest" as UserPlanetSortKind,
  planetListVisibilityForMobile: false,
  selectedSpecialPlanetTokenIdForSet: null as string | null,
  selectedUserSpecialPlanetIdForModal: null as string | null,
  selectedPlanetHexesForSet: [] as Array<{ axialCoordinateQ: number; axialCoordinateR: number }>
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
    .case(UserPageUiActions.selectNormalPlanetForSet, (state, payload) => ({
      ...state,
      selectedUserPlanetViewKind: "map",
      selectedNormalPlanetIdForSet: payload,
      selectedSpecialPlanetTokenIdForSet: null
    }))
    .case(UserPageUiActions.unselectNormalPlanetForSet, state => ({
      ...state,
      selectedNormalPlanetIdForSet: null
    }))
    .case(UserPageUiActions.selectUserNormalPlanetForModal, (state, payload) => ({
      ...state,
      selectedUserNormalPlanetIdForModal: payload,
      selectedUserSpecialPlanetIdForModal: null
    }))
    .case(UserPageUiActions.unselectUserNormalPlanetForModal, state => ({
      ...state,
      selectedUserNormalPlanetIdForModal: null
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
      selectedNormalPlanetIdForSet: null,
      selectedSpecialPlanetTokenIdForSet: payload
    }))
    .case(UserPageUiActions.unselectSpecialPlanetTokenForSet, state => ({
      ...state,
      selectedSpecialPlanetTokenIdForSet: null
    }))
    .case(UserPageUiActions.selectUserSpecialPlanetForModal, (state, payload) => ({
      ...state,
      selectedUserNormalPlanetIdForModal: null,
      selectedUserSpecialPlanetIdForModal: payload
    }))
    .case(UserPageUiActions.unselectUserSpecialPlanetForModal, state => ({
      ...state,
      selectedUserSpecialPlanetIdForModal: null
    }))
    .case(UserPageUiActions.selectPlanetHexForSet, (state, payload) => ({
      ...state,
      selectedPlanetHexesForSet: [...state.selectedPlanetHexesForSet, payload]
    }))
    .case(UserPageUiActions.unselectPlanetHexesForSet, state => ({
      ...state,
      selectedPlanetHexesForSet: []
    }))
    .build()
