import { actionCreatorFactory } from "typescript-fsa"
import { CommonActions } from "./CommonActions"

export class AbstractActions {
  protected static getActionCreator() {
    return actionCreatorFactory(this.name)
  }
  protected dispatch: (action: any) => any

  constructor(dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  protected handleError = (error: Error) => {
    // is this ok?
    new CommonActions(this.dispatch).throwError(error)
  }
}
