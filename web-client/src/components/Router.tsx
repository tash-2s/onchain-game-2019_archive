import * as React from "react"

import { RouteState } from "../constants"

import { UsersContainer } from "../containers/routed/UsersContainer"
import { UserContainer } from "../containers/routed/UserContainer"
import { About } from "./routed/About"

export function Router(props: { route: RouteState }) {
  switch (props.route.id) {
    case "/":
      return <h1 className={"title"}>top</h1>
    case "/users":
      return <UsersContainer />
    case "/:address":
      return <UserContainer />
    case "/about":
      return <About />
    case "/not_found":
    default:
      return <div>not found</div>
  }
}
