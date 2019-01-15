import * as React from "react"
import { UserProps } from "../../containers/routed/UserContainer"
import { TargetUserState } from "../../types/routed/userTypes"

export class User extends React.Component<UserProps> {
  render = () => {
    if (this.props.user.targetUser) {
      return this.getTargetUserData(this.props.user.targetUser)
    } else {
      return <div>loading...</div>
    }
  }

  componentDidMount = () => {
    this.props.userActions.getTargetUser(this.props.common.route.params[0])
  }

  componentWillUnmount = () => {
    this.props.userActions.clearTargetUser()
  }

  getTargetUserData = (user: TargetUserState) => {
    return (
      <div>
        target user is {user.id}
        <p>gold: {user.gold}</p>
      </div>
    )
  }
}
