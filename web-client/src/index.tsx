import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"

import { buildStore } from "./store"
import { registerStore } from "./utils/history"
import { AppContainer } from "./containers/AppContainer"

const store = buildStore()
registerStore(store)
ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById("js-connector")
)
