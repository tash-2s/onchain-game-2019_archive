import * as React from "react"
import BN from "bn.js"

import { UserNormalPlanet } from "../../../models/UserNormalPlanet"
import { ComputedTargetUserState } from "../../../computers/userComputer"
import { Time } from "../../../models/time"

interface Props {
  user: ComputedTargetUserState
  isMine: boolean
  rankup: (userPlanetId: string) => void
  remove: (userPlanetId: string) => void
}

export class UserPlanetsList extends React.Component<Props> {
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

class UserPlanet extends React.Component<{
  userPlanet: UserNormalPlanet
  isMine: boolean
  techPower: number
  rankup: (userPlanetId: string) => void
  remove: (userPlanetId: string) => void
}> {
  render = () => {
    const up = this.props.userPlanet
    const rankuped =
      up.createdAt === up.rankupedAt ? <></> : <div>rankuped: {up.rankuped()} sec ago</div>
    return (
      <div>
        {`${up.normalPlanetId} (kind: ${up.planetKind()})`}
        <br />
        rank: {up.rank}/{up.maxRank()}
        <br />
        param: {up.paramMemo.toString()}
        <br />
        created: {up.created()} sec ago
        <br />
        {rankuped}
        {this.props.isMine ? this.buttons() : <></>}
      </div>
    )
  }

  buttons = () => {
    const up = this.props.userPlanet
    const techPower = this.props.techPower
    const isRankupable = up.isRankupable(techPower)
    let rankupButton

    if (isRankupable) {
      rankupButton = (
        <button onClick={this.rankupButtonHandler}>
          rankup ({up.requiredGoldForRankup().toString()} gold)
        </button>
      )
    } else {
      rankupButton = (
        <button disabled={true}>
          required gold: {up.requiredGoldForRankup().toString()}, remaining sec for next rankup:{" "}
          {up.remainingSecForRankupWithoutTechPower()} - {techPower} ={" "}
          {up.remainingSecForRankup(techPower)}
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
