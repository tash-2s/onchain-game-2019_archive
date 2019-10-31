import * as React from "react"

import { AppProps } from "../containers/AppContainer"

import { Template } from "./App/Template"
import { Router } from "./App/Router"

export function App(props: AppProps) {
  return (
    <Template
      app={props.app}
      appActions={props.appActions}
      currentUser={props.currentUser}
      currentUserActions={props.currentUserActions}
      templateUI={props.templateUI}
      templateUIActions={props.templateUIActions}
    >
      <Router route={props.app.route} />
    </Template>
  )
}
