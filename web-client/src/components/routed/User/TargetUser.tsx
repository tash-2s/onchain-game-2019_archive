import * as React from "react"

import { CommonState } from "../../../types/commonTypes"
import { UserDispatchProps } from "../../../containers/routed/UserContainer"
import { ExtendedTargetUserState } from "../../../models/UserNormalPlanet"

import { UserProfile } from "./UserProfile"
import { UserPlanetsList } from "./UserPlanetsList"
import { UserPlanetsMap } from "./UserPlanetsMap"
import { PlanetsList } from "./PlanetsList"

// targetUser is not null
type TargetUserProps = {
  common: CommonState
  user: { targetUser: ExtendedTargetUserState }
} & UserDispatchProps

export class TargetUser extends React.Component<TargetUserProps> {
  render = () => {
    const user = this.props.user.targetUser
    const isMine = this.isMine()
    let userPlanets
    switch (user.selectedUserPlanetsTab) {
      case "map":
        userPlanets = (
          <UserPlanetsMap user={user} isMine={isMine} userActions={this.props.userActions} />
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
      <PlanetsList user={user} setPlanetToGet={this.props.userActions.setPlanetToGet} />
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
    switch (this.props.user.targetUser.selectedUserPlanetsTab) {
      case "map":
        this.props.userActions.changeSelectedUserPlanetsTab("list")
        break
      case "list":
        this.props.userActions.changeSelectedUserPlanetsTab("map")
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
