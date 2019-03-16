import * as React from "react"
import { RouteId } from "../../types/commonTypes"
import { historyLib, combineRouteIdAndParams } from "../../misc/route"

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

    if (to === "/") {
      return to
    }

    let path: string

    if (isRouteIdWithParamsObj(to)) {
      path = combineRouteIdAndParams(to[0], to[1])
    } else {
      path = to
    }

    return `#${path}`
  }

  go = (e: React.FormEvent) => {
    e.preventDefault()
    historyLib.push(this.getPath())
  }
}
