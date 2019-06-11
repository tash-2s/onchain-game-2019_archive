import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { UserPlanet } from "./UserPlanet"
import { UserPageUiState } from "../../../reducers/userPageUiReducer"
import { userPlanetSortKinds, planetKindsWithAll } from "../../../constants"
import { UserPageUiActions } from "../../../actions/UserPageUiActions"

interface UserPlanetListProps {
  user: ComputedTargetUserState
  isMine: boolean
  now: number
  rankup: (userPlanetId: string, targetRank: number) => void
  remove: (userPlanetId: string) => void
  ui: UserPageUiState
  uiActions: UserPageUiActions
}

export function UserPlanetList(props: UserPlanetListProps) {
  const selectedKind = props.ui.selectedUserPlanetKindForUserPlanetList
  const userPlanets = props.user.userNormalPlanets
    .filter(up => {
      if (selectedKind === "all") {
        return true
      }
      return up.planet.kind === selectedKind
    })
    .sort((a, b) => {
      switch (props.ui.selectedSortKindForUserPlanetList) {
        case "Newest":
          return b.createdAt - a.createdAt
        case "Oldest":
          return a.createdAt - b.createdAt
        default:
          throw new Error("undefined sort kind")
      }
    })
    .map(up => (
      <tr key={up.id}>
        <td>
          <UserPlanet
            userPlanet={up}
            isMine={props.isMine}
            knowledge={props.user.knowledge}
            now={props.now}
            rankup={props.rankup}
            remove={props.remove}
          />
        </td>
      </tr>
    ))

  return (
    <>
      <Controller state={props.ui} actions={props.uiActions} />
      <table className={"table is-bordered is-fullwidth"}>
        <tbody>{userPlanets}</tbody>
      </table>
    </>
  )
}

function Controller(props: { state: UserPageUiState; actions: UserPageUiActions }) {
  const planetKind = props.state.selectedUserPlanetKindForUserPlanetList
  const sortKind = props.state.selectedSortKindForUserPlanetList
  const selectKind = (_kind: typeof planetKind) => () =>
    props.actions.selectUserPlanetKindForUserPlanetList(_kind)

  const sortItems = userPlanetSortKinds.map(k => {
    const cls = k === sortKind ? "is-active" : ""
    const fn =
      k === sortKind
        ? () => {
            /* nop */
          }
        : () => props.actions.selectSortKindForUserPlanetList(k)

    return (
      <a key={k} onClick={fn} className={`dropdown-item ${cls}`}>
        {k}
      </a>
    )
  })

  const kinds = planetKindsWithAll.map(k => {
    return (
      <li key={k} className={planetKind === k ? "is-active" : ""}>
        <a onClick={selectKind(k)}>{k.slice(0, 1).toUpperCase() + k.slice(1)}</a>
      </li>
    )
  })

  return (
    <nav className={"level"}>
      <div className={"level-left"}>
        <div className={"level-item"}>
          <div className={"tabs is-toggle"}>
            <ul>{kinds}</ul>
          </div>
        </div>
      </div>

      <div className={"level-right"}>
        <div className={"level-item"}>
          <div className={"dropdown is-hoverable"}>
            <div className={"dropdown-trigger"}>
              <button className={"button"}>{sortKind} ⇅</button>
            </div>
            <div className={"dropdown-menu"}>
              <div className={"dropdown-content"}>{sortItems}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
