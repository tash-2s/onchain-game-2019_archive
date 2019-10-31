import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { UserPageUIActions } from "../../actions/UserPageUIActions"
import { UserPageUIState } from "../../reducers/userPageUIReducer"
import { UserPageActionsProps } from "../../containers/UserPageContainer"

import { PlanetHex } from "./PlanetHex"
import { UserPlanet } from "./UserPlanet"
import { Modal } from "../utils/Modal"
import { PlanetArt } from "../utils/PlanetArt"
import { PrettyBN } from "../utils/PrettyBN"

interface Props {
  user: ComputedTargetUserState
  userActions: UserPageActionsProps["userActions"]
  userPageUI: UserPageUIState
  userPageUIActions: UserPageUIActions
  now: number
  isMine: boolean
}

const placeholderId = "user-planet-map-placeholder"

export function UserPlanetMap(props: Props) {
  const [width, setWidth] = React.useState<number | null>(null)

  React.useEffect(() => {
    const e = document.getElementById(placeholderId)
    if (!e) {
      return
    }
    setWidth(e.clientWidth)
  }, [])

  if (!width) {
    return <div id={placeholderId} />
  }

  // Show biggest map for this area
  // Calc hex sizes to fit mapWidth
  // mapWidth (= state.width) = (1.5 * hexSize) * (mapRadius * 2 + 1) + (0.5 * hexSize)
  // Transform this equation for hexSize...
  const hexSize = Math.min(width / (3 * props.user.map.shownRadius + 2), 100) // max: 100
  const hexWidth = hexSize * 2
  const hexHeight = Math.sqrt(3) * hexSize

  let isSufficientGoldForNextSet = true
  if (
    !!props.userPageUI.selectedNormalPlanetIdForSet &&
    props.userPageUI.selectedPlanetHexesForSet.length > 0
  ) {
    const planet = props.user.normalPlanets.find(
      p => p.id === props.userPageUI.selectedNormalPlanetIdForSet
    )
    if (!planet) {
      throw new Error("unknown planet")
    }
    const buyableCount = props.user.gold.div(planet.priceGold)
    isSufficientGoldForNextSet = buyableCount.gtn(props.userPageUI.selectedPlanetHexesForSet.length)
  }

  const hexes = props.user.map.hexes.map(h => {
    const settable =
      props.isMine &&
      h.settable &&
      (!!props.userPageUI.selectedNormalPlanetIdForSet ||
        !!props.userPageUI.selectedSpecialPlanetTokenIdForSet) &&
      isSufficientGoldForNextSet

    const isHighlighted = !!props.userPageUI.selectedPlanetHexesForSet.find(
      o => o.axialCoordinateQ === h.q && o.axialCoordinateR === h.r
    )

    return (
      <PlanetHex
        key={`${h.q}/${h.r}`}
        q={h.q}
        r={h.r}
        userPlanet={h.userPlanet}
        shiftTop={props.user.map.shownRadius * hexHeight}
        shiftLeft={props.user.map.shownRadius * ((hexWidth / 4) * 3)}
        hexSize={hexSize}
        hexWidth={hexWidth}
        hexHeight={hexHeight}
        isHighlighted={isHighlighted}
        select={selectFn(props, h, settable) || undefined}
      />
    )
  })

  const height = (props.user.map.shownRadius * 2 + 1) * hexHeight

  return (
    <>
      <UserPlanetDetailModal {...props} />
      <SetToMapButton {...props} />
      <div style={{ position: "relative", height }}>{hexes}</div>
    </>
  )
}

const selectFn = (
  props: Props,
  hex: ComputedTargetUserState["map"]["hexes"][number],
  settable: boolean
) => {
  if (props.userPageUI.selectedNormalPlanetIdForSet) {
    if (!settable) {
      return null
    }
    return () => props.userPageUIActions.selectPlanetHexForSet(hex.q, hex.r)
  }

  if (props.userPageUI.selectedSpecialPlanetTokenIdForSet) {
    if (!settable) {
      return null
    }
    const id = props.userPageUI.selectedSpecialPlanetTokenIdForSet
    return () => {
      props.userActions.special.setPlanetTokenToMap(id, hex.q, hex.r)
      props.userPageUIActions.unselectSpecialPlanetTokenForSet()
    }
  }

  if (hex.userPlanet) {
    const up = hex.userPlanet

    if (hex.userPlanet.isNormal) {
      return () => props.userPageUIActions.selectUserNormalPlanetForModal(up.id)
    } else {
      return () => props.userPageUIActions.selectUserSpecialPlanetForModal(up.id)
    }
  }

  return null
}

function UserPlanetDetailModal(props: Props) {
  if (props.userPageUI.selectedUserNormalPlanetIdForModal) {
    const up = props.user.userNormalPlanets.find(
      up => up.id === props.userPageUI.selectedUserNormalPlanetIdForModal
    )
    // this must be always true
    if (up) {
      return (
        <Modal close={props.userPageUIActions.unselectUserNormalPlanetForModal}>
          <PlanetArt kind={up.planet.kind} artSeed={up.planet.artSeed} canvasSize={300} />
          <UserPlanet
            userPlanet={up}
            isMine={props.isMine}
            knowledge={props.user.knowledge}
            now={props.now}
            userActions={props.userActions}
          />
        </Modal>
      )
    }
  }

  if (props.userPageUI.selectedUserSpecialPlanetIdForModal) {
    const up = props.user.userSpecialPlanets.find(
      up => up.id === props.userPageUI.selectedUserSpecialPlanetIdForModal
    )
    // this must be always true
    if (up) {
      const buttonFn = () => props.userActions.special.removeUserPlanetFromMap(up.id)
      const button = props.isMine ? <button onClick={buttonFn}>Remove</button> : <></>
      return (
        <Modal close={props.userPageUIActions.unselectUserSpecialPlanetForModal}>
          <PlanetArt kind={up.kind} artSeed={up.artSeed} canvasSize={300} />
          <div>
            Kind: {up.kind}
            Param: <PrettyBN bn={up.param} />
            {button}
          </div>
        </Modal>
      )
    }
  }

  return <></>
}

function SetToMapButton(props: Props) {
  const planetId = props.userPageUI.selectedNormalPlanetIdForSet
  if (!planetId || props.userPageUI.selectedPlanetHexesForSet.length <= 0) {
    return <></>
  }
  const fn = () => {
    props.userActions.normal.setPlanetsToMap(planetId, props.userPageUI.selectedPlanetHexesForSet)
    props.userPageUIActions.unselectNormalPlanetForSet()
    props.userPageUIActions.unselectPlanetHexesForSet()
  }
  return <button onClick={fn}>set to map</button>
}
