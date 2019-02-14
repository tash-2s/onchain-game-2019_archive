import { AbstractActions } from "./AbstractActions"

export class AppActions extends AbstractActions {
  private static creator = AppActions.getActionCreator()
}
