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
import { PlanetArt } from "../utils/PlanetArt"

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
  React.useEffect(() => {
    props.userActions.setTargetUserSpecialPlanetTokens(props.user.address)
  }, [props.user.address])

  if (props.user.specialPlanetToken) {
    const reload = () => props.userActions.setTargetUserSpecialPlanetTokens(props.user.address)
    const ethTokens = props.user.specialPlanetToken.ethTokens.map(token => {
      const onClick = () => props.userActions.transferSpecialPlanetTokenToLoom(token.id)
      return (
        <li key={token.id}>
          {token.id}:{token.shortId}:{token.version}:{token.kind}:
          {token.originalParamCommonLogarithm}:{token.artSeed.toString()}
          <PlanetArt kind={token.kind} artSeed={token.artSeed} canvasSize={100} />
          <button onClick={onClick}>transfer to loom</button>
        </li>
      )
    })
    const msg1 = props.user.specialPlanetToken.transferToLoomTx
      ? `Transfer requested. After the confirmation of eth tx (${props.user.specialPlanetToken.transferToLoomTx}), it takes additional 15 minutes to see the token on loom`
      : ""
    const loomTokens = props.user.specialPlanetToken.loomTokens.map(token => {
      const onClick = () => props.userActions.transferSpecialPlanetTokenToEth(token.id)
      return (
        <li key={token.id}>
          {token.id}:{token.shortId}:{token.version}:{token.kind}:
          {token.originalParamCommonLogarithm}:{token.artSeed.toString()}
          <PlanetArt kind={token.kind} artSeed={token.artSeed} canvasSize={100} />
          <button onClick={onClick}>transfer to eth</button>
        </li>
      )
    })
    const msg2 = props.user.specialPlanetToken.transferToEthTx
      ? `requested. tx: ${props.user.specialPlanetToken.transferToEthTx}`
      : ""
    const resumeFn = () => props.userActions.transferSpecialPlanetTokenToEth()
    const resume = props.user.specialPlanetToken.needsTransferResume ? (
      <button onClick={resumeFn}>you have an ongoing transfer, resume it</button>
    ) : (
      <></>
    )
    return (
      <div className={"box"}>
        <button onClick={reload}>reload</button>

        <h2 className={"title is-6"}>eth</h2>
        <ul>{ethTokens}</ul>
        <div>{msg1}</div>
        <button onClick={props.userActions.buySpecialPlanetToken}>buy a planet</button>
        <div>{props.user.specialPlanetToken.buyTx}</div>

        <h2 className={"title is-6"}>loom</h2>
        <ul>{loomTokens}</ul>
        <div>{msg2}</div>
        {resume}
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
