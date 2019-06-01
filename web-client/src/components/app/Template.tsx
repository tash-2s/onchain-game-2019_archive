import * as React from "react"

import { CommonState } from "../../types/commonTypes"
import { Nav } from "./Nav"

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
        <Nav currentUser={this.props.currentUser} signup={this.props.signup} />
        {this.getErrorOrChildren()}
      </div>
    )
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
