import * as React from "react"
import BN from "bn.js"

import { UserNormalPlanet, ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { OngoingGoldTimerComponent } from "./OngoingGoldTimerComponent"
import { Time } from "../../../models/time"

interface Props {
  user: ExtendedTargetUserState
  loomTimeDifference: number
  isMine: boolean
  rankup: (userPlanetId: string) => void
  remove: (userPlanetId: string) => void
}

export class UserPlanetsList extends OngoingGoldTimerComponent<Props> {
  constructor(props: Props) {
    super(props)
    this.timerInterval = 10000 // 10 secs
  }

  render = () => {
    return this.props.user.userNormalPlanets
      .map(up => up)
      .sort((a, b) => a.createdAt - b.createdAt)
      .map(up => (
        <UserPlanet
          key={up.id}
          loomTimeDifference={this.props.loomTimeDifference}
          userPlanet={up}
          isMine={this.props.isMine}
          techPower={new BN(this.props.user.techPower)}
          ongoingGold={this.state.ongoingGold}
          rankup={this.props.rankup}
          remove={this.props.remove}
        />
      ))
  }
}

class UserPlanet extends React.Component<{
  loomTimeDifference: number
  userPlanet: UserNormalPlanet
  isMine: boolean
  techPower: BN
  ongoingGold: BN
  rankup: (userPlanetId: string) => void
  remove: (userPlanetId: string) => void
}> {
  render = () => {
    const up = this.props.userPlanet
    const now = Time.nowFromDiff(this.props.loomTimeDifference)
    const rankuped =
      up.createdAt === up.rankupedAt ? <></> : <div>rankuped: {now - up.rankupedAt} sec ago</div>
    return (
      <div>
        {`${up.normalPlanetId} (kind: ${up.planetKind()})`}
        <br />
        rank: {up.rank}/{up.maxRank()}
        <br />
        param: {up.paramMemo}
        <br />
        created: {now - up.createdAt} sec ago
        <br />
        {rankuped}
        {this.props.isMine ? this.buttons() : <></>}
      </div>
    )
  }

  buttons = () => {
    const up = this.props.userPlanet
    const now = Time.nowFromDiff(this.props.loomTimeDifference)
    const techPower = this.props.techPower
    const isRankupable = up.isRankupable(this.props.ongoingGold, now, techPower)
    let rankupButton

    if (isRankupable) {
      rankupButton = (
        <button onClick={this.rankupButtonHandler}>
          rankup ({up.requiredGoldForRankup()} gold)
        </button>
      )
    } else {
      rankupButton = (
        <button disabled={true}>
          required gold: {up.requiredGoldForRankup()}, remaining sec for next rankup:{" "}
          {up.remainingSecForRankupWithoutTechPower(now)} - {techPower} ={" "}
          {up.remainingSecForRankup(now, techPower)}
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
