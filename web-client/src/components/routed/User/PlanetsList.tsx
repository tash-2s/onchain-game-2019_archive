import * as React from "react"

import { ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { NormalPlanetsData } from "../../../data/planets"
import { OngoingGoldTimerComponent } from "./OngoingGoldTimerComponent"

export class PlanetsList extends OngoingGoldTimerComponent<{
  user: ExtendedTargetUserState
  getPlanet: (planetId: number, q: number, r: number) => any
}> {
  render = () => {
    const gold = this.state.ongoingGold

    return NormalPlanetsData.map(p => {
      let button
      if (gold === 0 || gold >= p.priceGold) {
        button = <button onClick={this.getPlanetButtonHandler(p.id)}>get!</button>
      } else {
        button = <button disabled={true}>get!</button>
      }
      return (
        <div key={p.id}>
          id: {p.id}, kind: {p.kind}, price: {p.priceGold} gold
          {button}
        </div>
      )
    })
  }

  getPlanetButtonHandler = (planetId: number) => {
    return () => {
      this.props.getPlanet(planetId, 0, 0) // TODO: coordinate
    }
  }
}
