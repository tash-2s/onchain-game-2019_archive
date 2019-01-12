import { AbstractActions } from "./AbstractActions"
import { RouteIdWithParams } from "../types/appTypes"

export class AppActions extends AbstractActions {
  private static creator = AppActions.actionCreator()
  static readonly changeRoute = AppActions.creator<RouteIdWithParams>(
    "changeRoute"
  )
  changeRoute = (routeIdWithParams: RouteIdWithParams) => {
    this.dispatch(AppActions.changeRoute(routeIdWithParams))
  }
}
