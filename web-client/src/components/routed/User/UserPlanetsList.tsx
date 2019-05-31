import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { PrettyBN } from "../../utils/PrettyBN"

interface UserPlanetsListProps {
  user: ComputedTargetUserState
  isMine: boolean
  now: number
  rankup: (userPlanetId: string, targetRank: number) => void
  remove: (userPlanetId: string) => void
}

export class UserPlanetsList extends React.Component<UserPlanetsListProps> {
  render = () => {
    return this.props.user.userNormalPlanets.map(up => (
      <UserPlanet
        key={up.id}
        userPlanet={up}
        isMine={this.props.isMine}
        techPower={this.props.user.techPower}
        now={this.props.now}
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
  now: number
  rankup: (userPlanetId: string, targetRank: number) => void
  remove: (userPlanetId: string) => void
}

class UserPlanet extends React.Component<UserPlanetProps> {
  render = () => {
    const up = this.props.userPlanet
    const rankuped =
      up.createdAt === up.rankupedAt ? (
        <></>
      ) : (
        <div>rankuped: {this.props.now - up.rankupedAt} sec ago</div>
      )
    const param =
      up.planet.kind === "technology" ? (
        up.param.toNumber().toLocaleString()
      ) : (
        <PrettyBN bn={up.param} />
      )

    return (
      <div>
        {`${up.normalPlanetId} (kind: ${up.planet.kind})`}
        <br />
        rank: {up.rank}/{up.maxRank}
        <br />
        param: {param}
        <br />
        created: {this.props.now - up.createdAt} sec ago
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
    let rankupButton: JSX.Element
    let bulkRankupButton: JSX.Element

    if (up.rankupableCount >= 1) {
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

    if (up.rankupableCount >= 2) {
      bulkRankupButton = (
        <button onClick={this.bulkRankupButtonHandler}>
          bulk rankup to rank {up.rank + up.rankupableCount} (gold:{" "}
          <PrettyBN bn={up.requiredGoldForBulkRankup} />)
        </button>
      )
    } else {
      bulkRankupButton = <button disabled={true}>bulk rankup</button>
    }

    const removeButton = <button onClick={this.removeButtonHandler}>remove</button>

    return (
      <div>
        {rankupButton}
        <br />
        {bulkRankupButton}
        <br />
        {removeButton}
      </div>
    )
  }

  rankupButtonHandler = () => {
    this.props.rankup(this.props.userPlanet.id, this.props.userPlanet.rank + 1)
  }

  bulkRankupButtonHandler = () => {
    this.props.rankup(
      this.props.userPlanet.id,
      this.props.userPlanet.rank + this.props.userPlanet.rankupableCount
    )
  }

  removeButtonHandler = () => {
    this.props.remove(this.props.userPlanet.id)
  }
}
