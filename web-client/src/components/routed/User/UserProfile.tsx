import * as React from "react"

import { ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { OngoingUserStatus } from "./OngoingUserStatus"

export function UserProfile(props: { user: ExtendedTargetUserState; isMine: boolean }) {
  return (
    <div>
      target user is {props.user.address} {props.isMine ? "[this is me]" : ""}
      <OngoingUserStatus user={props.user} />
      population: {props.user.population}
      <br />
      gold power: {props.user.goldPower}
      <br />
      tech power: {props.user.techPower}
      <br />
      gold per sec: {props.user.goldPerSec}
    </div>
  )
}
