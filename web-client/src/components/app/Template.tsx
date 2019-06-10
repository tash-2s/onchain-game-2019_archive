import * as React from "react"

import { AppState } from "../../reducers/appReducer"
import { UiState } from "../../reducers/uiReducer"
import { CurrentUserState } from "../../reducers/currentUserReducer"

import { AppActions } from "../../actions/AppActions"
import { CommonUiActions } from "../../actions/UiActions"
import { CurrentUserActions } from "../../actions/CurrentUserActions"

import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

export class Template extends React.Component<{
  app: AppState
  commonUi: UiState["common"]
  appActions: AppActions
  commonUiActions: CommonUiActions
  currentUser: CurrentUserState
  currentUserActions: CurrentUserActions
}> {
  dialogRef = React.createRef<HTMLDialogElement>()

  componentDidUpdate() {
    const dialog = this.dialogRef.current
    if (!dialog) {
      return
    }

    if (this.props.app.isLoading) {
      if (dialog.open) {
        return
      }
      dialog.showModal()
    } else {
      dialog.close()
    }
  }

  componentDidCatch(error: Error, info: any) {
    if (!this.props.app.isError) {
      this.props.appActions.throwError(error, false, info)
    }
  }

  render = () => {
    return (
      <>
        <dialog ref={this.dialogRef}>LOADING</dialog>
        <Navbar
          currentUser={this.props.currentUser}
          activatedNavbarMenuOnMobile={this.props.commonUi.activatedNavbarMenuOnMobile}
          signup={this.props.currentUserActions.signup}
          toggleNavbarMenuOnMobile={this.props.commonUiActions.toggleNavbarMenuOnMobile}
        />
        <section className={"section"}>
          <div className={"container"}>{this.getErrorOrChildren()}</div>
        </section>
        <Footer />
      </>
    )
  }

  getErrorOrChildren = () => {
    if (this.props.app.isError) {
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
