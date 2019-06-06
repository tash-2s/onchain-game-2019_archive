import * as React from "react"

import { UserProps } from "../../containers/routed/UserContainer"
import { TargetUser } from "./User/TargetUser"
import { initialUiState } from "../../reducers/uiReducer"

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
      if (stringify(this.props.userPageUi) !== stringify(initialUiState.userPage)) {
        this.props.userPageUiActions.clear()
        return
      }
      this.props.userActions.setTargetUser(this.props.common.route.params[0])
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
