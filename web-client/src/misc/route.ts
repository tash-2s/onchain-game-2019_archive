import { createBrowserHistory } from "history"
import { Store } from "redux"

import { routeIds, RouteId, RouteState } from "../constants"
import { AppActions } from "../actions/AppActions"

class Route {
  readonly routeId: RouteId
  readonly regExp: RegExp

  constructor(routeId: RouteId) {
    this.routeId = routeId
    const str = this.routeId.replace(/:\w+/, "\\w+")
    this.regExp = new RegExp(`^${str}$`)
  }
}

const routes = ((): Array<Route> => {
  const rs: Array<Route> = []
  routeIds.forEach(routeId => {
    rs.push(new Route(routeId))
  })
  return rs
})()

export const historyLib = createBrowserHistory()

export const registerStore = (store: Store) => {
  historyLib.listen((location, _action) => {
    const rwp = convertHashToRouteIdWithParams(location.hash)
    new AppActions(store.dispatch).changeRoute(rwp)
  })
}

export const convertHashToRouteIdWithParams = (hash: string): RouteState => {
  let pathname: string
  if (hash === "") {
    pathname = "/"
  } else {
    pathname = hash.slice(1) // remove '#'
  }

  let routeId: RouteId = "/not_found"
  let params: string[] = []

  routes
    .filter(route => route.routeId !== "/:address")
    .forEach(route => {
      const p = route.regExp.exec(pathname)
      if (p) {
        routeId = route.routeId
        params = p.slice(1) // first element is a matched path, so it's same with routeId
      }
    })

  if (routeId === "/not_found" && pathname.slice(0, 3) === "/0x") {
    routeId = "/:address"
    params = [pathname.slice(1)]
  }

  return { id: routeId, params: params }
}

export const combineRouteIdAndParams = (id: RouteId, obj: object) => {
  let path: string = id

  for (const [key, value] of Object.entries(obj)) {
    path = path.replace(`:${key}`, value)
  }

  return path
}
