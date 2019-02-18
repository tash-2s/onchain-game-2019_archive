import * as React from "react"
import styled from "styled-components"

import { UserNormalPlanet, ExtendedTargetUserState } from "../../../models/UserNormalPlanet"

export class UserPlanetsMap extends React.Component<{ user: ExtendedTargetUserState }> {
  render = () => {
    const hexes = [[0, 0], [0, -1], [1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0]].map(h => {
      const q = h[0]
      const r = h[1]
      const userPlanet =
        this.props.user.userNormalPlanets.find(
          up => up.axialCoordinates[0] === q && up.axialCoordinates[1] === r
        ) || null
      return <Hex key={`${q}-${r}`} q={q} r={r} userPlanet={userPlanet} />
    })

    // TODO: set hight
    return <div style={{ position: "relative", margin: 200 }}>{hexes}</div>
  }
}

class Hex extends React.Component<{
  q: number
  r: number
  userPlanet: UserNormalPlanet | null
}> {
  render = () => {
    const x = 50 * ((3 / 2) * this.props.q)
    const y = 50 * ((Math.sqrt(3) / 2) * this.props.q + Math.sqrt(3) * this.props.r)
    return (
      <this.Styled style={{ left: x, top: y }}>
        {this.props.userPlanet ? this.props.userPlanet.id : ""}
      </this.Styled>
    )
  }

  Styled = styled.div`
    clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
    background-color: red;
    width: 100px;
    height: calc(100px * 0.866);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
  `
}
