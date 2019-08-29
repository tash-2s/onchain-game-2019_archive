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
    const address = props.currentUser.loomAddress
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
        {isMine ? <div>eth: {props.currentUser.ethAddress}</div> : <></>}
      </h1>
      {isMine ? <UserTokens user={props.targetUser} userActions={props.userActions} /> : <></>}

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
          <ViewKindRouter
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

function UserTokens(props: { user: ComputedTargetUserState; userActions: UserActions }) {
  React.useEffect(
    () => {
      props.userActions.setTargetUserSpecialPlanetTokens(props.user.address)
    },
    [props.user.address]
  )

  if (props.user.specialPlanetTokens) {
    const reload = () => props.userActions.setTargetUserSpecialPlanetTokens(props.user.address)
    const ethTokens = props.user.specialPlanetTokens.eth.map(tokenId => {
      const onClick = () => props.userActions.transferTokenToLoom(tokenId)
      return (
        <li key={tokenId}>
          {tokenId}
          <button onClick={onClick}>transfer to loom</button>
        </li>
      )
    })
    const msg1 = props.user.specialPlanetTokenTransferToLoomTx
      ? `requested. this can take a while. eth tx: ${props.user.specialPlanetTokenTransferToLoomTx}`
      : ""
    const loomTokens = props.user.specialPlanetTokens.loom.map(tokenId => {
      const onClick = () => props.userActions.transferTokenToEth(tokenId)
      return (
        <li key={tokenId}>
          {tokenId}
          <button onClick={onClick}>transfer to eth</button>
        </li>
      )
    })
    const msg2 = props.user.specialPlanetTokenTransferToEthTx
      ? `requested. tx: ${props.user.specialPlanetTokenTransferToEthTx}`
      : ""
    const resume = () => props.userActions.transferTokenToEth()
    return (
      <div className={"box"}>
        <button onClick={reload}>reload</button>

        <h2 className={"title is-6"}>eth</h2>
        <ul>{ethTokens}</ul>
        <div>{msg1}</div>
        <button onClick={props.userActions.buySpecialPlanetToken}>buy a planet</button>
        <div>{props.user.specialPlanetTokenBuyTx}</div>

        <h2 className={"title is-6"}>loom</h2>
        <ul>{loomTokens}</ul>
        {msg2}
        <button onClick={resume}>resume "transfer to eth"</button>
      </div>
    )
  } else {
    return <div className={"box"}>loading...</div>
  }
}

function WrappedPlanetList(props: {
  targetUser: ComputedTargetUserState
  userPageUi: UserPageUiState
  userPageUiActions: UserPageUiActions
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

function ViewKindRouter(props: {
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
