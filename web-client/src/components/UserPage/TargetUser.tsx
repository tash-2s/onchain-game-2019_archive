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

interface TargetUserProps {
  currentUser: CurrentUserState
  time: ComputedTimeState
  userPageUi: UserPageUiState
  targetUser: ComputedTargetUserState
  userPageUiActions: UserPageUiActions
  userActions: UserActions
}

export class TargetUser extends React.Component<TargetUserProps> {
  render = () => {
    const user = this.props.targetUser
    const isMine = this.isMine()
    let userPlanets
    switch (this.props.userPageUi.selectedUserPlanetViewKind) {
      case "map":
        userPlanets = (
          <UserPlanetMap
            user={user}
            userPageUi={this.props.userPageUi}
            isMine={isMine}
            userActions={this.props.userActions}
            uiActions={this.props.userPageUiActions}
            now={this.props.time.now}
          />
        )
        break
      case "list":
        userPlanets = (
          <UserPlanetList
            user={user}
            now={this.props.time.now}
            isMine={isMine}
            rankup={this.props.userActions.rankupUserPlanet}
            remove={this.props.userActions.removeUserPlanet}
            ui={this.props.userPageUi}
            uiActions={this.props.userPageUiActions}
          />
        )
        break
    }
    const planetList = (
      <>
        <div
          className={"is-hidden-desktop box is-shadowless is-marginless"}
          style={{ textAlign: "center" }}
        >
          <button
            className={"button is-small is-primary"}
            onClick={this.props.userPageUiActions.togglePlanetListVisibilityForMobile}
          >
            {this.props.userPageUi.planetListVisibilityForMobile ? "Hide" : "Show"} Planet List
          </button>
        </div>

        <div
          className={this.props.userPageUi.planetListVisibilityForMobile ? "" : "is-hidden-touch"}
        >
          <PlanetList
            planets={user.normalPlanets}
            setPlanetToGet={this.props.userPageUiActions.selectPlanet}
            userPageUi={this.props.userPageUi}
          />
        </div>
      </>
    )

    return (
      <>
        <h1 className={"title is-5"}>
          target user is {user.address} {isMine ? "[this is me]" : ""}
        </h1>

        <div className={"columns is-desktop"}>
          <div className={"column"}>
            <UserProfile user={user} isMine={isMine} />
            {isMine ? planetList : <></>}
          </div>

          <div className={`column is-three-quarters`}>
            <Buttons actions={this.props.userPageUiActions} />
            {userPlanets}
          </div>
        </div>
      </>
    )
  }

  isMine = (): boolean => {
    const address = this.props.currentUser.address
    if (address) {
      return address === this.props.targetUser.address
    } else {
      return false
    }
  }
}

class Buttons extends React.Component<{
  actions: UserPageUiActions
}> {
  render = () => {
    return (
      <nav className={"level"}>
        <div className={"level-left"}>
          <div className={"level-item"}>
            <button
              className={"button is-small"}
              onClick={this.props.actions.toggleUserPlanetViewKind}
            >
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
}
