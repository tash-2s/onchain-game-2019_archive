import * as React from "react"

import { CurrentUserState } from "../../reducers/currentUserReducer"
import { ComputedTimeState } from "../../computers/timeComputer"
import { UserPageUiState } from "../../reducers/userPageUiReducer"
import { ComputedTargetUserState } from "../../computers/userComputer"
import { UserPageUiActions } from "../../actions/UserPageUiActions"
import { UserActions } from "../../actions/UserActions"

import { UserProfile } from "./UserProfile"
import { UserPlanetList } from "./UserPlanetList"
import { UserPlanetMap } from "./UserPlanetMap"
import { PlanetList } from "./PlanetList"

export function TargetUser(props: {
  currentUser: CurrentUserState
  time: ComputedTimeState
  targetUser: ComputedTargetUserState
  userActions: UserActions
  userPageUi: UserPageUiState
  userPageUiActions: UserPageUiActions
}) {
  const isMine = (() => {
    const address = props.currentUser.address
    if (address) {
      return address === props.targetUser.address
    } else {
      return false
    }
  })()

  return (
    <>
      <h1 className={"title is-5"}>
        target user is {props.targetUser.address} {isMine ? "[this is me]" : ""}
      </h1>

      <div className={"columns is-desktop"}>
        <div className={"column"}>
          <UserProfile user={props.targetUser} isMine={isMine} />
          <WrappedPlanetList
            targetUser={props.targetUser}
            userPageUi={props.userPageUi}
            userPageUiActions={props.userPageUiActions}
            isMine={isMine}
          />
        </div>

        <div className={`column is-three-quarters`}>
          <Buttons actions={props.userPageUiActions} />
          <UserPlanets
            targetUser={props.targetUser}
            userActions={props.userActions}
            userPageUi={props.userPageUi}
            userPageUiActions={props.userPageUiActions}
            now={props.time.now}
            isMine={isMine}
          />
        </div>
      </div>
    </>
  )
}

function WrappedPlanetList(props: {
  targetUser: ComputedTargetUserState
  userPageUi: UserPageUiState
  userPageUiActions: UserPageUiActions
  isMine: boolean
}) {
  if (props.isMine) {
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
          onClick={props.userPageUiActions.togglePlanetListVisibilityForMobile}
        >
          {props.userPageUi.planetListVisibilityForMobile ? "Hide" : "Show"} Planet List
        </button>
      </div>

      <div className={props.userPageUi.planetListVisibilityForMobile ? "" : "is-hidden-touch"}>
        <PlanetList
          planets={props.targetUser.normalPlanets}
          setPlanetToGet={props.userPageUiActions.selectPlanet}
          userPageUi={props.userPageUi}
        />
      </div>
    </>
  )
}

function UserPlanets(props: {
  targetUser: ComputedTargetUserState
  userActions: UserActions
  userPageUi: UserPageUiState
  userPageUiActions: UserPageUiActions
  now: number
  isMine: boolean
}) {
  switch (props.userPageUi.selectedUserPlanetViewKind) {
    case "map":
      return (
        <UserPlanetMap
          user={props.targetUser}
          userActions={props.userActions}
          userPageUi={props.userPageUi}
          userPageUiActions={props.userPageUiActions}
          now={props.now}
          isMine={props.isMine}
        />
      )
    case "list":
      return (
        <UserPlanetList
          user={props.targetUser}
          userActions={props.userActions}
          userPageUi={props.userPageUi}
          userPageUiActions={props.userPageUiActions}
          now={props.now}
          isMine={props.isMine}
        />
      )
  }
}

function Buttons(props: { actions: UserPageUiActions }) {
  return (
    <nav className={"level"}>
      <div className={"level-left"}>
        <div className={"level-item"}>
          <button className={"button is-small"} onClick={props.actions.toggleUserPlanetViewKind}>
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
