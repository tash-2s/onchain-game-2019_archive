import * as React from "react"
import BN from "bn.js"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { PrettyBN } from "../utils/PrettyBN"
import { initialPlanetIds, getNormalPlanet } from "../../data/planets"

export function OngoingUserStatus(props: { user: ComputedTargetUserState }) {
  const radius = props.user.map.usableRadius
  let requiredGoldText: JSX.Element
  if (props.user.map.requiredGoldForNextRadius) {
    requiredGoldText = <PrettyBN bn={props.user.map.requiredGoldForNextRadius} />
  } else {
    requiredGoldText = <span>already maximum</span>
  }

  let gold: BN
  if (props.user.gold.eqn(0) && props.user.userNormalPlanets.length === 0) {
    gold = getNormalPlanet(initialPlanetIds[0]).priceGold.add(
      getNormalPlanet(initialPlanetIds[1]).priceGold
    )
  } else {
    gold = props.user.gold
  }

  return (
    <div>
      <div>
        ongoing gold: <PrettyBN bn={gold} />
      </div>
      <div>current usable radius: {radius}</div>
      <div>required gold for next radius: {requiredGoldText}</div>
    </div>
  )
}
