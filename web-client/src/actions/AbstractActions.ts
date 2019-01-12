import actionCreatorFactory from "typescript-fsa"

export class AbstractActions {
  protected static actionCreator() {
    return actionCreatorFactory(this.name)
  }
  protected dispatch: (action: any) => any

  constructor(dispatch: (action: any) => any) {
    this.dispatch = dispatch
  }
}
