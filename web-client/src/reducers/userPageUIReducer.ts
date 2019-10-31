import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UserPageUIActions } from "../actions/UserPageUIActions"
import {
  UserPageViewKind,
  UserPlanetViewKind,
  PlanetKindWithAll,
  UserPlanetSortKind
} from "../constants"

export const initialUserPageUIState = {
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

export type UserPageUIState = typeof initialUserPageUIState

export const createUserPageUIReducer = () =>
  reducerWithInitialState(initialUserPageUIState)
    .case(UserPageUIActions.selectViewKind, (state, payload) => ({
      ...state,
      selectedViewKind: payload
    }))
    .case(UserPageUIActions.toggleUserPlanetViewKind, state => ({
      ...state,
      selectedUserPlanetViewKind: state.selectedUserPlanetViewKind === "map" ? "list" : "map"
    }))
    .case(UserPageUIActions.selectNormalPlanetForSet, (state, payload) => ({
      ...state,
      selectedUserPlanetViewKind: "map",
      selectedNormalPlanetIdForSet: payload,
      selectedSpecialPlanetTokenIdForSet: null
    }))
    .case(UserPageUIActions.unselectNormalPlanetForSet, state => ({
      ...state,
      selectedNormalPlanetIdForSet: null
    }))
    .case(UserPageUIActions.selectUserNormalPlanetForModal, (state, payload) => ({
      ...state,
      selectedUserNormalPlanetIdForModal: payload,
      selectedUserSpecialPlanetIdForModal: null
    }))
    .case(UserPageUIActions.unselectUserNormalPlanetForModal, state => ({
      ...state,
      selectedUserNormalPlanetIdForModal: null
    }))
    .case(UserPageUIActions.selectPlanetKind, (state, payload) => ({
      ...state,
      selectedPlanetKind: payload
    }))
    .case(UserPageUIActions.selectUserPlanetSortKind, (state, payload) => ({
      ...state,
      selectedUserPlanetSortKind: payload
    }))
    .case(UserPageUIActions.togglePlanetListVisibilityForMobile, state => ({
      ...state,
      planetListVisibilityForMobile: !state.planetListVisibilityForMobile
    }))
    .case(UserPageUIActions.clear, state => ({
      ...state,
      ...initialUserPageUIState
    }))
    .case(UserPageUIActions.selectSpecialPlanetTokenForSet, (state, payload) => ({
      ...state,
      selectedViewKind: "main",
      selectedUserPlanetViewKind: "map",
      selectedNormalPlanetIdForSet: null,
      selectedSpecialPlanetTokenIdForSet: payload
    }))
    .case(UserPageUIActions.unselectSpecialPlanetTokenForSet, state => ({
      ...state,
      selectedSpecialPlanetTokenIdForSet: null
    }))
    .case(UserPageUIActions.selectUserSpecialPlanetForModal, (state, payload) => ({
      ...state,
      selectedUserNormalPlanetIdForModal: null,
      selectedUserSpecialPlanetIdForModal: payload
    }))
    .case(UserPageUIActions.unselectUserSpecialPlanetForModal, state => ({
      ...state,
      selectedUserSpecialPlanetIdForModal: null
    }))
    .case(UserPageUIActions.selectPlanetHexForSet, (state, payload) => ({
      ...state,
      selectedPlanetHexesForSet: [...state.selectedPlanetHexesForSet, payload]
    }))
    .case(UserPageUIActions.unselectPlanetHexesForSet, state => ({
      ...state,
      selectedPlanetHexesForSet: []
    }))
    .build()
