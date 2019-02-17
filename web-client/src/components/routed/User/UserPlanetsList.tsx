import * as React from "react"

import { UserNormalPlanet } from "../../../models/UserNormalPlanet"

export class UserPlanetsList extends React.Component<{
  userPlanets: Array<UserNormalPlanet>
  isMine: boolean
  getOngoingGold: () => number
}> {
  render = () => {
    return this.props.userPlanets.map(up => (
      <UserPlanet
        key={up.id}
        userPlanet={up}
        isMine={this.props.isMine}
        getOngoingGold={this.props.getOngoingGold}
      />
    ))
  }
}

class UserPlanet extends React.Component<{
  userPlanet: UserNormalPlanet
  isMine: boolean
  getOngoingGold: () => number
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
        {this.rankupButtonIfMine()}
      </div>
    )
  }

  rankupButtonIfMine = () => {
    if (this.props.isMine) {
      return (
        <button onClick={this.rankupButtonHandler}>
          rankup ({this.props.userPlanet.requiredGoldForRankup()} gold)
        </button>
      )
    } else {
      return ""
    }
  }

  rankupButtonHandler = () => {
    const gold = this.props.getOngoingGold()
    if (this.props.userPlanet.isRankupable(gold, Math.floor(Date.now() / 1000))) {
      alert("you can")
    } else {
      alert("you can't")
    }
  }
}
