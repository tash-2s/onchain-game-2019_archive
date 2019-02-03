import { combineReducers } from "redux"

import { createCommonReducer } from "./commonReducer"
import { createAppReducer } from "./appReducer"
import { createUserReducer } from "./routed/userReducer"
import { createUsersReducer } from "./routed/usersReducer"

export const createReducer = () =>
  combineReducers({
    common: createCommonReducer(),
    app: createAppReducer(),
    routed: combineReducers({
      user: createUserReducer(),
      users: createUsersReducer()
    })
  })
