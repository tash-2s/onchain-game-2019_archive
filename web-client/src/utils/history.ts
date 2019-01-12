import { createBrowserHistory } from "history"
import { routes } from "../constants/appConstants"
import { RouteId, RouteIdWithParams } from "../types/appTypes"
import { AppActions } from "../actions/AppActions"

export const history = createBrowserHistory()

export const registerStore = store => {
  history.listen((location, action) => {
    const rwp = convertPathnameToRouteIdWithParams(location.pathname)
    new AppActions(store.dispatch).changeRoute(rwp)
  })
}

export const convertPathnameToRouteIdWithParams = (
  pathname: string
): RouteIdWithParams => {
  let routeId: RouteId = "/not_found"
  let params

  routes.forEach(route => {
    const p = route.regExp.exec(pathname)
    if (p) {
      routeId = route.routeId
      params = p.slice(1) // first element is a matched path, so it's same with routeId
    }
  })

  return { id: routeId, params: params }
}
