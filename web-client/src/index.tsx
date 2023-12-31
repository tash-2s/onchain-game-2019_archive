import * as React from "react"
import * as ReactDOM from "react-dom"
import { createStore } from "redux"
import { Provider } from "react-redux"

import { createReducer } from "./reducers/rootReducer"
import { registerStore } from "./misc/route"
import { startClock } from "./misc/clock"
import { AppContainer } from "./containers/AppContainer"
import { TopLevelErrorBoundary } from "./components/TopLevelErrorBoundary"

const store = createStore(
  createReducer(),
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)
registerStore(store)
ReactDOM.render(
  <TopLevelErrorBoundary>
    <Provider store={store}>
      <AppContainer />
    </Provider>
  </TopLevelErrorBoundary>,
  document.getElementById("app-js-connector")
)
startClock(store)
