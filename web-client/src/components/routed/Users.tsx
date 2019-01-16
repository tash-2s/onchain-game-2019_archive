import * as React from "react"
import { UsersProps } from "../../containers/routed/UsersContainer"
import { InternalLink } from "../utils/InternalLink"

export class Users extends React.Component<UsersProps> {
  render = () => {
    const users = this.props.users.users.map(user => {
      return (
        <div key={user.id}>
          <InternalLink to={["/users/:id", { id: user.id }]}>
            {user.id}
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
