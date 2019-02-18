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

type tabType = "map" | "list"

export class TargetUser extends React.Component<TargetUserProps, { selectedTab: tabType }> {
  state = { selectedTab: "map" as tabType }

  render = () => {
    const user = this.props.user.targetUser
    const isMine = this.isMine()
    const getPlanet = this.props.userActions.getPlanet
    let userPlanets
    switch (this.state.selectedTab) {
      case "map":
        userPlanets = <UserPlanetsMap user={user} />
        break
      case "list":
        userPlanets = (
          <UserPlanetsList
            user={user}
            isMine={isMine}
            rankup={this.props.userActions.rankupUserNormalPlanet}
          />
        )
        break
    }

    return (
      <div>
        <UserProfile user={user} isMine={isMine} />
        <button onClick={this.toggleTab}>toggle type of userPlanets</button>
        {userPlanets}
        {isMine ? <PlanetsList user={user} getPlanet={getPlanet} /> : <></>}
      </div>
    )
  }

  toggleTab = () => {
    switch (this.state.selectedTab) {
      case "map":
        this.setState({ selectedTab: "list" })
        break
      case "list":
        this.setState({ selectedTab: "map" })
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
