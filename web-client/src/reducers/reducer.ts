import { combineReducers } from "redux"

import { appReducer } from "./appReducer"
import { commonReducer } from "./commonReducer"

export const reducer = combineReducers({
  common: commonReducer,
  app: appReducer
})
