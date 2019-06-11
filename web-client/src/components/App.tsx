import * as React from "react"

import { AppProps } from "../containers/AppContainer"

import { Template } from "./App/Template"
import { Router } from "./Router"

export function App(props: AppProps) {
  return (
    <Template
      app={props.app}
      appActions={props.appActions}
      currentUser={props.currentUser}
      currentUserActions={props.currentUserActions}
      templateUi={props.templateUi}
      templateUiActions={props.templateUiActions}
    >
      <Router route={props.app.route} />
    </Template>
  )
}
