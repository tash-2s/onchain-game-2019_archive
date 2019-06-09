import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UserPageUiActions, CommonUiActions } from "../actions/UiActions"
import { PlanetKind } from "../types/commonTypes"
import { SortKind } from "../types/uiTypes"

export const initialUiState = {
  userPage: {
    selectedUserPlanetViewType: "map" as "map" | "list",
    selectedNormalPlanetId: null as number | null,
    planetListVisibilityOnMobile: false,
    selectedUserPlanetId: null as string | null,
    selectedUserPlanetKindForUserPlanetList: "all" as "all" | PlanetKind,
    selectedSortKindForUserPlanetList: "Newest" as SortKind
  },
  common: {
    activatedNavbarMenuOnMobile: false
  }
}

export type UiState = typeof initialUiState

export const createUiReducer = () =>
  reducerWithInitialState(initialUiState)
    .case(UserPageUiActions.selectUserPlanetViewType, (state, payload) => ({
      ...state,
      userPage: {
        ...state.userPage,
        selectedUserPlanetViewType: payload
      }
    }))
    .case(UserPageUiActions.selectPlanet, (state, payload) => ({
      ...state,
      userPage: {
        ...state.userPage,
        selectedUserPlanetViewType: "map",
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
    .case(UserPageUiActions.selectUserPlanetKindForUserPlanetList, (state, payload) => ({
      ...state,
      userPage: {
        ...state.userPage,
        selectedUserPlanetKindForUserPlanetList: payload
      }
    }))
    .case(UserPageUiActions.selectSortKindForUserPlanetList, (state, payload) => ({
      ...state,
      userPage: {
        ...state.userPage,
        selectedSortKindForUserPlanetList: payload
      }
    }))
    .case(UserPageUiActions.togglePlanetListVisibility, state => ({
      ...state,
      userPage: {
        ...state.userPage,
        planetListVisibilityOnMobile: !state.userPage.planetListVisibilityOnMobile
      }
    }))
    .case(UserPageUiActions.clear, state => ({
      ...state,
      userPage: { ...initialUiState.userPage }
    }))
    .case(CommonUiActions.toggleNavbarMenuOnMobile, state => ({
      ...state,
      common: { activatedNavbarMenuOnMobile: !state.common.activatedNavbarMenuOnMobile }
    }))
    .build()
