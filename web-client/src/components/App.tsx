import * as React from "react"
import { AppProps } from "../containers/AppContainer"
import { Template } from "./App/Template"
import { UserContainer } from "../containers/routed/UserContainer"
import { UsersContainer } from "../containers/routed/UsersContainer"

export class App extends React.Component<AppProps> {
  render = () => {
    return (
      <Template
        isLoading={this.props.common.isLoading}
        isError={this.props.common.isError}
        throwError={this.props.commonActions.throwError}
        currentUser={this.props.common.currentUser}
        signup={this.props.commonActions.signup}
      >
        {this.getRouted()}
      </Template>
    )
  }

  getRouted = () => {
    switch (this.props.common.route.id) {
      case "/":
        return <p>top</p>
      case "/users":
        return <UsersContainer />
      case "/users/:id":
        return <UserContainer />
      case "/not_found":
      default:
        return <div>not found</div>
    }
  }
}
