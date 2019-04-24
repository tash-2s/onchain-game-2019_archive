import * as React from "react"

import { ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { NormalPlanetsData } from "../../../data/planets"
import { OngoingGoldTimerComponent } from "./OngoingGoldTimerComponent"

export class PlanetsList extends OngoingGoldTimerComponent<{
  user: ExtendedTargetUserState
  setPlanetToGet: (planetId: number) => void
}> {
  render = () => {
    const gold = this.state.ongoingGold
    const buttonText = "get"

    return NormalPlanetsData.map(p => {
      if (p.kind === "magic") {
        throw new Error("magic planets are not supported yet")
      }

      const price = 10 ** p.priceGold
      let button
      if ((this.props.user.userNormalPlanets.length === 0 && gold === 0) || gold >= price) {
        button = <button onClick={this.setPlanetToGet(p.id)}>{buttonText}</button>
      } else {
        button = <button disabled={true}>{buttonText}</button>
      }

      return (
        <div key={p.id}>
          id: {p.id}, kind: {p.kind}, param: {(10 ** p.param).toLocaleString()}, price: {price.toLocaleString()} gold
          {button}
        </div>
      )
    })
  }

  setPlanetToGet = (planetId: number) => {
    return () => {
      this.props.setPlanetToGet(planetId)
    }
  }
}
