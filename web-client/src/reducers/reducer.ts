import { combineReducers } from "redux"

import { appReducer } from "./appReducer"

export const reducer = combineReducers({
  app: appReducer
})
