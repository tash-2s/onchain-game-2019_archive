import * as React from "react"
import { InternalLink } from "../utils/InternalLink"
import { CommonState } from "../../types/commonTypes"

export class Template extends React.Component<{
  isLoading: boolean
  isError: boolean
  throwError: (e: Error, b: boolean, info?: any) => void
  currentUser: CommonState["currentUser"]
  signup: () => void
}> {
  dialogRef = React.createRef<HTMLDialogElement>()

  componentDidUpdate() {
    const dialog = this.dialogRef.current
    if (!dialog) {
      return
    }

    if (this.props.isLoading) {
      if (dialog.open) {
        return
      }
      dialog.showModal()
    } else {
      dialog.close()
    }
  }

  componentDidCatch(error: Error, info: any) {
    if (!this.props.isError) {
      this.props.throwError(error, false, info)
    }
  }

  render = () => {
    return (
      <div>
        <dialog ref={this.dialogRef}>LOADING</dialog>
        {this.getNav()}
        {this.getErrorOrChildren()}
      </div>
    )
  }

  getNav = () => {
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

            <div className={"navbar-end"}>{this.getAccountMenu()}</div>
          </div>
        </div>
      </nav>
    )
  }

  getAccountMenu = () => {
    if (this.props.currentUser) {
      const user = this.props.currentUser
      return (
        <InternalLink className={"navbar-item"} to={["/:address", { address: user.address }]}>
          My useraddress: {user.address}
        </InternalLink>
      )
    } else {
      const signup = () => {
        this.props.signup()
      }
      return (
        <div className={"navbar-item"}>
          <div className={"field is-grouped"}>
            <p className={"control"}>
              <button className={"button"} onClick={signup}>
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

  getErrorOrChildren = () => {
    if (this.props.isError) {
      const clickHandle = () => location.replace(location.pathname)
      return (
        <div>
          <p>Something went wrong.</p>

          <button onClick={clickHandle}>Reload</button>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}
