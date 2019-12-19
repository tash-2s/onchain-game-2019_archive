import * as React from "react"

import { InternalLink } from "../utils/InternalLink"
import { ModalWithoutClose } from "../utils/ModalWithoutClose"
import { CurrentUserState } from "../../reducers/currentUserReducer"

interface Props {
  currentUser: CurrentUserState
  activatedNavbarMenuForMobile: boolean
  login: () => void
  toggleNavbarMenuForMobile: () => void
}

export function Navbar(props: Props) {
  const mobileClass = props.activatedNavbarMenuForMobile ? "is-active" : ""
  const modal = props.currentUser.logining ? <LoginModal /> : <></>

  return (
    <>
      <nav className={"navbar has-shadow"}>
        <div className={"container"}>
          <div className={"navbar-brand"}>
            <InternalLink className={"navbar-item"} to={"/"}>
              <strong>k2</strong>
            </InternalLink>

            <a onClick={props.toggleNavbarMenuForMobile} className={`navbar-burger ${mobileClass}`}>
              <span />
              <span />
              <span />
            </a>
          </div>

          <div className={`navbar-menu ${mobileClass}`}>
            <div className={"navbar-start"}>
              <InternalLink className={"navbar-item"} to={"/users"}>
                Highlighted Users
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
      {modal}
    </>
  )
}

function LoginModal(props: {}) {
  return (
    <ModalWithoutClose>
      <div>Check your MetaMask...</div>
      <div className="loader" />
    </ModalWithoutClose>
  )
}

function NavEndContent(props: Props) {
  const address = props.currentUser.loomAddress
  if (address) {
    return (
      <div className={"navbar-item has-dropdown is-hoverable"}>
        <a className={"navbar-link"}>{address}</a>
        <div className={"navbar-dropdown"}>
          <InternalLink className={"navbar-item"} to={["/:address", { address: address }]}>
            My Page
          </InternalLink>
        </div>
      </div>
    )
  } else {
    return (
      <div className={"navbar-item"}>
        <button className={"button is-primary"} onClick={props.login}>
          Sign up / Log in
        </button>
      </div>
    )
  }
}
