import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { PrettyBN } from "../utils/PrettyBN"
import { AsteriskParam } from "../utils/AsteriskParam"
import { UserPageUIState } from "../../reducers/userPageUIReducer"

export class AsteriskList extends React.Component<{
  asterisks: ComputedTargetUserState["inGameAsterisks"]
  setAsteriskToGet: (asteriskId: number) => void
  userPageUI: UserPageUIState
}> {
  render = () => {
    const buttonText = "Get"
    const asterisks = this.props.asterisks.map(p => {
      let button
      if (p.gettable) {
        button = (
          <button className={"button is-primary"} onClick={this.setAsteriskToGet(p.id)}>
            {buttonText}
          </button>
        )
      } else {
        button = (
          <button className={"button is-primary"} disabled={true}>
            {buttonText}
          </button>
        )
      }

      let activeClass = ""
      if (p.id === this.props.userPageUI.selectedInGameAsteriskIdForSet) {
        activeClass = "is-active"
      }

      return (
        <div className={`panel-block ${activeClass}`} key={p.id}>
          <div>Kind {p.kind}</div>
          <div>
            Gold <PrettyBN bn={p.priceGold} />
          </div>
          <div>
            Param <AsteriskParam kind={p.kind} param={p.param} />
          </div>
          <div>{button}</div>
        </div>
      )
    })

    return (
      <nav className={"panel"}>
        <p className={"panel-heading"}>Asterisk List</p>
        {asterisks}
      </nav>
    )
  }

  setAsteriskToGet = (asteriskId: number) => {
    return () => {
      this.props.setAsteriskToGet(asteriskId)
    }
  }
}
