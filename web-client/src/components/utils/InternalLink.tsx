import * as React from "react"
import { RouteId } from "../../types/commonTypes"
import { history, combineRouteIdAndParams } from "../../utils/route"

type RouteIdWithParamsObj = [RouteId, { id: string }]
const isRouteIdWithParamsObj = (arg: any): arg is RouteIdWithParamsObj => {
  return "object" === typeof arg && "object" === typeof arg[1]
}

export interface InternalLinkProps {
  to: RouteId | RouteIdWithParamsObj
}

export class InternalLink extends React.Component<InternalLinkProps> {
  render = () => {
    return (
      <a href={this.getPath()} onClick={this.go}>
        {this.props.children}
      </a>
    )
  }

  getPath = (): string => {
    const to = this.props.to
    if (isRouteIdWithParamsObj(to)) {
      return combineRouteIdAndParams(to[0], to[1])
    } else {
      return to
    }
  }

  go = (e: React.FormEvent) => {
    e.preventDefault()
    history.push(this.getPath())
  }
}
