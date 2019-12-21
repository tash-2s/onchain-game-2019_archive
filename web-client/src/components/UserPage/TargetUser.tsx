import * as React from "react"

import { CurrentUserState } from "../../reducers/currentUserReducer"
import { ComputedTimeState } from "../../computers/timeComputer"
import { ComputedTargetUserState } from "../../computers/userComputer"
import { ComputedUserPageUIState } from "../../computers/userPageUIComputer"
import { UserPageUIActions } from "../../actions/UserPageUIActions"
import { UserPageActionsProps } from "../../containers/UserPageContainer"

import { UserProfile } from "./UserProfile"
import { UserAsteriskList } from "./UserAsteriskList"
import { UserAsteriskMap } from "./UserAsteriskMap"
import { AsteriskList } from "./AsteriskList"

export function TargetUser(props: {
  currentUser: CurrentUserState
  time: ComputedTimeState
  targetUser: ComputedTargetUserState
  userActions: UserPageActionsProps["userActions"]
  userPageUI: ComputedUserPageUIState
  userPageUIActions: UserPageUIActions
}) {
  const isMine = (() => {
    const address = props.currentUser.loomAddress
    if (address) {
      return address === props.targetUser.address
    } else {
      return false
    }
  })()

  const goTokensView = () => props.userPageUIActions.selectPageViewKind("tokens")

  return (
    <>
      <h1 className={"title is-5"}>
        target user is {props.targetUser.address} {isMine ? "[this is me]" : ""}
        {isMine ? <div>eth: {props.currentUser.ethAddress}</div> : <></>}
        {isMine ? <button onClick={goTokensView}>see tokens view</button> : <></>}
      </h1>

      <div className={"columns is-desktop"}>
        <div className={"column"}>
          <UserProfile user={props.targetUser} isMine={isMine} />
          <WrappedAsteriskList
            targetUser={props.targetUser}
            userPageUI={props.userPageUI}
            userPageUIActions={props.userPageUIActions}
            isMine={isMine}
          />
        </div>

        <div className={`column is-three-quarters`}>
          <Buttons actions={props.userPageUIActions} />
          <ViewKindRouter
            targetUser={props.targetUser}
            userActions={props.userActions}
            userPageUI={props.userPageUI}
            userPageUIActions={props.userPageUIActions}
            now={props.time.now}
            isMine={isMine}
          />
        </div>
      </div>
    </>
  )
}

function WrappedAsteriskList(props: {
  targetUser: ComputedTargetUserState
  userPageUI: ComputedUserPageUIState
  userPageUIActions: UserPageUIActions
  isMine: boolean
}) {
  if (!props.isMine) {
    return <></>
  }

  return (
    <>
      <div
        className={"is-hidden-desktop box is-shadowless is-marginless"}
        style={{ textAlign: "center" }}
      >
        <button
          className={"button is-small is-primary"}
          onClick={props.userPageUIActions.toggleAsteriskListVisibilityForMobile}
        >
          {props.userPageUI.asteriskListVisibilityForMobile ? "Hide" : "Show"} Asterisk List
        </button>
      </div>

      <div className={props.userPageUI.asteriskListVisibilityForMobile ? "" : "is-hidden-touch"}>
        <AsteriskList
          asterisks={props.targetUser.inGameAsterisks}
          setAsteriskToGet={props.userPageUIActions.selectInGameAsteriskForSet}
          userPageUI={props.userPageUI}
        />
      </div>
    </>
  )
}

function ViewKindRouter(props: {
  targetUser: ComputedTargetUserState
  userActions: UserPageActionsProps["userActions"]
  userPageUI: ComputedUserPageUIState
  userPageUIActions: UserPageUIActions
  now: number
  isMine: boolean
}) {
  switch (props.userPageUI.selectedUserAsterisksViewKind) {
    case "map":
      return (
        <UserAsteriskMap
          user={props.targetUser}
          userActions={props.userActions}
          userPageUI={props.userPageUI}
          userPageUIActions={props.userPageUIActions}
          now={props.now}
          isMine={props.isMine}
        />
      )
    case "list":
      return (
        <UserAsteriskList
          user={props.targetUser}
          userActions={props.userActions}
          userPageUI={props.userPageUI}
          userPageUIActions={props.userPageUIActions}
          now={props.now}
          isMine={props.isMine}
        />
      )
  }
}

function Buttons(props: { actions: UserPageUIActions }) {
  return (
    <nav className={"level"}>
      <div className={"level-left"}>
        <div className={"level-item"}>
          <button className={"button is-small"} onClick={props.actions.toggleUserAsterisksViewKind}>
            Toggle View
          </button>
        </div>
      </div>

      <div className={"level-right"}>
        <div className={"level-item"} />
      </div>
    </nav>
  )
}
