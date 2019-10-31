import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { ComputedUserPageUIState } from "../../computers/userPageUIComputer"
import { UserPlanet } from "./UserPlanet"
import { userPlanetSortKinds, planetKindsWithAll } from "../../constants"
import { UserPageUIActions } from "../../actions/UserPageUIActions"
import { UserPageActionsProps } from "../../containers/UserPageContainer"

export function UserPlanetList(props: {
  user: ComputedTargetUserState
  userActions: UserPageActionsProps["userActions"]
  userPageUI: ComputedUserPageUIState
  userPageUIActions: UserPageUIActions
  now: number
  isMine: boolean
}) {
  const selectedKind = props.userPageUI.selectedPlanetKind
  const userPlanets = props.userPageUI.listedUserNormalPlanets.map(up => (
    <tr key={up.id}>
      <td>
        <UserPlanet
          userPlanet={up}
          isMine={props.isMine}
          knowledge={props.user.knowledge}
          now={props.now}
          userActions={props.userActions}
        />
      </td>
    </tr>
  ))

  let batchRankupButton = <></>
  if (props.userPageUI.batchRankupable.length > 0) {
    const fn = () => props.userActions.normal.rankupUserPlanets(props.userPageUI.batchRankupable)
    batchRankupButton = <button onClick={fn}>batch rankup</button>
  }

  return (
    <>
      <Controller state={props.userPageUI} actions={props.userPageUIActions} />
      <div>{batchRankupButton}</div>
      <table className={"table is-bordered is-fullwidth"}>
        <tbody>{userPlanets}</tbody>
      </table>
    </>
  )
}

function Controller(props: { state: ComputedUserPageUIState; actions: UserPageUIActions }) {
  const planetKind = props.state.selectedPlanetKind
  const sortKind = props.state.selectedUserPlanetSortKind
  const selectKind = (_kind: typeof planetKind) => () => props.actions.selectPlanetKind(_kind)

  const sortItems = userPlanetSortKinds.map(k => {
    const cls = k === sortKind ? "is-active" : ""
    const fn =
      k === sortKind
        ? () => {
            /* nop */
          }
        : () => props.actions.selectUserPlanetSortKind(k)

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
