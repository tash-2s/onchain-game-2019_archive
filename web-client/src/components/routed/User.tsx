import * as React from "react"
import { UserProps } from "../../containers/routed/UserContainer"
import {
  ExtendedTargetUserState,
  UserNormalPlanet
} from "../../models/UserNormalPlanet"

export class User extends React.Component<UserProps> {
  private timerId: NodeJS.Timeout | null

  constructor(props: UserProps) {
    super(props)
    this.timerId = null
  }

  render = () => {
    if (
      this.props.user.targetUser &&
      this.props.user.targetUser.id === this.props.common.route.params[0]
    ) {
      return this.getTargetUserData(this.props.user.targetUser)
    } else {
      return <div>loading...</div>
    }
  }

  componentDidMount = () => {
    this.props.userActions.setTargetUser(this.props.common.route.params[0])
  }

  componentDidUpdate(prevProps: UserProps) {
    if (this.props.user.targetUser && !this.timerId) {
      this.timerId = setInterval(
        () => this.props.userActions.updateTargetUserOngoings(),
        1000
      )
    }

    if (
      this.props.user.targetUser &&
      this.props.user.targetUser.id !== this.props.common.route.params[0]
    ) {
      this.clearTimer()
      this.props.userActions.setTargetUser(this.props.common.route.params[0])
    }
  }

  componentWillUnmount = () => {
    this.clearTimer()
    this.props.userActions.clearTargetUser()
  }

  clearTimer = () => {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }

  getOngoingGold = (): number => {
    if (!this.props.user.targetUser) {
      return 0
    } else {
      return this.props.user.targetUser.gold.ongoing
    }
  }

  getTargetUserData = (user: ExtendedTargetUserState) => {
    const isMine = !!(
      this.props.common.currentUser &&
      this.props.common.currentUser.id === user.id
    )
    const planets = user.userNormalPlanets.map(up => (
      <ListedUserPlanet
        key={up.id}
        userPlanet={up}
        isMine={isMine}
        getOngoingGold={this.getOngoingGold}
      />
    ))
    return (
      <div>
        <p>
          target user is {user.id} {isMine ? "[this is me]" : ""}
        </p>
        <p>confirmed gold: {user.gold.confirmed}</p>
        <p>ongoing gold: {user.gold.ongoing}</p>
        <div>
          population: {user.population}
          <br />
          gold power: {user.goldPower}
          <br />
          gold per sec: {user.goldPerSec}
        </div>
        <br />
        <div>normalPlanets: {planets}</div>
      </div>
    )
  }
}

class ListedUserPlanet extends React.Component<{
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
        processing?: {up.isProcessing ? "yes" : "no"}
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
    if (
      this.props.userPlanet.isRankupable(gold, Math.floor(Date.now() / 1000))
    ) {
      alert("you can")
    } else {
      alert("you can't")
    }
  }
}
