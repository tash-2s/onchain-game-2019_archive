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
  componentDidCatch(error: Error, info: any) {
    if (!this.props.isError) {
      this.props.throwError(error, false, info)
    }
  }

  render = () => {
    return (
      <div>
        {this.props.isLoading ? <div style={{ color: "red" }}>LOADING</div> : <></>}
        {this.getNav()}
        {this.getErrorOrChildren()}
      </div>
    )
  }

  getNav = () => {
    // when an error occurs, this should be un-clickable, because the store will continue to have the error state
    return (
      <div>
        <ul>
          <li>
            <InternalLink to={"/"}>index</InternalLink>
          </li>
          <li>
            <InternalLink to={"/users"}>/users</InternalLink>
          </li>
          {this.getAccountMenu()}
        </ul>
        <hr />
      </div>
    )
  }

  getAccountMenu = () => {
    if (this.props.currentUser) {
      const user = this.props.currentUser
      return (
        <div>
          My userId: {user.address}
          <br />
          <InternalLink to={["/users/:id", { id: user.address }]}>my planets</InternalLink>
        </div>
      )
    } else {
      const signup = () => {
        this.props.signup()
      }
      return (
        <div>
          <button onClick={signup}>signup</button>
          <button disabled={true}>login</button>
        </div>
      )
    }
  }

  getErrorOrChildren = () => {
    if (this.props.isError) {
      const clickHandle = () => window.location.replace("/")
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
