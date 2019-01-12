import * as React from "react"
import { history } from "../../utils/history"
import { InternalLinkProps } from "./InternalLink"

interface InternalLinkButtonProps extends InternalLinkProps {}

export class InternalLinkButton extends React.Component<
  InternalLinkButtonProps
> {
  render = () => {
    // in the future, `<a class="button">Button</a>` will be used (because it can have a href)
    return <button onClick={this.go}>{this.props.children}</button>
  }

  go = () => {
    history.push(this.props.to)
  }
}
