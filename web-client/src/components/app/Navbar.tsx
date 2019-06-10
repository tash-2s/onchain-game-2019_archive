import * as React from "react"

import { InternalLink } from "../utils/InternalLink"
import { CurrentUserState } from "../../reducers/currentUserReducer"

interface Props {
  currentUser: CurrentUserState
  activatedNavbarMenuOnMobile: boolean
  signup: () => void
  toggleNavbarMenuOnMobile: () => void
}

export function Navbar(props: Props) {
  // when an error occurs, this should be un-clickable, because the store will continue to have the error state
  const mobileClass = props.activatedNavbarMenuOnMobile ? "is-active" : ""

  return (
    <nav className={"navbar has-shadow"}>
      <div className={"container"}>
        <div className={"navbar-brand"}>
          <InternalLink className={"navbar-item"} to={"/"}>
            <strong>k2</strong>
          </InternalLink>

          <a onClick={props.toggleNavbarMenuOnMobile} className={`navbar-burger ${mobileClass}`}>
            <span />
            <span />
            <span />
          </a>
        </div>

        <div className={`navbar-menu ${mobileClass}`}>
          <div className={"navbar-start"}>
            <InternalLink className={"navbar-item"} to={"/users"}>
              Remarkable Users
            </InternalLink>

            <InternalLink className={"navbar-item"} to={"/about"}>
              About
            </InternalLink>
          </div>

          <div className={"navbar-end"}>
            <NavEndContent {...props} />
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavEndContent(props: Props) {
  const address = props.currentUser.address
  if (address) {
    return (
      <div className={"navbar-item has-dropdown is-hoverable"}>
        <a className={"navbar-link"}>{address}</a>
        <div className={"navbar-dropdown"}>
          <InternalLink className={"navbar-item"} to={["/:address", { address: address }]}>
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
            <button className={"button is-primary"} onClick={props.signup}>
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
