import { combineReducers } from "redux"

import { createCommonReducer } from "./commonReducer"
import { createAppReducer } from "./appReducer"
import { createUiReducer } from "./uiReducer"
import { createUserReducer } from "./routed/userReducer"
import { createUsersReducer } from "./routed/usersReducer"

export const createReducer = () =>
  combineReducers({
    common: createCommonReducer(),
    app: createAppReducer(),
    ui: createUiReducer(),
    routed: combineReducers({
      user: createUserReducer(),
      users: createUsersReducer()
    })
  })
