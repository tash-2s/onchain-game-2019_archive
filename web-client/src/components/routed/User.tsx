import * as React from "react"
import { UserProps } from "../../containers/routed/UserContainer"
import { TargetUser } from "./User/TargetUser"

export class User extends React.Component<UserProps> {
  render = () => {
    if (
      this.props.user.targetUser &&
      this.props.user.targetUser.address === this.props.common.route.params[0]
    ) {
      // targetUser is not null
      const props = {
        ...this.props,
        user: { ...this.props.user, targetUser: this.props.user.targetUser }
      }
      return <TargetUser {...props} />
    } else {
      return <div>loading...</div>
    }
  }

  componentDidMount = () => {
    this.props.userActions.setTargetUser(this.props.common.route.params[0])
  }

  componentDidUpdate(prevProps: UserProps) {
    if (
      this.props.user.targetUser &&
      this.props.user.targetUser.address !== this.props.common.route.params[0]
    ) {
      this.props.userActions.setTargetUser(this.props.common.route.params[0])
    }
  }

  componentWillUnmount = () => {
    this.props.userActions.clearTargetUser()
  }
}
