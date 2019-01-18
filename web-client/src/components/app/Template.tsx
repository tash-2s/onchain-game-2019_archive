import * as React from "react"
import { InternalLink } from "../utils/InternalLink"

export class Template extends React.Component<{
  isError: boolean
  throwError: (e: Error, b: boolean, info?: any) => void
  currentUser: { id: string } | null
  login: () => void
}> {
  componentDidCatch(error: Error, info: any) {
    if (!this.props.isError) {
      this.props.throwError(error, false, info)
    }
  }

  render = () => {
    return (
      <div>
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
          My userId: {user.id}
          <br />
          <InternalLink to={["/users/:id", { id: user.id }]}>
            my planets
          </InternalLink>
        </div>
      )
    } else {
      const login = () => {
        this.props.login()
      }
      return <button onClick={login}>login</button>
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
