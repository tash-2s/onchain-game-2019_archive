import * as React from "react"
import { AppProps } from "../containers/AppContainer"
import { InternalLink } from "./utils/InternalLink"
import { InternalLinkButton } from "./utils/InternalLinkButton"

export class App extends React.Component<AppProps> {
  render = () => {
    return (
      <div>
        <ul>
          <li>
            <InternalLink to={"/"}>index</InternalLink>
          </li>
          <li>
            <InternalLinkButton to={"/test"}>test</InternalLinkButton>
          </li>
          <hr />
        </ul>
        {this.route()}
      </div>
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
