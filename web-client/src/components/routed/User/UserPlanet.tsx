import * as React from "react"

import { PrettyBN } from "../../utils/PrettyBN"
import { ComputedTargetUserState } from "../../../computers/userComputer"

interface UserPlanetProps {
  userPlanet: ComputedTargetUserState["userNormalPlanets"][number]
  isMine: boolean
  knowledge: number
  now: number
  rankup: (userPlanetId: string, targetRank: number) => void
  remove: (userPlanetId: string) => void
}

export function UserPlanet(props: UserPlanetProps) {
  const up = props.userPlanet
  const rankuped =
    up.createdAt === up.rankupedAt ? (
      <></>
    ) : (
      <div>Rankuped: {props.now - up.rankupedAt} sec ago</div>
    )
  const param =
    up.planet.kind === "technology" ? (
      up.param.toNumber().toLocaleString()
    ) : (
      <PrettyBN bn={up.param} />
    )

  return (
    <>
      <div>
        Kind: {up.planet.kind}
        <br />
        Rank: {up.rank}/{up.maxRank}
        <br />
        Param: {param}
        <br />
        Created: {props.now - up.createdAt} sec ago
        <br />
        {rankuped}
      </div>
      {props.isMine ? <UserPlanetButtons {...props} /> : <></>}
    </>
  )
}

class UserPlanetButtons extends React.Component<UserPlanetProps> {
  render = () => {
    const up = this.props.userPlanet
    const knowledge = this.props.knowledge
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
