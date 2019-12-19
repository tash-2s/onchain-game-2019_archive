import * as React from "react"

import { AppState } from "../../reducers/appReducer"
import { TemplateUIState } from "../../reducers/templateUIReducer"
import { CurrentUserState } from "../../reducers/currentUserReducer"

import { AppActions } from "../../actions/AppActions"
import { TemplateUIActions } from "../../actions/TemplateUIActions"
import { CurrentUserActions } from "../../actions/CurrentUserActions"

import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { ModalWithoutClose } from "../utils/ModalWithoutClose"

export class Template extends React.Component<{
  app: AppState
  appActions: AppActions
  currentUser: CurrentUserState
  currentUserActions: CurrentUserActions
  templateUI: TemplateUIState
  templateUIActions: TemplateUIActions
}> {
  state = { hasError: false }
  dialogRef = React.createRef<HTMLDialogElement>()

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: any) {
    // should log error
  }

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

  render = () => {
    return (
      <>
        <dialog ref={this.dialogRef}>
          LOADING...
          <div className="loader" />
        </dialog>
        <Navbar
          currentUser={this.props.currentUser}
          activatedNavbarMenuForMobile={this.props.templateUI.activatedNavbarMenuForMobile}
          login={this.props.currentUserActions.login}
          toggleNavbarMenuForMobile={this.props.templateUIActions.toggleNavbarMenuForMobile}
        />
        <ChildrenOrError app={this.props.app} hasError={this.state.hasError}>
          {this.props.children}
        </ChildrenOrError>
        <Footer />
      </>
    )
  }
}

function ChildrenOrError(props: { app: AppState; hasError: boolean; children: React.ReactNode }) {
  if (props.app.errorMessage || props.hasError) {
    return <ErrorModal message={props.app.errorMessage || "Something went wrong."} />
  }

  return (
    <section className={"section"}>
      <div className={"container"}>{props.children}</div>
    </section>
  )
}

function ErrorModal(props: { message: string }) {
  const clickHandler = () => location.replace(location.pathname)
  return (
    <ModalWithoutClose>
      <div>{props.message}</div>
      <button className={"button"} onClick={clickHandler}>
        Reload
      </button>
    </ModalWithoutClose>
  )
}
