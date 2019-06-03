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
              <strong>k2</strong>
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
                Remarkable Users
              </InternalLink>
              <InternalLink className={"navbar-item"} to={"/about"}>
                About
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
        <div className={"navbar-item has-dropdown is-hoverable"}>
          <a className={"navbar-link"}>{user.address}</a>
          <div className={"navbar-dropdown"}>
            <InternalLink className={"navbar-item"} to={["/:address", { address: user.address }]}>
              My Page
            </InternalLink>
            <a className={"navbar-item"}>Log out (TODO)</a>
          </div>
        </div>
      )
    } else {
      return (
        <div className={"navbar-item"}>
          <div className={"field is-grouped"}>
            <p className={"control"}>
              <button className={"button is-primary"} onClick={this.props.signup}>
                Sign up
              </button>
            </p>

            <p className={"control"}>
              <button className={"button is-link"} disabled={true}>
                Log in (TODO)
              </button>
            </p>
          </div>
        </div>
      )
    }
  }
}
