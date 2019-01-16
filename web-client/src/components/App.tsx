import * as React from "react"
import { AppProps } from "../containers/AppContainer"
import { Template } from "./app/Template"
import { UserContainer } from "../containers/routed/UserContainer"

export class App extends React.Component<AppProps> {
  render = () => {
    return (
      <Template
        isError={this.props.common.isError}
        throwError={this.props.commonActions.throwError}
        currentUser={this.props.common.currentUser}
        login={this.props.commonActions.login}
      >
        {this.getRouted()}
      </Template>
    )
  }

  getRouted = () => {
    switch (this.props.common.route.id) {
      case "/":
        return <div>index</div>
      case "/test":
        return <div>test</div>
      case "/users/:id":
        return <UserContainer />
      case "/not_found":
      default:
        return <div>not found</div>
    }
  }
}
