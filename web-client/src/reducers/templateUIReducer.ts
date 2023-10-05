import { reducerWithInitialState } from "typescript-fsa-reducers"

import { TemplateUIActions } from "../actions/TemplateUIActions"

const initialState = {
  activatedNavbarMenuForMobile: false
}

export type TemplateUIState = typeof initialState

export const createTemplateUIReducer = () =>
  reducerWithInitialState(initialState)
    .case(TemplateUIActions.toggleNavbarMenuForMobile, state => ({
      ...state,
      activatedNavbarMenuForMobile: !state.activatedNavbarMenuForMobile
    }))
    .build()
