import * as React from "react"
import { AppProps } from "../containers/AppContainer"
import { Template } from './Template'

export class App extends React.Component<AppProps> {
  render = () => {
    return (
      <Template>
        {this.route()}
      </Template>
    )
  }

  route = () => {
    switch (this.props.app.route.id) {
      case "/":
        return <div>index</div>
      case "/test":
        return (
          <div>
            test
          </div>
        )
      case "/users/:id":
        return <div>user page: {this.props.app.route.params[0]}</div>
      case "/not_found":
      default:
        return <div>not found</div>
    }
  }
}
