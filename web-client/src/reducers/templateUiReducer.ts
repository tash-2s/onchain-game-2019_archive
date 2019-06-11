import { reducerWithInitialState } from "typescript-fsa-reducers"

import { TemplateUiActions } from "../actions/TemplateUiActions"

const initialState = {
  activatedNavbarMenuForMobile: false
}

export type TemplateUiState = typeof initialState

export const createTemplateUiReducer = () =>
  reducerWithInitialState(initialState)
    .case(TemplateUiActions.toggleNavbarMenuForMobile, state => ({
      ...state,
      activatedNavbarMenuForMobile: !state.activatedNavbarMenuForMobile
    }))
    .build()
