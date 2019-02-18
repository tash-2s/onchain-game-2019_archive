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
    const getPlanet = this.props.userActions.getPlanet

    return (
      <div>
        <UserProfile user={user} isMine={isMine} />
        <UserPlanetsList user={user} isMine={isMine} />
        <UserPlanetsMap user={user} />
        {isMine ? <PlanetsList user={user} getPlanet={getPlanet} /> : <></>}
      </div>
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
