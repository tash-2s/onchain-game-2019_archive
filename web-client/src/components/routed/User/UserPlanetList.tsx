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

export class UserPlanetList extends React.Component<UserPlanetListProps> {
  render = () => {
    const userPlanets = this.props.user.userNormalPlanets.map(up => (
      <tr key={up.id}>
        <td>
          <UserPlanet
            userPlanet={up}
            isMine={this.props.isMine}
            techPower={this.props.user.techPower}
            now={this.props.now}
            rankup={this.props.rankup}
            remove={this.props.remove}
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
}
