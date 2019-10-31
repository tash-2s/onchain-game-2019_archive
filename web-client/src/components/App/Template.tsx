import * as React from "react"

import { AppState } from "../../reducers/appReducer"
import { TemplateUIState } from "../../reducers/templateUIReducer"
import { CurrentUserState } from "../../reducers/currentUserReducer"

import { AppActions } from "../../actions/AppActions"
import { TemplateUIActions } from "../../actions/TemplateUIActions"
import { CurrentUserActions } from "../../actions/CurrentUserActions"

import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

export class Template extends React.Component<{
  app: AppState
  appActions: AppActions
  currentUser: CurrentUserState
  currentUserActions: CurrentUserActions
  templateUI: TemplateUIState
  templateUIActions: TemplateUIActions
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
          activatedNavbarMenuForMobile={this.props.templateUI.activatedNavbarMenuForMobile}
          login={this.props.currentUserActions.login}
          toggleNavbarMenuForMobile={this.props.templateUIActions.toggleNavbarMenuForMobile}
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
