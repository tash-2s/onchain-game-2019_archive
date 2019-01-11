import * as React from "react"
import { AppProps } from "../containers/AppContainer"
import { history } from "../utils/history"
import { RouteId } from "../types/appTypes"

export class App extends React.Component<AppProps> {
  render = () => {
    return (
      <div>
        <ul>
          <li>
            <button onClick={this.goIndex}>index</button>
          </li>
          <li>
            <button onClick={this.goTest}>test</button>
          </li>
          <hr />
        </ul>
        {this.route()}
      </div>
    )
  }

  goIndex = () => {
    history.push("/")
  }

  goTest = () => {
    history.push("/test")
  }

  route() {
    switch (this.props.app.routeId) {
      case "/":
        return <div>index</div>
      case "/test":
        return (
          <div>
            test<button onClick={this.clickTest}>test</button>
          </div>
        )
      // case "notfound":
      // default:
      //   return <div>not found</div>
    }
  }

  clickTest = () => {
    this.props.actions.test()
  }
}
