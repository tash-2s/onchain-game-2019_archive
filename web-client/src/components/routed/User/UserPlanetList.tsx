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
    <>
      <Controller />
      <table className={"table is-bordered is-fullwidth"}>
        <tbody>{userPlanets}</tbody>
      </table>
    </>
  )
}

function Controller() {
  return (
    <nav className={"level"}>
      <div className={"level-left"}>
        <div className={"level-item"}>
          <div className={"tabs is-toggle"}>
            <ul>
              <li className={"is-active"}>
                <a>All</a>
              </li>
              <li>
                <a>Residence</a>
              </li>
              <li>
                <a>Goldvein</a>
              </li>
              <li>
                <a>Technology</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={"level-right"}>
        <div className={"level-item"}>
          <div className={"dropdown is-hoverable"}>
            <div className={"dropdown-trigger"}>
              <button className={"button"}>ABC ⇅</button>
            </div>
            <div className={"dropdown-menu"}>
              <div className={"dropdown-content"}>
                <a className={"dropdown-item"}>DEF</a>
                <a className={"dropdown-item"}>GHI</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
