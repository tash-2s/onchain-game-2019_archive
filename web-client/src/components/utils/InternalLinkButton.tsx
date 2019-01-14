import * as React from "react"
import { InternalLink } from "./InternalLink"

export class InternalLinkButton extends InternalLink {
  render = () => {
    // in the future, `<a class="button">Button</a>` will be used (because it can have a href)
    return <button onClick={this.go}>{this.props.children}</button>
  }
}
