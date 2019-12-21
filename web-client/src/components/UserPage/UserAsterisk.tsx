import * as React from "react"

import { PrettyBN } from "../utils/PrettyBN"
import { AsteriskParam } from "../utils/AsteriskParam"
import { ComputedTargetUserState } from "../../computers/userComputer"
import { UserPageActionsProps } from "../../containers/UserPageContainer"

interface UserAsteriskProps {
  userAsterisk: ComputedTargetUserState["userInGameAsterisks"][number]
  knowledge: number
  userActions: UserPageActionsProps["userActions"]
  now: number
  isMine: boolean
}

export function UserAsterisk(props: UserAsteriskProps) {
  const up = props.userAsterisk
  const rankuped =
    up.createdAt === up.rankupedAt ? (
      <></>
    ) : (
      <div>Rankuped: {props.now - up.rankupedAt} sec ago</div>
    )
  const param = <AsteriskParam kind={up.asterisk.kind} param={up.param} />

  return (
    <>
      <div>
        Kind: {up.asterisk.kind}
        <br />
        Rank: {up.rank}/{up.maxRank}
        <br />
        Param: {param}
        <br />
        Created: {props.now - up.createdAt} sec ago
        <br />
        {rankuped}
      </div>
      {props.isMine ? <UserAsteriskButtons {...props} /> : <></>}
    </>
  )
}

class UserAsteriskButtons extends React.Component<UserAsteriskProps> {
  render = () => {
    const up = this.props.userAsterisk
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
    this.props.userActions.inGame.rankupUserAsterisks([
      {
        userInGameAsteriskId: this.props.userAsterisk.id,
        targetRank: this.props.userAsterisk.rank + 1
      }
    ])
  }

  bulkRankupButtonHandler = () => {
    this.props.userActions.inGame.rankupUserAsterisks([
      {
        userInGameAsteriskId: this.props.userAsterisk.id,
        targetRank: this.props.userAsterisk.rank + this.props.userAsterisk.rankupableCount
      }
    ])
  }

  removeButtonHandler = () => {
    this.props.userActions.inGame.removeUserAsterisks([this.props.userAsterisk.id])
  }
}
