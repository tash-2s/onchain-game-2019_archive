import * as React from "react"

import { PrettyBN } from "../utils/PrettyBN"
import { PlanetParam } from "../utils/PlanetParam"
import { ComputedTargetUserState } from "../../computers/userComputer"
import { UserPageActionsProps } from "../../containers/UserPageContainer"

interface UserPlanetProps {
  userPlanet: ComputedTargetUserState["userNormalPlanets"][number]
  knowledge: number
  userActions: UserPageActionsProps["userActions"]
  now: number
  isMine: boolean
}

export function UserPlanet(props: UserPlanetProps) {
  const up = props.userPlanet
  const rankuped =
    up.createdAt === up.rankupedAt ? (
      <></>
    ) : (
      <div>Rankuped: {props.now - up.rankupedAt} sec ago</div>
    )
  const param = <PlanetParam kind={up.planet.kind} param={up.param} />

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
    this.props.userActions.normal.rankupUserPlanets([
      { userNormalPlanetId: this.props.userPlanet.id, targetRank: this.props.userPlanet.rank + 1 }
    ])
  }

  bulkRankupButtonHandler = () => {
    this.props.userActions.normal.rankupUserPlanets([
      {
        userNormalPlanetId: this.props.userPlanet.id,
        targetRank: this.props.userPlanet.rank + this.props.userPlanet.rankupableCount
      }
    ])
  }

  removeButtonHandler = () => {
    this.props.userActions.normal.removeUserPlanet(this.props.userPlanet.id)
  }
}
