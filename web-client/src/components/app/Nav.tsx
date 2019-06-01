import * as React from "react"

import { CommonState } from "../../types/commonTypes"
import { InternalLink } from "../utils/InternalLink"

export class Nav extends React.Component<{
  currentUser: CommonState["currentUser"]
  signup: () => void
}> {
  render = () => {
    // when an error occurs, this should be un-clickable, because the store will continue to have the error state
    return (
      <nav className={"navbar is-light"}>
        <div className={"container"}>
          <div className={"navbar-brand"}>
            <InternalLink className={"navbar-item"} to={"/"}>
              k2
            </InternalLink>

            <a className={"navbar-burger"}>
              <span />
              <span />
              <span />
            </a>
          </div>

          <div className={"navbar-menu"}>
            <div className={"navbar-start"}>
              <InternalLink className={"navbar-item"} to={"/users"}>
                /users
              </InternalLink>
            </div>

            <div className={"navbar-end"}>{this.user()}</div>
          </div>
        </div>
      </nav>
    )
  }

  user = () => {
    if (this.props.currentUser) {
      const user = this.props.currentUser
      return (
        <InternalLink className={"navbar-item"} to={["/:address", { address: user.address }]}>
          My useraddress: {user.address}
        </InternalLink>
      )
    } else {
      return (
        <div className={"navbar-item"}>
          <div className={"field is-grouped"}>
            <p className={"control"}>
              <button className={"button"} onClick={this.props.signup}>
                signup
              </button>
            </p>

            <p className={"control"}>
              <button className={"button"} disabled={true}>
                login
              </button>
            </p>
          </div>
        </div>
      )
    }
  }
}
