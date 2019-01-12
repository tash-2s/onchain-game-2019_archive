import actionCreatorFactory from "typescript-fsa"
import { RouteIdWithParams } from "../types/appTypes"

export class AppActions {
  private static readonly actionCreator = actionCreatorFactory("AppActions")
  private dispatch: (action: any) => any

  constructor(dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  static readonly test = AppActions.actionCreator("test")
  test = () => {
    this.dispatch(AppActions.test())
  }

  static readonly changeRoute = AppActions.actionCreator<RouteIdWithParams>(
    "changeRoute"
  )
  changeRoute = (routeIdWithParams: RouteIdWithParams) => {
    this.dispatch(AppActions.changeRoute(routeIdWithParams))
  }
}
