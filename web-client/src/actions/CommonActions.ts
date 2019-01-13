import { AbstractActions } from "./AbstractActions"
import { RouteIdWithParams } from "../types/commonTypes"

export class CommonActions extends AbstractActions {
  private static creator = CommonActions.getActionCreator()
  static readonly changeRoute = CommonActions.creator<RouteIdWithParams>(
    "changeRoute"
  )

  // this should be called only from the history listener
  changeRoute = (routeIdWithParams: RouteIdWithParams) => {
    this.dispatch(CommonActions.changeRoute(routeIdWithParams))
  }
}
