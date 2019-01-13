import * as React from "react"
import { UserProps } from "../../containers/routed/UserContainer"

export class User extends React.Component<UserProps> {
  render = () => {
    return <p>this is user: {this.props.common.route.params[0]}</p>
  }
}
