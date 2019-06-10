import { AbstractActions } from "./AbstractActions"
import { RouteState } from "../constants"

export class AppActions extends AbstractActions {
  private static creator = AppActions.getActionCreator()

  static changeRoute = AppActions.creator<RouteState>("changeRoute")
  // this should be called only from the history listener
  changeRoute = (routeIdWithParams: RouteState) => {
    this.dispatch(AppActions.changeRoute(routeIdWithParams))
  }

  static throwError = AppActions.creator<Error>("throwError")
  throwError = (error: Error, showOnConsole = true, info?: any) => {
    // TODO: log error to somewhere server
    if (showOnConsole) {
      console.error(error, info)
    }
    this.dispatch(AppActions.throwError(error))
  }

  static startLoading = AppActions.creator("startLoading")
  startLoading = () => {
    this.dispatch(AppActions.startLoading())
  }

  static stopLoading = AppActions.creator("stopLoading")
  stopLoading = () => {
    this.dispatch(AppActions.stopLoading())
  }
}
