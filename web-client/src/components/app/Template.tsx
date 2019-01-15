import * as React from "react"
import { InternalLink } from "../utils/InternalLink"
import { InternalLinkButton } from "../utils/InternalLinkButton"

export class Template extends React.Component<{}, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: any) {
    // TODO: log error
  }

  render = () => {
    return (
      <div>
        {this.showNav()}
        {this.showErrorOrChildren()}
      </div>
    )
  }

  showNav = () => {
    return (
      <ul>
        <li>
          <InternalLink to={"/"}>index</InternalLink>
        </li>
        <li>
          <InternalLinkButton to={"/test"}>test</InternalLinkButton>
        </li>
        <li>
          <InternalLink to={["/users/:id", { id: "test" }]}>
            /users/test
          </InternalLink>
        </li>
        <hr />
      </ul>
    )
  }

  showErrorOrChildren = () => {
    if (this.state.hasError) {
      const clickHandle = () => window.location.replace("/")
      return (
        <div>
          <p>Something went wrong.</p>

          <button onClick={clickHandle}>Reload</button>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}
