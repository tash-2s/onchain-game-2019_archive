import { actionCreatorFactory } from "typescript-fsa"

export class AbstractActions {
  protected static getActionCreator() {
    return actionCreatorFactory(this.name)
  }
  protected dispatch: (action: any) => any

  constructor(dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }

  handleError = (e: Error) => {
    console.error(e)
    // TODO: kick the method to show this error to the user on the template, and log
  }
}
