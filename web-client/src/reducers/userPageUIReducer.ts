import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UserPageUIActions } from "../actions/UserPageUIActions"
import {
  UserPageViewKind,
  UserPlanetsViewKind,
  PlanetKindWithAll,
  UserPlanetsSortKind
} from "../constants"

export const initialUserPageUIState = {
  selectedPageViewKind: "main" as UserPageViewKind,
  selectedUserPlanetsViewKind: "map" as UserPlanetsViewKind,
  selectedNormalPlanetIdForSet: null as number | null,
  selectedUserNormalPlanetIdForModal: null as string | null,
  selectedPlanetKindForUserPlanetList: "all" as PlanetKindWithAll,
  selectedSortKindForUserPlanetList: "Newest" as UserPlanetsSortKind,
  planetListVisibilityForMobile: false,
  selectedSpecialPlanetTokenIdForSet: null as string | null,
  selectedUserSpecialPlanetIdForModal: null as string | null,
  selectedPlanetHexesForSet: [] as Array<{ axialCoordinateQ: number; axialCoordinateR: number }>
}

export type UserPageUIState = typeof initialUserPageUIState

export const createUserPageUIReducer = () =>
  reducerWithInitialState(initialUserPageUIState)
    .case(UserPageUIActions.selectPageViewKind, (state, payload) => ({
      ...state,
      selectedPageViewKind: payload
    }))
    .case(UserPageUIActions.toggleUserPlanetsViewKind, state => ({
      ...state,
      selectedUserPlanetsViewKind: state.selectedUserPlanetsViewKind === "map" ? "list" : "map"
    }))
    .case(UserPageUIActions.selectNormalPlanetForSet, (state, payload) => ({
      ...state,
      selectedUserPlanetsViewKind: "map",
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
    .case(UserPageUIActions.selectPlanetKindForUserPlanetList, (state, payload) => ({
      ...state,
      selectedPlanetKindForUserPlanetList: payload
    }))
    .case(UserPageUIActions.selectSortKindForUserPlanetList, (state, payload) => ({
      ...state,
      selectedSortKindForUserPlanetList: payload
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
      selectedPageViewKind: "main",
      selectedUserPlanetsViewKind: "map",
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
    .case(UserPageUIActions.selectPlanetHexForSet, (state, payload) => {
      // unselect if the hex is already selected
      const removedSame = state.selectedPlanetHexesForSet.filter(
        o =>
          o.axialCoordinateQ !== payload.axialCoordinateQ ||
          o.axialCoordinateR !== payload.axialCoordinateR
      )
      if (removedSame.length !== state.selectedPlanetHexesForSet.length) {
        return { ...state, selectedPlanetHexesForSet: removedSame }
      }

      return {
        ...state,
        selectedPlanetHexesForSet: [...state.selectedPlanetHexesForSet, payload]
      }
    })
    .case(UserPageUIActions.unselectPlanetHexesForSet, state => ({
      ...state,
      selectedPlanetHexesForSet: []
    }))
    .build()
