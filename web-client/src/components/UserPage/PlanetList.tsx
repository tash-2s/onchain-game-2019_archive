import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { PrettyBN } from "../utils/PrettyBN"
import { PlanetParam } from "../utils/PlanetParam"
import { UserPageUIState } from "../../reducers/userPageUIReducer"

export class PlanetList extends React.Component<{
  planets: ComputedTargetUserState["normalPlanets"]
  setPlanetToGet: (planetId: number) => void
  userPageUI: UserPageUIState
}> {
  render = () => {
    const buttonText = "Get"
    const planets = this.props.planets.map(p => {
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
      if (p.id === this.props.userPageUI.selectedNormalPlanetIdForSet) {
        activeClass = "is-active"
      }

      return (
        <div className={`panel-block ${activeClass}`} key={p.id}>
          <div>Kind {p.kind}</div>
          <div>
            Gold <PrettyBN bn={p.priceGold} />
          </div>
          <div>
            Param <PlanetParam kind={p.kind} param={p.param} />
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
