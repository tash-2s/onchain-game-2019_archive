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

  protected overallLoading = () => {
    new CommonActions(this.dispatch).overallLoading()
  }
}
