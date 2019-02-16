import * as React from "react"
import { UserProps } from "../../containers/routed/UserContainer"
import { ExtendedTargetUserState, UserNormalPlanet } from "../../models/UserNormalPlanet"
import { NormalPlanetsData } from "../../data/planets"
import styled from "styled-components"

export class User extends React.Component<UserProps> {
  private timerId: NodeJS.Timeout | null = null

  render = () => {
    if (
      this.props.user.targetUser &&
      this.props.user.targetUser.address === this.props.common.route.params[0]
    ) {
      return this.getTargetUserData(this.props.user.targetUser)
    } else {
      return <div>loading...</div>
    }
  }

  componentDidMount = () => {
    this.props.userActions.setTargetUser(this.props.common.route.params[0])
  }

  componentDidUpdate(prevProps: UserProps) {
    if (this.props.user.targetUser && !this.timerId) {
      this.timerId = setInterval(() => this.props.userActions.updateTargetUserOngoings(), 1000)
    }

    if (
      this.props.user.targetUser &&
      this.props.user.targetUser.address !== this.props.common.route.params[0]
    ) {
      this.clearTimer()
      this.props.userActions.setTargetUser(this.props.common.route.params[0])
    }
  }

  componentWillUnmount = () => {
    this.clearTimer()
    this.props.userActions.clearTargetUser()
  }

  clearTimer = () => {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }

  getOngoingGold = (): number => {
    if (!this.props.user.targetUser) {
      return 0
    } else {
      return this.props.user.targetUser.gold.ongoing
    }
  }

  getTargetUserData = (user: ExtendedTargetUserState) => {
    const isMine = !!(
      this.props.common.currentUser && this.props.common.currentUser.address === user.address
    )
    const planets = user.userNormalPlanets.map(up => (
      <ListedUserPlanet
        key={up.id}
        userPlanet={up}
        isMine={isMine}
        getOngoingGold={this.getOngoingGold}
      />
    ))
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
        <p>confirmed gold: {user.gold.confirmed}</p>
        <p>ongoing gold: {user.gold.ongoing}</p>
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
        <div>normalPlanets: {planets}</div>
        <hr />
        <Map {...this.props} />
      </div>
    )
  }
}

class Map extends React.Component<UserProps> {
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

class ListedUserPlanet extends React.Component<{
  userPlanet: UserNormalPlanet
  isMine: boolean
  getOngoingGold: () => number
}> {
  render = () => {
    const up = this.props.userPlanet

    return (
      <div>
        {`${up.normalPlanetId} (kind: ${up.planetKindMirror})`}
        <br />
        rank: {up.rank}/{up.maxRank()}
        <br />
        param: {up.paramMemo}
        <br />
        processing?: {up.isPending ? "yes" : "no"}
        <br />
        rankup available: {up.rankupAvailableDateString()}
        <br />
        {this.rankupButtonIfMine()}
      </div>
    )
  }

  rankupButtonIfMine = () => {
    if (this.props.isMine) {
      return (
        <button onClick={this.rankupButtonHandler}>
          rankup ({this.props.userPlanet.requiredGoldForRankup()} gold)
        </button>
      )
    } else {
      return ""
    }
  }

  rankupButtonHandler = () => {
    const gold = this.props.getOngoingGold()
    if (this.props.userPlanet.isRankupable(gold, Math.floor(Date.now() / 1000))) {
      alert("you can")
    } else {
      alert("you can't")
    }
  }
}
