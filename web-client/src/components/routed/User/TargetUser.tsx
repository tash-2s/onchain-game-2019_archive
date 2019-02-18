import * as React from "react"
import styled from "styled-components"

import { CommonState } from "../../../types/commonTypes"
import { UserDispatchProps } from "../../../containers/routed/UserContainer"
import { UserNormalPlanet, ExtendedTargetUserState } from "../../../models/UserNormalPlanet"

import { UserProfile } from "./UserProfile"
import { UserPlanetsList } from "./UserPlanetsList"
import { PlanetsList } from "./PlanetsList"

// targetUser is not null
type TargetUserProps = {
  common: CommonState
  user: { targetUser: ExtendedTargetUserState }
} & UserDispatchProps

export class TargetUser extends React.Component<TargetUserProps> {
  render = () => {
    const user = this.props.user.targetUser
    const isMine = this.isMine()
    const getPlanet = this.props.userActions.getPlanet

    return (
      <div>
        <UserProfile user={user} isMine={isMine} />
        <UserPlanetsList user={user} isMine={isMine} />
        <Map {...this.props} />
        {isMine ? <PlanetsList user={user} getPlanet={getPlanet} /> : <></>}
      </div>
    )
  }

  isMine = (): boolean => {
    if (this.props.common.currentUser) {
      return this.props.common.currentUser.address === this.props.user.targetUser.address
    } else {
      return false
    }
  }
}

class Map extends React.Component<TargetUserProps> {
  render = () => {
    const hexes = [[0, 0], [0, -1], [1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0]].map(h => {
      const q = h[0]
      const r = h[1]
      const userPlanet =
        (this.props.user.targetUser &&
          this.props.user.targetUser.userNormalPlanets.find(
            up => up.axialCoordinates[0] === q && up.axialCoordinates[1] === r
          )) ||
        null
      return <Hex key={`${q}-${r}`} q={q} r={r} userPlanet={userPlanet} />
    })

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
