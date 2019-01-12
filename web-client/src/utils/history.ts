import { createBrowserHistory } from "history"
import { routes } from "../constants/appConstants"
import { RouteId } from "../types/appTypes"
import { AppActions } from "../actions/AppActions"

export const history = createBrowserHistory()

export const registerStore = store => {
  history.listen((location, action) => {
    const routeId = convertPathnameToRouteId(location.pathname)
    new AppActions(store.dispatch).changeRoute(routeId)
  })
}

export const convertPathnameToRouteId = (pathname: string): RouteId => {
  let routeId: RouteId = "/not_found"

  routes.forEach(route => {
    if (route.regExp.test(pathname)) {
      routeId = route.routeId
    }
  })

  return routeId
}
