import { createBrowserHistory } from "history"
import { RouteId } from "../types/appTypes"
import { AppActions } from "../actions/AppActions"

export const history = createBrowserHistory()

export const registerStore = store => {
  history.listen((location, action) => {
    const routeId: RouteId = location.pathname as RouteId // TODO: fix
    new AppActions(store.dispatch).changeRoute(routeId)
  })
}
