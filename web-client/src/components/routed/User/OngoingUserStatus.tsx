import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { UserPlanetsMapUtil } from "../../../models/UserPlanetsMapUtil"
import { PrettyBN } from "../../utils/PrettyBN"

export function OngoingUserStatus(props: { user: ComputedTargetUserState }) {
  const radius = props.user.mapRadius
  const requiredGold = UserPlanetsMapUtil.requiredGoldFromMapRadius(radius + 1)
  let requiredGoldText: JSX.Element
  if (requiredGold) {
    requiredGoldText = <PrettyBN bn={requiredGold} />
  } else {
    requiredGoldText = <span>already maximum</span>
  }

  return (
    <div>
      <div>
        ongoing gold: <PrettyBN bn={props.user.gold} />
      </div>
      <div>current usable radius: {radius}</div>
      <div>required gold for next radius: {requiredGoldText}</div>
    </div>
  )
}
