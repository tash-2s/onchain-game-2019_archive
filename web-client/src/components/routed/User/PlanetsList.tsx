import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { NormalPlanetsData, initialPlanetIds } from "../../../data/planets"
import { PrettyBN } from "../../utils/PrettyBN"

export class PlanetsList extends React.Component<{
  user: ComputedTargetUserState
  setPlanetToGet: (planetId: number) => void
}> {
  render = () => {
    const gold = this.props.user.gold
    const buttonText = "get"

    return NormalPlanetsData.map(p => {
      let button
      if (
        (this.props.user.userNormalPlanets.length === 0 &&
          gold.eqn(0) &&
          initialPlanetIds.includes(p.id)) ||
        gold.gte(p.priceGold)
      ) {
        button = <button onClick={this.setPlanetToGet(p.id)}>{buttonText}</button>
      } else {
        button = <button disabled={true}>{buttonText}</button>
      }

      return (
        <div key={p.id}>
          id: {p.id}, kind: {p.kind}, param: <PrettyBN bn={p.param} />, price:{" "}
          <PrettyBN bn={p.priceGold} /> gold
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
