import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { PrettyBN } from "../utils/PrettyBN"
import { UserPageUiState } from "../../reducers/userPageUiReducer"

export class PlanetList extends React.Component<{
  normalPlanets: ComputedTargetUserState["normalPlanets"]
  setPlanetToGet: (planetId: number) => void
  userPageUi: UserPageUiState
}> {
  render = () => {
    const buttonText = "Get"
    const planets = this.props.normalPlanets.map(p => {
      let button
      if (p.gettable) {
        button = (
          <button className={"button is-primary"} onClick={this.setPlanetToGet(p.id)}>
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
      if (p.id === this.props.userPageUi.selectedNormalPlanetId) {
        activeClass = "is-active"
      }

      return (
        <div className={`panel-block ${activeClass}`} key={p.id}>
          <div>Kind {p.kind}</div>
          <div>
            Gold <PrettyBN bn={p.priceGold} />
          </div>
          <div>
            Param <PrettyBN bn={p.param} />
          </div>
          <div>{button}</div>
        </div>
      )
    })

    return (
      <nav className={"panel"}>
        <p className={"panel-heading"}>Planet List</p>
        {planets}
      </nav>
    )
  }

  setPlanetToGet = (planetId: number) => {
    return () => {
      this.props.setPlanetToGet(planetId)
    }
  }
}
