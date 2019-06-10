import { AbstractActions } from "./AbstractActions"
import { RouteState } from "../constants"

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

  static startLoading = CommonActions.creator("startLoading")
  startLoading = () => {
    this.dispatch(CommonActions.startLoading())
  }

  static stopLoading = CommonActions.creator("stopLoading")
  stopLoading = () => {
    this.dispatch(CommonActions.stopLoading())
  }
}
