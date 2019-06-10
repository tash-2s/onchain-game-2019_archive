import * as React from "react"

import { AppProps } from "../containers/AppContainer"

import { Template } from "./App/Template"
import { Router } from "./Router"

export function App(props: AppProps) {
  return (
    <Template
      app={props.app}
      commonUi={props.commonUi}
      appActions={props.appActions}
      commonUiActions={props.commonUiActions}
      currentUser={props.currentUser}
      currentUserActions={props.currentUserActions}
    >
      <Router route={props.app.route} />
    </Template>
  )
}
