import { AbstractActions } from "./AbstractActions"

export class TimeActions extends AbstractActions {
  private static creator = TimeActions.getActionCreator()

  static updateTime = TimeActions.creator<{ webTime: number; loomTime: number }>("updateTime")
  updateTime = (webTime: number, loomTime: number) => {
    this.dispatch(TimeActions.updateTime({ webTime, loomTime }))
  }

  static updateWebTime = TimeActions.creator<number>("updateWebTime")
  updateWebTime = (webTime: number) => {
    this.dispatch(TimeActions.updateWebTime(webTime))
  }
}
