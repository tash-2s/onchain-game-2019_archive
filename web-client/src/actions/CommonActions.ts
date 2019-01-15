import { AbstractActions } from "./AbstractActions"
import { RouteState } from "../types/commonTypes"

export class CommonActions extends AbstractActions {
  private static creator = CommonActions.getActionCreator()

  static changeRoute = CommonActions.creator<RouteState>("changeRoute")
  // this should be called only from the history listener
  changeRoute = (routeIdWithParams: RouteState) => {
    this.dispatch(CommonActions.changeRoute(routeIdWithParams))
  }

  static throwError = CommonActions.creator<Error>("throwError")
  throwError = (error: Error, showOnConsole = true, info?: any) => {
    // TODO: log error to somewhere server
    if (showOnConsole) {
      console.error(error, info)
    }
    this.dispatch(CommonActions.throwError(error))
  }
}
