import * as React from "react"

import { UserProps } from "../../containers/routed/UserContainer"
import { TargetUser } from "./User/TargetUser"
import { initialUserPageUiState } from "../../reducers/userPageUiReducer"

export class User extends React.Component<UserProps> {
  render = () => {
    if (
      this.props.user.targetUser &&
      this.props.user.targetUser.address === this.props.route.params[0]
    ) {
      // targetUser is not null
      const props = {
        ...this.props,
        user: { ...this.props.user, targetUser: this.props.user.targetUser }
      }
      return (
        <TargetUser
          currentUser={this.props.currentUser}
          time={this.props.time}
          userPageUi={this.props.userPageUi}
          targetUser={this.props.user.targetUser}
          userPageUiActions={this.props.userPageUiActions}
          userActions={this.props.userActions}
        />
      )
    } else {
      return <div>loading...</div>
    }
  }

  componentDidMount = () => {
    this.props.userActions.setTargetUser(this.props.route.params[0])
  }

  componentDidUpdate(prevProps: UserProps) {
    if (
      this.props.user.targetUser &&
      this.props.user.targetUser.address !== this.props.route.params[0]
    ) {
      if (stringify(this.props.userPageUi) !== stringify(initialUserPageUiState)) {
        this.props.userPageUiActions.clear()
        return
      }
      this.props.userActions.setTargetUser(this.props.route.params[0])
    }
  }

  componentWillUnmount = () => {
    this.props.userActions.clearTargetUser()
    this.props.userPageUiActions.clear()
  }
}

const stringify = (o: object) => {
  return Object.entries(o)
    .map(a => `${a[0]}:${a[1]}`)
    .sort()
    .join(",")
}
