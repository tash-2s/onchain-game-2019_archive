import * as React from "react"
import { UserProps } from "../../containers/routed/UserContainer"
import { TargetUserState } from "../../types/routed/userTypes"

// TODO: when targetUser is changed without unmount, this will be go wrong
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
    this.props.userActions.getTargetUser(this.props.common.route.params[0])
  }

  componentDidUpdate(prevProps: UserProps) {
    if (
      !prevProps.user.targetUser &&
      !!this.props.user.targetUser &&
      !this.timerId
    ) {
      this.timerId = setInterval(
        () => this.props.userActions.updateTargetUserOngoings(),
        1000
      )
    }
  }

  componentWillUnmount = () => {
    if (this.timerId) {
      clearInterval(this.timerId)
    }
    this.props.userActions.clearTargetUser()
  }

  getTargetUserData = (user: TargetUserState) => {
    return (
      <div>
        target user is {user.id}
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
