import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { OngoingUserStatus } from "./OngoingUserStatus"
import { PrettyBN } from "../../utils/PrettyBN"

export function UserProfile(props: { user: ComputedTargetUserState; isMine: boolean }) {
  return (
    <div className={"box"}>
      <OngoingUserStatus user={props.user} />
      population: <PrettyBN bn={props.user.population} />
      <br />
      gold power: <PrettyBN bn={props.user.goldPower} />
      <br />
      tech power: {props.user.techPower.toLocaleString()}
      <br />
      gold per sec: <PrettyBN bn={props.user.goldPerSec} />
    </div>
  )
}
