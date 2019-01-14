import * as React from "react"
import { RouteId } from "../../types/commonTypes"
import { history } from "../../utils/route"

export interface InternalLinkProps {
  to: RouteId
}

export class InternalLink extends React.Component<InternalLinkProps> {
  render = () => {
    return (
      <a href={this.props.to} onClick={this.go}>
        {this.props.children}
      </a>
    )
  }

  go = (e: React.FormEvent) => {
    e.preventDefault()
    history.push(this.props.to)
  }
}
