import * as React from "react"
import BN from "bn.js"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { Time } from "../../../models/time"
import { PrettyBN } from "../../utils/PrettyBN"

interface UserPlanetsListProps {
  user: ComputedTargetUserState
  isMine: boolean
  rankup: (userPlanetId: string) => void
  remove: (userPlanetId: string) => void
}

export class UserPlanetsList extends React.Component<UserPlanetsListProps> {
  render = () => {
    return this.props.user.userNormalPlanets
      .map(up => up)
      .sort((a, b) => a.createdAt - b.createdAt)
      .map(up => (
        <UserPlanet
          key={up.id}
          userPlanet={up}
          isMine={this.props.isMine}
          techPower={this.props.user.techPower}
          rankup={this.props.rankup}
          remove={this.props.remove}
        />
      ))
  }
}

interface UserPlanetProps {
  userPlanet: ComputedTargetUserState["userNormalPlanets"][number]
  isMine: boolean
  techPower: number
  rankup: (userPlanetId: string) => void
  remove: (userPlanetId: string) => void
}

class UserPlanet extends React.Component<UserPlanetProps> {
  render = () => {
    const up = this.props.userPlanet
    const rankuped =
      up.createdAt === up.rankupedAt ? <></> : <div>rankuped: {up.rankupedSec} sec ago</div>
    const param =
      up.planetKind === "technology" ? (
        up.param.toNumber().toLocaleString()
      ) : (
        <PrettyBN bn={up.param} />
      )

    return (
      <div>
        {`${up.normalPlanetId} (kind: ${up.planetKind})`}
        <br />
        rank: {up.rank}/{up.maxRank}
        <br />
        param: {param}
        <br />
        created: {up.createdSec} sec ago
        <br />
        {rankuped}
        {this.props.isMine ? <UserPlanetButtons {...this.props} /> : <></>}
      </div>
    )
  }
}

class UserPlanetButtons extends React.Component<UserPlanetProps> {
  render = () => {
    const up = this.props.userPlanet
    const techPower = this.props.techPower
    const isRankupable = up.isRankupable
    let rankupButton

    if (isRankupable) {
      rankupButton = (
        <button onClick={this.rankupButtonHandler}>
          rankup (<PrettyBN bn={up.requiredGoldForRankup} /> gold)
        </button>
      )
    } else {
      rankupButton = (
        <button disabled={true}>
          required gold: <PrettyBN bn={up.requiredGoldForRankup} />, remaining sec for next rankup:{" "}
          {up.remainingSecForRankupWithoutTechPower} - {techPower} = {up.remainingSecForRankup}
        </button>
      )
    }

    const removeButton = <button onClick={this.removeButtonHandler}>remove</button>

    return (
      <div>
        {rankupButton}
        {removeButton}
      </div>
    )
  }

  rankupButtonHandler = () => {
    this.props.rankup(this.props.userPlanet.id)
  }

  removeButtonHandler = () => {
    this.props.remove(this.props.userPlanet.id)
  }
}
