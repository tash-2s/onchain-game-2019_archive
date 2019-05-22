import * as React from "react"

import { CommonState } from "../../../types/commonTypes"
import { UiState } from "../../../types/uiTypes"
import { UserDispatchProps } from "../../../containers/routed/UserContainer"
import { ComputedTargetUserState } from "../../../computers/userComputer"

import { UserProfile } from "./UserProfile"
import { UserPlanetsList } from "./UserPlanetsList"
import { UserPlanetsMap } from "./UserPlanetsMap"
import { PlanetsList } from "./PlanetsList"

// targetUser is not null
type TargetUserProps = {
  common: CommonState
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
          <UserPlanetsMap
            user={user}
            userPageUi={this.props.userPageUi}
            isMine={isMine}
            userActions={this.props.userActions}
          />
        )
        break
      case "list":
        userPlanets = (
          <UserPlanetsList
            user={user}
            isMine={isMine}
            rankup={this.props.userActions.rankupUserNormalPlanet}
            remove={this.props.userActions.removeUserNormalPlanet}
          />
        )
        break
    }
    const planetsList = (
      <PlanetsList user={user} setPlanetToGet={this.props.userPageUiActions.selectPlanet} />
    )

    return (
      <div>
        <UserProfile user={user} isMine={isMine} />
        <button onClick={this.toggleTab}>toggle type of userPlanets</button>
        {userPlanets}
        {isMine ? planetsList : <></>}
      </div>
    )
  }

  toggleTab = () => {
    switch (this.props.userPageUi.selectedUserPlanetsTab) {
      case "map":
        this.props.userPageUiActions.selectUserPlanetsTab("list")
        break
      case "list":
        this.props.userPageUiActions.selectUserPlanetsTab("map")
        break
    }
  }

  isMine = (): boolean => {
    if (this.props.common.currentUser) {
      return this.props.common.currentUser.address === this.props.user.targetUser.address
    } else {
      return false
    }
  }
}
