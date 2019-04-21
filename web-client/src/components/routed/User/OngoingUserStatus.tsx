import * as React from "react"

import { ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { OngoingGoldTimerComponent } from "./OngoingGoldTimerComponent"
import { UserPlanetsMapUtil } from "../../../models/UserPlanetsMapUtil"

export class OngoingUserStatus extends OngoingGoldTimerComponent<{
  user: ExtendedTargetUserState
}> {
  render = () => {
    const radius = UserPlanetsMapUtil.mapRadiusFromGold(this.state.ongoingGold)
    return (
      <div>
        <div>ongoing gold: {this.state.ongoingGold}</div>
        <div>current usable radius: {radius}</div>
        <div>
          required gold for next radius: {UserPlanetsMapUtil.requiredGoldFromMapRadius(radius + 1)}
        </div>
      </div>
    )
  }
}
