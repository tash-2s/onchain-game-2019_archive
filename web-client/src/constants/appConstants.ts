const pathToRegexp = require("path-to-regexp")
import { _ROUTE_IDS, RouteId } from "../types/appTypes"

// export const ROUTE_IDS = _ROUTE_IDS

class Route {
  constructor(
    public readonly routeId: RouteId,
    public readonly regExp: RegExp
  ) {}
}

const _routes: Array<Route> = []
_ROUTE_IDS.forEach(routeId => {
  _routes.push(new Route(routeId, pathToRegexp(routeId)))
})

export const routes = _routes
