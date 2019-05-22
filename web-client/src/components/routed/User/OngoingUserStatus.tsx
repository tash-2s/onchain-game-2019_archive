import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { UserPlanetsMapUtil } from "../../../models/UserPlanetsMapUtil"

export class OngoingUserStatus extends React.Component<{ user: ComputedTargetUserState }> {
  render = () => {
    const radius = this.props.user.mapRadius
    const requiredGold = UserPlanetsMapUtil.requiredGoldFromMapRadius(radius + 1)
    let requiredGoldText: string
    if (requiredGold) {
      requiredGoldText = requiredGold.toLocaleString()
    } else {
      requiredGoldText = "already maximum"
    }
    return (
      <div>
        <div>ongoing gold: {this.props.user.gold}</div>
        <div>current usable radius: {radius}</div>
        <div>required gold for next radius: {requiredGoldText}</div>
      </div>
    )
  }
}
