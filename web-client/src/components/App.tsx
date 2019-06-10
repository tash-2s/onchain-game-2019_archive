import * as React from "react"

import { AppProps } from "../containers/AppContainer"
import { Template } from "./App/Template"
import { UserContainer } from "../containers/routed/UserContainer"
import { UsersContainer } from "../containers/routed/UsersContainer"
import { About } from "./routed/About"

export class App extends React.Component<AppProps> {
  render = () => {
    return (
      <Template
        app={this.props.app}
        commonUi={this.props.commonUi}
        appActions={this.props.appActions}
        commonUiActions={this.props.commonUiActions}
        currentUser={this.props.currentUser}
        currentUserActions={this.props.currentUserActions}
      >
        {this.getRouted()}
      </Template>
    )
  }

  getRouted = () => {
    switch (this.props.app.route.id) {
      case "/":
        return <h1 className={"title"}>top</h1>
      case "/users":
        return <UsersContainer />
      case "/:address":
        return <UserContainer />
      case "/about":
        return <About />
      case "/not_found":
      default:
        return <div>not found</div>
    }
  }
}
