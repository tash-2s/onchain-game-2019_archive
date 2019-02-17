import * as React from "react"
import styled from "styled-components"

import { CommonState } from "../../../types/commonTypes"
import { UserDispatchProps } from "../../../containers/routed/UserContainer"
import { UserNormalPlanet, ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { NormalPlanetsData } from "../../../data/planets"

import { OngoingUserStatus } from "./OngoingUserStatus"
import { UserPlanetsList } from "./UserPlanetsList"

type TargetUserProps = {
  common: CommonState
  user: { targetUser: ExtendedTargetUserState }
} & UserDispatchProps
export class TargetUser extends React.Component<TargetUserProps> {
  getOngoingGold = (): number => 777 // TODO: impl

  render = () => {
    const user = this.props.user.targetUser
    const isMine = this.isMine(user.address)

    const getPlanet = isMine ? (
      <GetNewPlanet
        getOngoingGold={this.getOngoingGold}
        getPlanet={this.props.userActions.getPlanet}
      />
    ) : (
      <></>
    )
    return (
      <div>
        <p>
          target user is {user.address} {isMine ? "[this is me]" : ""}
        </p>
        <OngoingUserStatus gold={user.gold} userNormalPlanets={user.userNormalPlanets} />
        <div>
          population: {user.population}
          <br />
          gold power: {user.goldPower}
          <br />
          gold per sec: {user.goldPerSec}
        </div>
        {getPlanet}
        <br />
        <br />
        <UserPlanetsList
          userPlanets={user.userNormalPlanets}
          isMine={isMine}
          getOngoingGold={this.getOngoingGold}
        />
        <hr />
        <Map {...this.props} />
      </div>
    )
  }

  isMine = (address: string): boolean => {
    if (this.props.common.currentUser) {
      return this.props.common.currentUser.address === address
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

interface GetNewPlanetProps {
  getOngoingGold: () => number
  getPlanet: (planetId: number, q: number, r: number) => any
}
class GetNewPlanet extends React.Component<GetNewPlanetProps, { isButtonClicked: boolean }> {
  state = { isButtonClicked: false }

  render = () => {
    if (this.state.isButtonClicked) {
      return this.planetsList()
    } else {
      return <button onClick={this.showPlanetsButtonHandler}>get planet</button>
    }
  }

  showPlanetsButtonHandler = () => {
    this.setState({ isButtonClicked: true })
  }

  planetsList = () => {
    const gold = this.props.getOngoingGold()

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
      this.setState({ isButtonClicked: false })
    }
  }
}
