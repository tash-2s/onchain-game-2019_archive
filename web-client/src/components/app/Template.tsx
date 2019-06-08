import * as React from "react"

import { CommonState } from "../../types/commonTypes"
import { UiState } from "../../types/uiTypes"

import { CommonActions } from "../../actions/CommonActions"
import { CommonUiActions } from "../../actions/UiActions"

import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

export class Template extends React.Component<{
  common: CommonState
  commonUi: UiState["common"]
  commonActions: CommonActions
  commonUiActions: CommonUiActions
}> {
  dialogRef = React.createRef<HTMLDialogElement>()

  componentDidUpdate() {
    const dialog = this.dialogRef.current
    if (!dialog) {
      return
    }

    if (this.props.common.isLoading) {
      if (dialog.open) {
        return
      }
      dialog.showModal()
    } else {
      dialog.close()
    }
  }

  componentDidCatch(error: Error, info: any) {
    if (!this.props.common.isError) {
      this.props.commonActions.throwError(error, false, info)
    }
  }

  render = () => {
    return (
      <>
        <dialog ref={this.dialogRef}>LOADING</dialog>
        <Navbar
          currentUser={this.props.common.currentUser}
          activatedNavbarMenuOnMobile={this.props.commonUi.activatedNavbarMenuOnMobile}
          signup={this.props.commonActions.signup}
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
    if (this.props.common.isError) {
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
