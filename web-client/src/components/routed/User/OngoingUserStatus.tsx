import * as React from "react"

import { ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { OngoingGoldTimerComponent } from "./OngoingGoldTimerComponent"

export class OngoingUserStatus extends OngoingGoldTimerComponent<{
  user: ExtendedTargetUserState
}> {
  render = () => {
    return <p>ongoing gold: {this.state.ongoingGold}</p>
  }
}
