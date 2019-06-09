import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { OngoingUserStatus } from "./OngoingUserStatus"
import { PrettyBN } from "../../utils/PrettyBN"

export function UserProfile(props: { user: ComputedTargetUserState; isMine: boolean }) {
  return (
    <div className={"box"}>
      <OngoingUserStatus user={props.user} />
      Residential Population: <PrettyBN bn={props.user.population} />
      <br />
      Gold Productivity: <PrettyBN bn={props.user.productivity} />
      <br />
      Technical Knowledge: {props.user.knowledge.toLocaleString()}
      <br />
      Gold Per Sec: <PrettyBN bn={props.user.goldPerSec} />
    </div>
  )
}
