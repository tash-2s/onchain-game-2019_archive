import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UserPageUIActions } from "../actions/UserPageUIActions"
import {
  UserPageViewKind,
  UserAsterisksViewKind,
  AsteriskKindWithAll,
  UserAsterisksSortKind
} from "../constants"

export const initialUserPageUIState = {
  selectedPageViewKind: "main" as UserPageViewKind,
  selectedUserAsterisksViewKind: "map" as UserAsterisksViewKind,
  selectedInGameAsteriskIdForSet: null as number | null,
  selectedUserInGameAsteriskIdForModal: null as string | null,
  selectedAsteriskKindForUserAsteriskList: "all" as AsteriskKindWithAll,
  selectedSortKindForUserAsteriskList: "Newest" as UserAsterisksSortKind,
  asteriskListVisibilityForMobile: false,
  selectedTradableAsteriskTokenIdForSet: null as string | null,
  selectedUserTradableAsteriskIdForModal: null as string | null,
  selectedAsteriskHexesForSet: [] as Array<{ axialCoordinateQ: number; axialCoordinateR: number }>,
  selectedUserInGameAsteriskIdsForRemoval: null as Array<string> | null
}

export type UserPageUIState = typeof initialUserPageUIState

export const createUserPageUIReducer = () =>
  reducerWithInitialState(initialUserPageUIState)
    .case(UserPageUIActions.selectPageViewKind, (state, payload) => ({
      ...state,
      selectedPageViewKind: payload
    }))
    .case(UserPageUIActions.toggleUserAsterisksViewKind, state => ({
      ...state,
      selectedUserAsterisksViewKind: state.selectedUserAsterisksViewKind === "map" ? "list" : "map"
    }))
    .case(UserPageUIActions.selectInGameAsteriskForSet, (state, payload) => ({
      ...state,
      selectedUserAsterisksViewKind: "map",
      selectedInGameAsteriskIdForSet: payload,
      selectedTradableAsteriskTokenIdForSet: null,
      selectedAsteriskHexesForSet: [],
      selectedUserInGameAsteriskIdsForRemoval: null
    }))
    .case(UserPageUIActions.unselectInGameAsteriskForSet, state => ({
      ...state,
      selectedInGameAsteriskIdForSet: null
    }))
    .case(UserPageUIActions.selectUserInGameAsteriskForModal, (state, payload) => ({
      ...state,
      selectedUserInGameAsteriskIdForModal: payload,
      selectedUserTradableAsteriskIdForModal: null
    }))
    .case(UserPageUIActions.unselectUserInGameAsteriskForModal, state => ({
      ...state,
      selectedUserInGameAsteriskIdForModal: null
    }))
    .case(UserPageUIActions.selectAsteriskKindForUserAsteriskList, (state, payload) => ({
      ...state,
      selectedAsteriskKindForUserAsteriskList: payload
    }))
    .case(UserPageUIActions.selectSortKindForUserAsteriskList, (state, payload) => ({
      ...state,
      selectedSortKindForUserAsteriskList: payload
    }))
    .case(UserPageUIActions.toggleAsteriskListVisibilityForMobile, state => ({
      ...state,
      asteriskListVisibilityForMobile: !state.asteriskListVisibilityForMobile
    }))
    .case(UserPageUIActions.clear, state => ({
      ...state,
      ...initialUserPageUIState
    }))
    .case(UserPageUIActions.selectTradableAsteriskTokenForSet, (state, payload) => ({
      ...state,
      selectedPageViewKind: "main",
      selectedUserAsterisksViewKind: "map",
      selectedInGameAsteriskIdForSet: null,
      selectedTradableAsteriskTokenIdForSet: payload,
      selectedUserInGameAsteriskIdsForRemoval: null
    }))
    .case(UserPageUIActions.unselectTradableAsteriskTokenForSet, state => ({
      ...state,
      selectedTradableAsteriskTokenIdForSet: null
    }))
    .case(UserPageUIActions.selectUserTradableAsteriskForModal, (state, payload) => ({
      ...state,
      selectedUserInGameAsteriskIdForModal: null,
      selectedUserTradableAsteriskIdForModal: payload
    }))
    .case(UserPageUIActions.unselectUserTradableAsteriskForModal, state => ({
      ...state,
      selectedUserTradableAsteriskIdForModal: null
    }))
    .case(UserPageUIActions.selectAsteriskHexForSet, (state, payload) => {
      // unselect if the hex is already selected
      const removedSame = state.selectedAsteriskHexesForSet.filter(
        o =>
          o.axialCoordinateQ !== payload.axialCoordinateQ ||
          o.axialCoordinateR !== payload.axialCoordinateR
      )
      if (removedSame.length !== state.selectedAsteriskHexesForSet.length) {
        return { ...state, selectedAsteriskHexesForSet: removedSame }
      }

      return {
        ...state,
        selectedAsteriskHexesForSet: [...state.selectedAsteriskHexesForSet, payload]
      }
    })
    .case(UserPageUIActions.unselectAsteriskHexesForSet, state => ({
      ...state,
      selectedAsteriskHexesForSet: []
    }))
    .case(UserPageUIActions.startSelectingUserInGameAsteriskForRemoval, state => ({
      ...state,
      selectedInGameAsteriskIdForSet: null,
      selectedTradableAsteriskTokenIdForSet: null,
      selectedUserInGameAsteriskIdsForRemoval: []
    }))
    .case(UserPageUIActions.selectUserInGameAsteriskForRemoval, (state, payload) => {
      if (!state.selectedUserInGameAsteriskIdsForRemoval) {
        return {
          ...state,
          selectedUserInGameAsteriskIdsForRemoval: [payload]
        }
      }

      // unselect if the hex is already selected
      const removedSame = state.selectedUserInGameAsteriskIdsForRemoval.filter(id => id !== payload)
      if (removedSame.length !== state.selectedUserInGameAsteriskIdsForRemoval.length) {
        return { ...state, selectedUserInGameAsteriskIdsForRemoval: removedSame }
      }

      return {
        ...state,
        selectedUserInGameAsteriskIdsForRemoval: [
          ...state.selectedUserInGameAsteriskIdsForRemoval,
          payload
        ]
      }
    })
    .case(UserPageUIActions.endSelectingUserInGameAsteriskForRemoval, state => ({
      ...state,
      selectedUserInGameAsteriskIdsForRemoval: null
    }))
    .build()
