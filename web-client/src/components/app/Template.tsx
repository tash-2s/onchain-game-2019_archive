import * as React from "react"
import { InternalLink } from "../utils/InternalLink"
import { InternalLinkButton } from "../utils/InternalLinkButton"

export class Template extends React.Component<{
  isError: boolean
  throwError: (e: Error, b: boolean, info?: any) => void
}> {
  componentDidCatch(error: Error, info: any) {
    if (!this.props.isError) {
      this.props.throwError(error, false, info)
    }
  }

  render = () => {
    return (
      <div>
        {this.getNav()}
        {this.getErrorOrChildren()}
      </div>
    )
  }

  getNav = () => {
    // when an error occurs, this should be un-clickable, because the store will continue to have the error state
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

  getErrorOrChildren = () => {
    if (this.props.isError) {
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
