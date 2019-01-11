import { createStore } from "redux"
import { reducer } from "./reducers/reducer"

export const buildStore = () =>
  createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  )
