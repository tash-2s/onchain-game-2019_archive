import { combineReducers } from "redux"

import { createAppReducer } from "./appReducer"
import { createCurrentUserReducer } from "./currentUserReducer"
import { createTimeReducer } from "./timeReducer"
import { createTemplateUIReducer } from "./templateUIReducer"
import { createUserPageUIReducer } from "./userPageUIReducer"
import { createUserReducer } from "./userReducer"
import { createUsersReducer } from "./usersReducer"

export const createReducer = () =>
  combineReducers({
    app: createAppReducer(),
    currentUser: createCurrentUserReducer(),
    time: createTimeReducer(),
    user: createUserReducer(),
    users: createUsersReducer(),
    templateUI: createTemplateUIReducer(),
    userPageUI: createUserPageUIReducer()
  })

type FirstNonUndef<T extends [any, any]> = T extends [infer P | undefined, any] ? P : never
export type RootState = FirstNonUndef<Parameters<ReturnType<typeof createReducer>>>
