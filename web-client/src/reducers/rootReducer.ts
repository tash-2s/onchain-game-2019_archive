import { combineReducers } from "redux"

import { createCommonReducer } from "./commonReducer"
import { createCurrentUserReducer } from "./currentUserReducer"
import { createTimeReducer } from "./timeReducer"
import { createUiReducer } from "./uiReducer"
import { createUserReducer } from "./routed/userReducer"
import { createUsersReducer } from "./routed/usersReducer"

export const createReducer = () =>
  combineReducers({
    common: createCommonReducer(),
    currentUser: createCurrentUserReducer(),
    time: createTimeReducer(),
    ui: createUiReducer(),
    routed: combineReducers({
      user: createUserReducer(),
      users: createUsersReducer()
    })
  })

type FirstNonUndef<T extends [any, any]> = T extends [infer P | undefined, any] ? P : never
export type RootState = FirstNonUndef<Parameters<ReturnType<typeof createReducer>>>
