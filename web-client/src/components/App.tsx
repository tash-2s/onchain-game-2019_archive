import * as React from "react"
import { AppProps } from "../containers/AppContainer"
import { Template } from "./app/Template"
import { UserContainer } from "../containers/routed/UserContainer"

export class App extends React.Component<AppProps> {
  render = () => {
    return <Template>{this.route()}</Template>
  }

  route = () => {
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
