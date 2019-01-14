import * as React from "react"
import { UserProps } from "../../containers/routed/UserContainer"

export class User extends React.Component<UserProps> {
  render = () => {
    if (
      this.props.user.targetUser &&
      this.props.user.targetUser.id === this.props.common.route.params[0]
    ) {
      return <div>target user is {this.props.user.targetUser.id}</div>
    } else {
      return <div>loading...</div>
    }
  }

  componentDidMount = () => {
    this.props.userActions.getTargetUser(this.props.common.route.params[0])
  }
}
