import * as React from "react"

import { UserNormalPlanet, ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { OngoingGoldTimerComponent } from "./OngoingGoldTimerComponent"

export class UserPlanetsList extends OngoingGoldTimerComponent<{
  user: ExtendedTargetUserState
  isMine: boolean
  rankup: (userPlanetId: number) => void
}> {
  render = () => {
    return this.props.user.userNormalPlanets.map(up => (
      <UserPlanet
        key={up.id}
        userPlanet={up}
        isMine={this.props.isMine}
        ongoingGold={this.state.ongoingGold}
        rankup={this.props.rankup}
      />
    ))
  }
}

class UserPlanet extends React.Component<{
  userPlanet: UserNormalPlanet
  isMine: boolean
  ongoingGold: number
  rankup: (userPlanetId: number) => void
}> {
  render = () => {
    const up = this.props.userPlanet

    return (
      <div>
        {`${up.normalPlanetId} (kind: ${up.planetKindMirror})`}
        <br />
        rank: {up.rank}/{up.maxRank()}
        <br />
        param: {up.paramMemo}
        <br />
        pending?: {up.isPending ? "yes" : "no"}
        <br />
        rankup available: {up.rankupAvailableDateString()}
        <br />
        {this.props.isMine ? this.rankupButton() : <></>}
      </div>
    )
  }

  rankupButton = () => {
    const rankupButtonText = `rankup (${this.props.userPlanet.requiredGoldForRankup()} gold)`
    const isRankupable = this.props.userPlanet.isRankupable(
      this.props.ongoingGold,
      Math.floor(Date.now() / 1000)
    )

    if (isRankupable) {
      return <button onClick={this.rankupButtonHandler}>{rankupButtonText}</button>
    } else {
      return <button disabled={true}>{rankupButtonText}</button>
    }
  }

  rankupButtonHandler = () => {
    this.props.rankup(this.props.userPlanet.id)
  }
}
