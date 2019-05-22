import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { OngoingUserStatus } from "./OngoingUserStatus"

export function UserProfile(props: { user: ComputedTargetUserState; isMine: boolean }) {
  return (
    <div>
      target user is {props.user.address} {props.isMine ? "[this is me]" : ""}
      <OngoingUserStatus user={props.user} />
      population: {props.user.population.toLocaleString()}
      <br />
      gold power: {props.user.goldPower.toLocaleString()}
      <br />
      tech power: {props.user.techPower.toLocaleString()}
      <br />
      gold per sec: {props.user.goldPerSec.toLocaleString()}
    </div>
  )
}
