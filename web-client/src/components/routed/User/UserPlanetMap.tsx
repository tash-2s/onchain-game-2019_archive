import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { UserActions } from "../../../actions/routed/UserActions"
import { UserPageUiActions } from "../../../actions/UiActions"
import { UiState } from "../../../reducers/uiReducer"

import { PlanetHex } from "./PlanetHex"
import { Modal } from "../../utils/Modal"
import { UserPlanet } from "./UserPlanet"

interface Props {
  user: ComputedTargetUserState
  userPageUi: UiState["userPage"]
  isMine: boolean
  userActions: UserActions
  uiActions: UserPageUiActions
  now: number
}

interface State {
  width: number | null
}

const placeholderId = "user-planet-map-placeholder"

export class UserPlanetMap extends React.Component<Props, State> {
  state: State = { width: null }

  componentDidMount = () => {
    if (!this.state.width) {
      const e = document.getElementById(placeholderId)
      if (e) {
        this.setState({ width: e.clientWidth })
      }
    }
  }

  render = () => {
    if (!this.state.width) {
      return <div id={placeholderId} />
    }

    const shownRadius = this.props.user.map.shownRadius
    // Show biggest map for this area
    // Calc hex sizes to fit mapWidth
    // mapWidth (= state.width) = (1.5 * hexSize) * (mapRadius * 2 + 1) + (0.5 * hexSize)
    // Transform this equation for hexSize...
    const hexSize = Math.min(this.state.width / (3 * shownRadius + 2), 100) // max: 100
    const hexWidth = hexSize * 2
    const hexHeight = Math.sqrt(3) * hexSize

    const hexes = this.props.user.map.hexes.map(h => {
      const settable =
        this.props.isMine && !!this.props.userPageUi.selectedNormalPlanetId && h.settable
      const selectFn = () => {
        !h.userPlanet || this.props.uiActions.selectUserPlanet(h.userPlanet.id)
      }

      return (
        <PlanetHex
          key={`${h.q}/${h.r}`}
          q={h.q}
          r={h.r}
          userPlanet={h.userPlanet}
          shiftTop={shownRadius * hexHeight}
          shiftLeft={shownRadius * ((hexWidth / 4) * 3)}
          hexSize={hexSize}
          hexWidth={hexWidth}
          hexHeight={hexHeight}
          setPlanet={settable ? this.setPlanet : null}
          select={selectFn}
        />
      )
    })

    const height = (shownRadius * 2 + 1) * hexHeight

    let modal = <></>
    if (this.props.userPageUi.selectedUserPlanetId) {
      const up = this.props.user.userNormalPlanets.find(
        up => up.id === this.props.userPageUi.selectedUserPlanetId
      )
      // this must be always true
      if (up) {
        modal = (
          <Modal close={this.props.uiActions.unselectUserPlanet}>
            <UserPlanet
              userPlanet={up}
              isMine={this.props.isMine}
              knowledge={this.props.user.knowledge}
              now={this.props.now}
              rankup={this.props.userActions.rankupUserNormalPlanet}
              remove={this.props.userActions.removeUserNormalPlanet}
            />
          </Modal>
        )
      }
    }

    return (
      <>
        {modal}
        <div style={{ position: "relative", height: height }}>{hexes}</div>
      </>
    )
  }

  setPlanet = (q: number, r: number) => {
    return () => {
      if (!this.props.userPageUi.selectedNormalPlanetId) {
        throw new Error("this must be called with target")
      }
      this.props.userActions.getPlanet(this.props.userPageUi.selectedNormalPlanetId, q, r)
      this.props.uiActions.unselectPlanet()
    }
  }
}
