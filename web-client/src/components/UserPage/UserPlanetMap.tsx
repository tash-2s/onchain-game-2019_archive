import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { UserPageUiActions } from "../../actions/UserPageUiActions"
import { UserPageUiState } from "../../reducers/userPageUiReducer"
import { UserPageActionsProps } from "../../containers/UserPageContainer"

import { PlanetHex } from "./PlanetHex"
import { Modal } from "../utils/Modal"
import { UserPlanet } from "./UserPlanet"
import { PlanetArt } from "../utils/PlanetArt"
import { PrettyBN } from "../utils/PrettyBN"

import { getNormalPlanet } from "../../data/NormalPlanets"

interface Props {
  user: ComputedTargetUserState
  userActions: UserPageActionsProps["userActions"]
  userPageUi: UserPageUiState
  userPageUiActions: UserPageUiActions
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

  const shownRadius = props.user.map.shownRadius
  // Show biggest map for this area
  // Calc hex sizes to fit mapWidth
  // mapWidth (= state.width) = (1.5 * hexSize) * (mapRadius * 2 + 1) + (0.5 * hexSize)
  // Transform this equation for hexSize...
  const hexSize = Math.min(width / (3 * shownRadius + 2), 100) // max: 100
  const hexWidth = hexSize * 2
  const hexHeight = Math.sqrt(3) * hexSize

  let isSufficientGoldForNext = true
  const planetId = props.userPageUi.selectedNormalPlanetIdForSet
  if (!!planetId && props.userPageUi.selectedPlanetHexesForSet.length > 0) {
    const planet = getNormalPlanet(planetId)
    const buyableCount = props.user.gold.div(planet.priceGold)
    isSufficientGoldForNext = buyableCount.gtn(props.userPageUi.selectedPlanetHexesForSet.length)
  }

  const hexes = props.user.map.hexes.map(h => {
    const settable =
      props.isMine &&
      h.settable &&
      (!!props.userPageUi.selectedNormalPlanetIdForSet ||
        !!props.userPageUi.selectedSpecialPlanetTokenIdForSet) &&
      isSufficientGoldForNext

    const isSelected = !!props.userPageUi.selectedPlanetHexesForSet.find(
      o => o.axialCoordinateQ === h.q && o.axialCoordinateR === h.r
    )

    let selectFn: (() => void) | undefined = undefined
    if (
      !!props.userPageUi.selectedNormalPlanetIdForSet ||
      !!props.userPageUi.selectedSpecialPlanetTokenIdForSet
    ) {
      if (settable) {
        selectFn = () => {
          if (props.userPageUi.selectedNormalPlanetIdForSet) {
            props.userPageUiActions.selectPlanetHexForSet(h.q, h.r)
            return
          }
          if (props.userPageUi.selectedSpecialPlanetTokenIdForSet) {
            props.userActions.special.setPlanetTokenToMap(
              props.userPageUi.selectedSpecialPlanetTokenIdForSet,
              h.q,
              h.r
            )
            props.userPageUiActions.unselectSpecialPlanetTokenForSet()
            return
          }

          throw new Error("this must be called with target")
        }
      }
    } else if (!!h.userPlanet) {
      if (h.userPlanet.isNormal) {
        selectFn = () => {
          if (!h.userPlanet) {
            return
          }
          props.userPageUiActions.selectUserNormalPlanetForModal(h.userPlanet.id)
        }
      } else {
        selectFn = () => {
          if (!h.userPlanet) {
            return
          }
          props.userPageUiActions.selectUserSpecialPlanetForModal(h.userPlanet.id)
        }
      }
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
        isSelected={isSelected}
        select={selectFn}
      />
    )
  })

  const height = (shownRadius * 2 + 1) * hexHeight

  let btn = <></>
  if (!!planetId && props.userPageUi.selectedPlanetHexesForSet.length > 0) {
    const fn = () => {
      props.userActions.normal.setPlanetsToMap(planetId, props.userPageUi.selectedPlanetHexesForSet)
      props.userPageUiActions.unselectNormalPlanetForSet()
      props.userPageUiActions.unselectPlanetHexesForSet()
    }
    btn = <button onClick={fn}>set to map</button>
  }

  return (
    <>
      <WrappedModal {...props} />
      {btn}
      <div style={{ position: "relative", height: height }}>{hexes}</div>
    </>
  )
}

function WrappedModal(props: Props) {
  if (props.userPageUi.selectedUserNormalPlanetIdForModal) {
    const up = props.user.userNormalPlanets.find(
      up => up.id === props.userPageUi.selectedUserNormalPlanetIdForModal
    )
    // this must be always true
    if (up) {
      return (
        <Modal close={props.userPageUiActions.unselectUserNormalPlanetForModal}>
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

  if (props.userPageUi.selectedUserSpecialPlanetIdForModal) {
    const up = props.user.userSpecialPlanets.find(
      up => up.id === props.userPageUi.selectedUserSpecialPlanetIdForModal
    )
    // this must be always true
    if (up) {
      const buttonFn = () => props.userActions.special.removeUserPlanetFromMap(up.id)
      const button = props.isMine ? <button onClick={buttonFn}>Remove</button> : <></>
      return (
        <Modal close={props.userPageUiActions.unselectUserSpecialPlanetForModal}>
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
