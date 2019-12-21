import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { ComputedUserPageUIState } from "../../computers/userPageUIComputer"
import { UserAsterisk } from "./UserAsterisk"
import { userAsterisksSortKinds, asteriskKindsWithAll } from "../../constants"
import { UserPageUIActions } from "../../actions/UserPageUIActions"
import { UserPageActionsProps } from "../../containers/UserPageContainer"

export function UserAsteriskList(props: {
  user: ComputedTargetUserState
  userActions: UserPageActionsProps["userActions"]
  userPageUI: ComputedUserPageUIState
  userPageUIActions: UserPageUIActions
  now: number
  isMine: boolean
}) {
  const selectedKind = props.userPageUI.selectedAsteriskKindForUserAsteriskList
  const userAsterisks = props.userPageUI.listedUserInGameAsterisks.map(up => (
    <tr key={up.id}>
      <td>
        <UserAsterisk
          userAsterisk={up}
          isMine={props.isMine}
          knowledge={props.user.knowledge}
          now={props.now}
          userActions={props.userActions}
        />
      </td>
    </tr>
  ))

  let batchRankupButton = <></>
  if (props.isMine && props.userPageUI.batchRankupable.length > 0) {
    const fn = () => props.userActions.inGame.rankupUserAsterisks(props.userPageUI.batchRankupable)
    batchRankupButton = <button onClick={fn}>batch rankup</button>
  }

  return (
    <>
      <Controller state={props.userPageUI} actions={props.userPageUIActions} />
      <div>{batchRankupButton}</div>
      <table className={"table is-bordered is-fullwidth"}>
        <tbody>{userAsterisks}</tbody>
      </table>
    </>
  )
}

function Controller(props: { state: ComputedUserPageUIState; actions: UserPageUIActions }) {
  const asteriskKind = props.state.selectedAsteriskKindForUserAsteriskList
  const sortKind = props.state.selectedSortKindForUserAsteriskList
  const selectKind = (_kind: typeof asteriskKind) => () =>
    props.actions.selectAsteriskKindForUserAsteriskList(_kind)

  const sortItems = userAsterisksSortKinds.map(k => {
    const cls = k === sortKind ? "is-active" : ""
    const fn =
      k === sortKind
        ? () => {
            /* nop */
          }
        : () => props.actions.selectSortKindForUserAsteriskList(k)

    return (
      <a key={k} onClick={fn} className={`dropdown-item ${cls}`}>
        {k}
      </a>
    )
  })

  const kinds = asteriskKindsWithAll.map(k => {
    return (
      <li key={k} className={asteriskKind === k ? "is-active" : ""}>
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
