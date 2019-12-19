import { AbstractActions } from "./AbstractActions"
import { RouteState } from "../constants"

export class AppActions extends AbstractActions {
  private static creator = AppActions.getActionCreator()

  static changeRoute = AppActions.creator<RouteState>("changeRoute")
  // this should be called only from the history listener
  changeRoute = (routeIdWithParams: RouteState) => {
    this.dispatch(AppActions.changeRoute(routeIdWithParams))
  }

  static startLoading = AppActions.creator("startLoading")
  startLoading = () => {
    this.dispatch(AppActions.startLoading())
  }

  static stopLoading = AppActions.creator("stopLoading")
  stopLoading = () => {
    this.dispatch(AppActions.stopLoading())
  }

  static showError = AppActions.creator<string>("showError")
  showError = (message: string) => {
    this.dispatch(AppActions.showError(message))
  }
}
