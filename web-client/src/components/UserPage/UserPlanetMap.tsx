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
import { UserPlanetMapUtil } from "../../models/UserPlanetMapUtil"
import { maxSelectablePlanetHexCount } from "../../constants"

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

  const { hexSize, hexWidth, hexHeight, mapHeight } = calcHexSizes(
    width,
    props.user.userPlanetMap.shownRadius
  )

  return (
    <>
      <UserPlanetDetailModal {...props} />
      {props.isMine ? <NormalPlanetsSetForm {...props} /> : <></>}
      {props.isMine ? <NormalPlanetsRemovalForm {...props} /> : <></>}
      <div style={{ position: "relative", height: mapHeight }}>
        <Hexes {...props} hexSize={hexSize} hexWidth={hexWidth} hexHeight={hexHeight} />
      </div>
    </>
  )
}

function Hexes(props: Props & { hexSize: number; hexWidth: number; hexHeight: number }) {
  const { isSufficientGoldForNextNormalPlanetSet, usableRadius } = processForMultiPlanetSet(
    props.user,
    props.userPageUI
  )

  const hexes = props.user.userPlanetMap.hexes.map(h => {
    const userPlanet = h.userPlanet

    const isHighlighted =
      !!props.userPageUI.selectedPlanetHexesForSet.find(
        o => o.axialCoordinateQ === h.q && o.axialCoordinateR === h.r
      ) ||
      (!!props.userPageUI.selectedUserNormalPlanetIdsForRemoval &&
        !!userPlanet &&
        userPlanet.isNormal &&
        !!props.userPageUI.selectedUserNormalPlanetIdsForRemoval.find(id => id === userPlanet.id))

    const select =
      selectFn(props, h, usableRadius, isSufficientGoldForNextNormalPlanetSet) || undefined

    return (
      <PlanetHex
        key={`${h.q}/${h.r}`}
        q={h.q}
        r={h.r}
        userPlanet={userPlanet}
        shiftTop={props.user.userPlanetMap.shownRadius * props.hexHeight}
        shiftLeft={props.user.userPlanetMap.shownRadius * ((props.hexWidth / 4) * 3)}
        hexSize={props.hexSize}
        hexWidth={props.hexWidth}
        hexHeight={props.hexHeight}
        isHighlighted={isHighlighted}
        select={select}
      />
    )
  })

  return <>{hexes}</>
}

const calcHexSizes = (width: number, radius: number) => {
  // Show biggest map for this area
  // Calc hex sizes to fit mapWidth
  // mapWidth (= state.width) = (1.5 * hexSize) * (mapRadius * 2 + 1) + (0.5 * hexSize)
  // Transform this equation for hexSize...
  const hexSize = Math.min(width / (3 * radius + 2), 100) // max: 100
  const hexWidth = hexSize * 2
  const hexHeight = Math.sqrt(3) * hexSize

  const mapHeight = (radius * 2 + 1) * hexHeight

  return { hexSize, hexWidth, hexHeight, mapHeight }
}

const processForMultiPlanetSet = (user: ComputedTargetUserState, userPageUI: UserPageUIState) => {
  let isSufficientGoldForNextNormalPlanetSet = true
  let remainingGold = user.gold

  if (
    !!userPageUI.selectedNormalPlanetIdForSet &&
    userPageUI.selectedPlanetHexesForSet.length > 0
  ) {
    const planet = user.normalPlanets.find(p => p.id === userPageUI.selectedNormalPlanetIdForSet)
    if (!planet) {
      throw new Error("unknown planet")
    }
    const buyableCount = user.gold.div(planet.priceGold)
    isSufficientGoldForNextNormalPlanetSet = buyableCount.gtn(
      userPageUI.selectedPlanetHexesForSet.length
    )
    remainingGold = user.gold.sub(
      planet.priceGold.muln(userPageUI.selectedPlanetHexesForSet.length)
    )
  }

  const usableRadius = UserPlanetMapUtil.mapRadiusFromGold(remainingGold)

  return { isSufficientGoldForNextNormalPlanetSet, usableRadius }
}

