import * as React from "react"
import { AppProps } from "../containers/AppContainer"
import { Template } from "./app/Template"
import { UserContainer } from "../containers/routed/UserContainer"
import { UsersContainer } from "../containers/routed/UsersContainer"

export class App extends React.Component<AppProps> {
  render = () => {
    return (
      <Template
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
        return (
          <TestChain
            app={this.props.app}
            appActions={this.props.appActions}
            user={this.props.common.currentUser}
          />
        )
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

import { AppState } from "../types/appTypes"
import { AppActions } from "../actions/AppActions"

interface TestChainProps {
  app: AppState
  appActions: AppActions
  user: { address: string } | null
}
class TestChain extends React.Component<TestChainProps> {
  render = () => {
    return (
      <div>
        <button disabled={!this.props.user} onClick={this.buttonHandler}>
          test chain
        </button>
        <div>{this.props.app.balance}</div>
      </div>
    )
  }

  buttonHandler = () => {
    if (this.props.user) {
      this.props.appActions.setBalance(this.props.user.address)
    }
  }
}
