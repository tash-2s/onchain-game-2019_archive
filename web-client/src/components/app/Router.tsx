import * as React from "react"

import { RouteState } from "../../constants"

import { UsersPageContainer } from "../../containers/UsersPageContainer"
import { UserPageContainer } from "../../containers/UserPageContainer"
import { AboutPage } from "../AboutPage"

export function Router(props: { route: RouteState }) {
  switch (props.route.id) {
    case "/":
      return <h1 className={"title"}>top</h1>
    case "/users":
      return <UsersPageContainer />
    case "/:address":
      return <UserPageContainer />
    case "/about":
      return <AboutPage />
    case "/not_found":
    default:
      return <div>not found</div>
  }
}
