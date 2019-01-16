import { combineReducers } from "redux"

import { commonReducer } from "./commonReducer"
import { appReducer } from "./appReducer"
import { userReducer } from "./routed/userReducer"
import { usersReducer } from "./routed/usersReducer"

export const reducer = combineReducers({
  common: commonReducer,
  app: appReducer,
  routed: combineReducers({ user: userReducer, users: usersReducer })
})
