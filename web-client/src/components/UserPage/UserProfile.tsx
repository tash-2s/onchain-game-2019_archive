import * as React from "react"
import BN from "bn.js"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { PrettyBN } from "../utils/PrettyBN"
import { initialInGameAsteriskIds, getInGameAsterisk } from "../../data/InGameAsterisks"

export function UserProfile(props: { user: ComputedTargetUserState; isMine: boolean }) {
  return (
    <div className={"box"}>
      <OngoingUserStatus user={props.user} />
      Gold Per Sec: <PrettyBN bn={props.user.goldPerSec} />
      <br />
      Residential Population: <PrettyBN bn={props.user.population} />
      <br />
      Gold Productivity: <PrettyBN bn={props.user.productivity} />
      <br />
      Technical Knowledge: {props.user.knowledge.toLocaleString()}
    </div>
  )
}

function OngoingUserStatus(props: { user: ComputedTargetUserState }) {
  const radius = props.user.userAsteriskMap.usableRadius
  let requiredGoldText: JSX.Element
  if (props.user.userAsteriskMap.requiredGoldForNextRadius) {
    requiredGoldText = <PrettyBN bn={props.user.userAsteriskMap.requiredGoldForNextRadius} />
  } else {
    requiredGoldText = <span>already maximum</span>
  }

  let gold: BN
  if (props.user.gold.eqn(0) && props.user.userInGameAsterisks.length === 0) {
    gold = getInGameAsterisk(initialInGameAsteriskIds[0]).priceGold.add(
      getInGameAsterisk(initialInGameAsteriskIds[1]).priceGold
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
