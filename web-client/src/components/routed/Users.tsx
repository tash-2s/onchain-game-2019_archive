import * as React from "react"
import { UsersProps } from "../../containers/routed/UsersContainer"
import { InternalLink } from "../utils/InternalLink"

export class Users extends React.Component<UsersProps> {
  render = () => {
    const users = this.props.users.users.map(user => {
      return (
        <div key={user.address}>
          <InternalLink to={["/users/:id", { id: user.address }]}>
            {user.address} {user.gold}
          </InternalLink>
        </div>
      )
    })
    return users
  }

  componentDidMount = () => {
    if (this.props.users.users.length < 1) {
      this.props.usersActions.setUsers()
    }
  }
}
