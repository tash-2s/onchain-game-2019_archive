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
    switch (this.props.userPageUi.selectedUserPlanetsTab) {
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
          />
        )
        break
    }
    const planetList = (
      <PlanetList
        normalPlanets={user.normalPlanets}
        setPlanetToGet={this.props.userPageUiActions.selectPlanet}
        userPageUi={this.props.userPageUi}
      />
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
    const planetListButton = <></>
    // TODO: for mobile
    // if (this.props.isMine) {
    //   if (this.props.ui.planetListVisibility) {
    //     planetListButton = (
    //       <button className={"button is-small"} onClick={this.togglePlanetList}>
    //         Hide Planet List
    //       </button>
    //     )
    //   } else {
    //     planetListButton = (
    //       <button className={"button is-small"} onClick={this.togglePlanetList}>
    //         Show Planet List
    //       </button>
    //     )
    //   }
    // }

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
          <div className={"level-item"}>{planetListButton}</div>
        </div>
      </nav>
    )
  }

  toggleUserPlanets = () => {
    switch (this.props.ui.selectedUserPlanetsTab) {
      case "map":
        this.props.actions.selectUserPlanetsTab("list")
        break
      case "list":
        this.props.actions.selectUserPlanetsTab("map")
        break
    }
  }

  togglePlanetList = () => {
    this.props.actions.changePlanetListVisibility(!this.props.ui.planetListVisibility)
  }
}
