import * as React from "react"
import { InternalLink } from "../utils/InternalLink"
import { InternalLinkButton } from "../utils/InternalLinkButton"

// This component will contain navbar and error message section
export class Template extends React.Component {
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
        {this.props.children}
      </div>
    )
  }
}
