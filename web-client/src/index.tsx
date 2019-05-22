import * as React from "react"
import * as ReactDOM from "react-dom"
import { createStore, Store } from "redux"
import { Provider } from "react-redux"

import { createReducer } from "./reducers/rootReducer"
import { registerStore } from "./misc/route"
import { LoomWeb3 } from "./misc/loom"
import { AppContainer } from "./containers/AppContainer"
import { TopLevelErrorBoundary } from "./components/TopLevelErrorBoundary"
import { Time } from "./models/time"
import { CommonActions } from "./actions/CommonActions"

LoomWeb3.setup()
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
  document.getElementById("js-connector")
)

const updateTime = async (store: Store) => {
  const loomTime = await LoomWeb3.getLoomTime()
  const webTime = Time.now()
  new CommonActions(store.dispatch).updateTime(webTime, loomTime)
}

const timer = (store: Store) => {
  updateTime(store)

  let n = 0

  setInterval(() => {
    if (n >= 9) {
      n = 0
      updateTime(store)
    } else {
      n++
      new CommonActions(store.dispatch).updateWebTime(Time.now())
    }
  }, 1000)
}

timer(store)
