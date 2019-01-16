import * as React from "react"
import { UserProps } from "../../containers/routed/UserContainer"
import { TargetUserState } from "../../types/routed/userTypes"

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

  getTargetUserData = (user: TargetUserState) => {
    let msg = <span />
    if (
      this.props.common.currentUser &&
      this.props.common.currentUser.id === user.id
    ) {
      msg = <span>!!!this is me!!!</span>
    }
    return (
      <div>
        target user is {user.id} {msg}
        <p>confirmed gold: {user.gold.confirmed}</p>
        <p>ongoing gold: {user.gold.ongoing}</p>
        <p>
          normalPlanets:
          {user.userNormalPlanets.map(p => p.normalPlanetId).join()}
        </p>
      </div>
    )
  }
}
