import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { OngoingGoldTimerComponent } from "./OngoingGoldTimerComponent"
import { UserPlanetsMapUtil } from "../../../models/UserPlanetsMapUtil"

export class OngoingUserStatus extends OngoingGoldTimerComponent<{
  user: ComputedTargetUserState
  loomTimeDifference: number
}> {
  render = () => {
    const radius = UserPlanetsMapUtil.mapRadiusFromGold(this.state.ongoingGold)
    const requiredGold = UserPlanetsMapUtil.requiredGoldFromMapRadius(radius + 1)
    let requiredGoldText: string
    if (requiredGold) {
      requiredGoldText = requiredGold.toLocaleString()
    } else {
      requiredGoldText = "already maximum"
    }
    return (
      <div>
        <div>ongoing gold: {this.state.ongoingGold.toLocaleString()}</div>
        <div>current usable radius: {radius}</div>
        <div>required gold for next radius: {requiredGoldText}</div>
      </div>
    )
  }
}
