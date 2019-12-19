import { actionCreatorFactory } from "typescript-fsa"
import { AppActions } from "./AppActions"

export abstract class AbstractActions {
  protected static getActionCreator() {
    return actionCreatorFactory(this.name)
  }
  protected dispatch: (action: any) => any

  constructor(dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  protected showError = (message: string) => {
    new AppActions(this.dispatch).showError(message)
  }

  protected withLoading = async (fn: () => void) => {
    // TODO: this is weird
    new AppActions(this.dispatch).startLoading()
    await fn()
    new AppActions(this.dispatch).stopLoading()
  }
}