const selectFn = (
  props: Props,
  hex: ComputedTargetUserState["userPlanetMap"]["hexes"][number],
  usableRadius: number,
  isSufficientGoldForNextNormalPlanetSet: boolean
) => {
  if (props.userPageUI.selectedNormalPlanetIdForSet) {
    if (props.isMine && !hex.userPlanet) {
      const isAlreadySet = !!props.userPageUI.selectedPlanetHexesForSet.find(
        o => o.axialCoordinateQ === hex.q && o.axialCoordinateR === hex.r
      )
      if (
        isAlreadySet || // for unselect
        (isSufficientGoldForNextNormalPlanetSet &&
          UserPlanetMapUtil.distanceFromCenter(hex.q, hex.r) <= usableRadius &&
          props.userPageUI.selectedPlanetHexesForSet.length < maxSelectablePlanetHexCount)
      ) {
        return () => props.userPageUIActions.selectPlanetHexForSet(hex.q, hex.r)
      }
    }
    return null
  }

  if (props.userPageUI.selectedSpecialPlanetTokenIdForSet) {
    if (props.isMine && !hex.userPlanet) {
      if (UserPlanetMapUtil.distanceFromCenter(hex.q, hex.r) <= usableRadius) {
        const id = props.userPageUI.selectedSpecialPlanetTokenIdForSet
        return () => {
          props.userActions.special.setPlanetTokenToMap(id, hex.q, hex.r)
          props.userPageUIActions.unselectSpecialPlanetTokenForSet()
        }
      }
    }
    return null
  }

  if (props.userPageUI.selectedUserNormalPlanetIdsForRemoval) {
    const userPlanet = hex.userPlanet
    if (props.isMine && userPlanet && userPlanet.isNormal) {
      const isAlreadySelected = !!props.userPageUI.selectedUserNormalPlanetIdsForRemoval.find(
        id => id === userPlanet.id
      )
      if (
        isAlreadySelected || // for unselect
        props.userPageUI.selectedUserNormalPlanetIdsForRemoval.length < maxSelectablePlanetHexCount
      ) {
        return () => props.userPageUIActions.selectUserNormalPlanetForRemoval(userPlanet.id)
      }
    }
    return null
  }

  if (hex.userPlanet) {
    const up = hex.userPlanet
    if (up.isNormal) {
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

function NormalPlanetsSetForm(props: Props) {
  const planetId = props.userPageUI.selectedNormalPlanetIdForSet
  if (!planetId || props.userPageUI.selectedPlanetHexesForSet.length <= 0) {
    return <></>
  }
  const unselectFn = () => {
    props.userPageUIActions.unselectNormalPlanetForSet()
    props.userPageUIActions.unselectPlanetHexesForSet()
  }
  const fn = () => {
    props.userActions.normal.setPlanetsToMap(
      planetId,
      props.userPageUI.selectedPlanetHexesForSet,
      props.user.userNormalPlanets.length === 0 && props.user.gold.eqn(0)
    )
    unselectFn()
  }
  return (
    <div>
      <button onClick={fn}>set to map</button>
      <button onClick={unselectFn}>cancel</button>
      <span>
        {props.userPageUI.selectedPlanetHexesForSet.length}/{maxSelectablePlanetHexCount}
      </span>
    </div>
  )
}

function NormalPlanetsRemovalForm(props: Props) {
  const selectedUserNormalPlanetIds = props.userPageUI.selectedUserNormalPlanetIdsForRemoval

  if (!selectedUserNormalPlanetIds) {
    return (
      <button onClick={props.userPageUIActions.startSelectingUserNormalPlanetForRemoval}>
        remove normal planets
      </button>
    )
  }

  const removalFn =
    selectedUserNormalPlanetIds.length > 0
      ? () => {
          props.userActions.normal.removeUserPlanets(selectedUserNormalPlanetIds)
          props.userPageUIActions.endSelectingUserNormalPlanetForRemoval()
        }
      : undefined

  return (
    <div>
      <button disabled={!removalFn} onClick={removalFn}>
        remove selected normal planets
      </button>
      <button onClick={props.userPageUIActions.endSelectingUserNormalPlanetForRemoval}>
        cancel
      </button>
      <span>
        {selectedUserNormalPlanetIds.length}/{maxSelectablePlanetHexCount}
      </span>
    </div>
  )
}
