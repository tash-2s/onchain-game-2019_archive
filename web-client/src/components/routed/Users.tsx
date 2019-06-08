import * as React from "react"
import BN from "bn.js"

import { PrettyBN } from "../utils/PrettyBN"
import { UsersProps } from "../../containers/routed/UsersContainer"
import { InternalLink } from "../utils/InternalLink"

export class Users extends React.Component<UsersProps> {
  render = () => {
    const users = this.props.users.users.map(user => {
      return (
        <tr key={user.address}>
          <td>
            <div>
              Gold: <PrettyBN bn={new BN(user.gold)} />
            </div>
            <InternalLink to={["/:address", { address: user.address }]}>
              {user.address}
            </InternalLink>
          </td>
        </tr>
      )
    })
    return (
      <>
        <h1 className={"title"}>Remarkable Users</h1>
        <table className={"table is-bordered is-fullwidth"}>
          <tbody>{users}</tbody>
        </table>
      </>
    )
  }

  componentDidMount = () => {
    if (this.props.users.users.length < 1) {
      this.props.usersActions.setUsers()
    }
  }
}
