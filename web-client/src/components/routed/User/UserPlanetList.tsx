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

export class UserPlanetList extends React.Component<UserPlanetsListProps> {
  render = () => {
    const userPlanets = this.props.user.userNormalPlanets.map(up => (
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

    return (
      <table className={"table is-bordered is-fullwidth"}>
        <tbody>{userPlanets}</tbody>
      </table>
    )
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
        <div>Rankuped: {this.props.now - up.rankupedAt} sec ago</div>
      )
    const param =
      up.planet.kind === "technology" ? (
        up.param.toNumber().toLocaleString()
      ) : (
        <PrettyBN bn={up.param} />
      )

    return (
      <tr>
        <td>
          <div>
            Kind: {up.planet.kind}
            <br />
            Rank: {up.rank}/{up.maxRank}
            <br />
            Param: {param}
            <br />
            Created: {this.props.now - up.createdAt} sec ago
            <br />
            {rankuped}
          </div>
          {this.props.isMine ? <UserPlanetButtons {...this.props} /> : <></>}
        </td>
      </tr>
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
        <button className={"button is-primary"} onClick={this.rankupButtonHandler}>
          Rankup (Gold: <PrettyBN bn={up.requiredGoldForRankup} />)
        </button>
      )
    } else {
      rankupButton = (
        <button className={"button is-primary"} disabled={true}>
          Rankup (Gold: <PrettyBN bn={up.requiredGoldForRankup} />, Remaining Sec:{" "}
          {up.remainingSecForRankup})
        </button>
      )
    }

    if (up.rankupableCount >= 2) {
      bulkRankupButton = (
        <button className={"button is-link"} onClick={this.bulkRankupButtonHandler}>
          Bulk Rankup to rank {up.rank + up.rankupableCount} (Gold:{" "}
          <PrettyBN bn={up.requiredGoldForBulkRankup} />)
        </button>
      )
    } else {
      bulkRankupButton = (
        <button className={"button is-link"} disabled={true}>
          Bulk Rankup
        </button>
      )
    }

    const removeButton = (
      <button className={"button is-danger is-outlined"} onClick={this.removeButtonHandler}>
        Remove
      </button>
    )

    return (
      <div className={"buttons are-small"}>
        {rankupButton}
        {bulkRankupButton}
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
