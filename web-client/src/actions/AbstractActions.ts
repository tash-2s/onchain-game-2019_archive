import { actionCreatorFactory } from "typescript-fsa"

export abstract class AbstractActions {
  protected static getActionCreator() {
    return actionCreatorFactory(this.name)
  }
  protected dispatch: (action: any) => any

  constructor(dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }
}
