import * as React from "react"

import { UserPageProps } from "../containers/UserPageContainer"
import { TargetUser } from "./UserPage/TargetUser"
import { Tokens } from "./UserPage/Tokens"
import { initialUserPageUiState } from "../reducers/userPageUiReducer"

export class UserPage extends React.Component<UserPageProps> {
  render = () => {
    if (
      this.props.user.targetUser &&
      this.props.user.targetUser.address === this.props.route.params[0]
    ) {
      switch (this.props.userPageUi.selectedViewKind) {
        case "main":
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
        case "tokens":
          return (
            <Tokens
              user={this.props.user.targetUser}
              userActionsForSpecialPlanet={this.props.userActions.special}
              userPageUiActions={this.props.userPageUiActions}
            />
          )
        default:
          throw new Error("undefined view kind")
      }
    } else {
      return <div>loading...</div>
    }
  }

  componentDidMount = () => {
    this.props.userActions.main.setTargetUser(this.props.route.params[0])
  }

  componentDidUpdate(prevProps: UserPageProps) {
    if (
      this.props.user.targetUser &&
      this.props.user.targetUser.address !== this.props.route.params[0]
    ) {
      if (stringify(this.props.userPageUi) !== stringify(initialUserPageUiState)) {
        this.props.userPageUiActions.clear()
        return
      }
      this.props.userActions.main.setTargetUser(this.props.route.params[0])
    }
  }

  componentWillUnmount = () => {
    this.props.userActions.main.clearTargetUser()
    this.props.userPageUiActions.clear()
  }
}

const stringify = (o: object) => {
  return Object.entries(o)
    .map(a => `${a[0]}:${a[1]}`)
    .sort()
    .join(",")
}
