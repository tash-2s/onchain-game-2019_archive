import * as React from "react"

import { UiState } from "../../../types/uiTypes"
import { UserDispatchProps } from "../../../containers/routed/UserContainer"
import { ComputedTargetUserState } from "../../../computers/userComputer"
import { ComputedCommonState } from "../../../computers/commonComputer"

import { UserProfile } from "./UserProfile"
import { UserPlanetList } from "./UserPlanetList"
import { UserPlanetMap } from "./UserPlanetMap"
import { PlanetList } from "./PlanetList"

// targetUser is not null
type TargetUserProps = {
  common: ComputedCommonState
  user: { targetUser: ComputedTargetUserState }
  userPageUi: UiState["userPage"]
} & UserDispatchProps

export class TargetUser extends React.Component<TargetUserProps> {
  render = () => {
    const user = this.props.user.targetUser
    const isMine = this.isMine()
    let userPlanets
    switch (this.props.userPageUi.selectedUserPlanetViewType) {
      case "map":
        userPlanets = (
          <UserPlanetMap
            user={user}
            userPageUi={this.props.userPageUi}
            isMine={isMine}
            userActions={this.props.userActions}
            uiActions={this.props.userPageUiActions}
            now={this.props.common.now}
          />
        )
        break
      case "list":
        userPlanets = (
          <UserPlanetList
            user={user}
            now={this.props.common.now}
            isMine={isMine}
            rankup={this.props.userActions.rankupUserNormalPlanet}
            remove={this.props.userActions.removeUserNormalPlanet}
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
            onClick={this.props.userPageUiActions.togglePlanetListVisibility}
          >
            {this.props.userPageUi.planetListVisibilityOnMobile ? "Hide" : "Show"} Planet List
          </button>
        </div>

        <div
          className={this.props.userPageUi.planetListVisibilityOnMobile ? "" : "is-hidden-touch"}
        >
          <PlanetList
            normalPlanets={user.normalPlanets}
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
            <Buttons
              ui={this.props.userPageUi}
              actions={this.props.userPageUiActions}
              isMine={isMine}
            />
            {userPlanets}
          </div>
        </div>
      </>
    )
  }

  isMine = (): boolean => {
    if (this.props.common.currentUser) {
      return this.props.common.currentUser.address === this.props.user.targetUser.address
    } else {
      return false
    }
  }
}

class Buttons extends React.Component<{
  ui: UiState["userPage"]
  actions: UserDispatchProps["userPageUiActions"]
  isMine: boolean
}> {
  render = () => {
    return (
      <nav className={"level"}>
        <div className={"level-left"}>
          <div className={"level-item"}>
            <button className={"button is-small"} onClick={this.toggleUserPlanets}>
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

  toggleUserPlanets = () => {
    switch (this.props.ui.selectedUserPlanetViewType) {
      case "map":
        this.props.actions.selectUserPlanetViewType("list")
        break
      case "list":
        this.props.actions.selectUserPlanetViewType("map")
        break
    }
  }
}
