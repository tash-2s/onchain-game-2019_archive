import * as React from "react"
import * as ReactDOM from "react-dom"
import { createStore } from "redux"
import { Provider } from "react-redux"

import { reducer } from "./reducers/reducer"
import { registerStore } from "./utils/route"
import { AppContainer } from "./containers/AppContainer"

const store = createStore(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)
registerStore(store)
ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById("js-connector")
)
