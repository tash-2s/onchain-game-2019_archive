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
    new CommonActions(this.dispatch).throwError(error)
  }

  protected withLoading = async (fn: () => void) => {
    new CommonActions(this.dispatch).startLoading()
    await fn()
    new CommonActions(this.dispatch).stopLoading()
  }
}
