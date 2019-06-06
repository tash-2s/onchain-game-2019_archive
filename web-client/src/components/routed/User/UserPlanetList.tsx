import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { UserPlanet } from "./UserPlanet"

interface UserPlanetListProps {
  user: ComputedTargetUserState
  isMine: boolean
  now: number
  rankup: (userPlanetId: string, targetRank: number) => void
  remove: (userPlanetId: string) => void
}

export function UserPlanetList(props: UserPlanetListProps) {
  const userPlanets = props.user.userNormalPlanets.map(up => (
    <tr key={up.id}>
      <td>
        <UserPlanet
          userPlanet={up}
          isMine={props.isMine}
          techPower={props.user.techPower}
          now={props.now}
          rankup={props.rankup}
          remove={props.remove}
        />
      </td>
    </tr>
  ))

  return (
    <table className={"table is-bordered is-fullwidth"}>
      <tbody>{userPlanets}</tbody>
    </table>
  )
}
