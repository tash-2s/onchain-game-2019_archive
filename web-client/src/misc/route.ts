import { createBrowserHistory } from "history"
import { Store } from "redux"
import { _routeIds, RouteId, RouteState } from "../types/commonTypes"
import { CommonActions } from "../actions/CommonActions"
const pathToRegexp = require("path-to-regexp")

class Route {
  constructor(
    public readonly routeId: RouteId,
    public readonly regExp: RegExp
  ) {}
}
const routes = ((): Array<Route> => {
  const rs: Array<Route> = []
  _routeIds.forEach(routeId => {
    rs.push(new Route(routeId, pathToRegexp(routeId)))
  })
  return rs
})()

export const historyLib = createBrowserHistory()

export const registerStore = (store: Store) => {
  historyLib.listen((location, action) => {
    const rwp = convertPathnameToRouteIdWithParams(location.pathname)
    new CommonActions(store.dispatch).changeRoute(rwp)
  })
}

export const convertPathnameToRouteIdWithParams = (
  pathname: string
): RouteState => {
  let routeId: RouteId = "/not_found"
  let params: string[] = []

  routes.forEach(route => {
    const p = route.regExp.exec(pathname)
    if (p) {
      routeId = route.routeId
      params = p.slice(1) // first element is a matched path, so it's same with routeId
    }
  })

  return { id: routeId, params: params }
}

export const combineRouteIdAndParams = (id: RouteId, obj: object): string => {
  return pathToRegexp.compile(id)(obj)
}
