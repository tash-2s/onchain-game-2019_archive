import * as React from "react"

import { UiState } from "../../../types/uiTypes"
import { UserDispatchProps } from "../../../containers/routed/UserContainer"
import { ComputedTargetUserState } from "../../../computers/userComputer"
import { ComputedCommonState } from "../../../computers/commonComputer"

import { UserProfile } from "./UserProfile"
import { UserPlanetsList } from "./UserPlanetsList"
import { UserPlanetsMap } from "./UserPlanetsMap"
import { PlanetsList } from "./PlanetsList"

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
          <UserPlanetsMap
            user={user}
            userPageUi={this.props.userPageUi}
            isMine={isMine}
            userActions={this.props.userActions}
            uiActions={this.props.userPageUiActions}
          />
        )
        break
      case "list":
        userPlanets = (
          <UserPlanetsList
            user={user}
            now={this.props.common.now}
            isMine={isMine}
            rankup={this.props.userActions.rankupUserNormalPlanet}
            remove={this.props.userActions.removeUserNormalPlanet}
          />
        )
        break
    }
    const planetsList = (
      <div className={"column"}>
        <PlanetsList
          normalPlanets={user.normalPlanets}
          setPlanetToGet={this.props.userPageUiActions.selectPlanet}
        />
      </div>
    )

    const planetClass = isMine ? "is-half" : "is-three-quarters"

    return (
      <>
        <h1 className={"title is-5"}>
          target user is {user.address} {isMine ? "[this is me]" : ""}
        </h1>

        <div className={"columns"}>
          <div className={"column"}>
            <UserProfile user={user} isMine={isMine} />
          </div>

          <div className={`column ${planetClass}`}>
            <button onClick={this.toggleTab}>toggle type of userPlanets</button>
            {userPlanets}
          </div>

          {isMine ? planetsList : <></>}
        </div>
      </>
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
