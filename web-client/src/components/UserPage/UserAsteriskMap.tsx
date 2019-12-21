import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { UserPageUIActions } from "../../actions/UserPageUIActions"
import { UserPageUIState } from "../../reducers/userPageUIReducer"
import { UserPageActionsProps } from "../../containers/UserPageContainer"

import { AsteriskHex } from "./AsteriskHex"
import { UserAsterisk } from "./UserAsterisk"
import { Modal } from "../utils/Modal"
import { AsteriskArt } from "../utils/AsteriskArt"
import { PrettyBN } from "../utils/PrettyBN"
import { UserAsteriskMapUtil } from "../../models/UserAsteriskMapUtil"
import { maxSelectableAsteriskHexCount } from "../../constants"

interface Props {
  user: ComputedTargetUserState
  userActions: UserPageActionsProps["userActions"]
  userPageUI: UserPageUIState
  userPageUIActions: UserPageUIActions
  now: number
  isMine: boolean
}

const placeholderId = "user-asterisk-map-placeholder"

export function UserAsteriskMap(props: Props) {
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
    props.user.userAsteriskMap.shownRadius
  )

  return (
    <>
      <UserAsteriskDetailModal {...props} />
      {props.isMine ? <InGameAsterisksSetForm {...props} /> : <></>}
      {props.isMine ? <InGameAsterisksRemovalForm {...props} /> : <></>}
      <div style={{ position: "relative", height: mapHeight }}>
        <Hexes {...props} hexSize={hexSize} hexWidth={hexWidth} hexHeight={hexHeight} />
      </div>
    </>
  )
}

function Hexes(props: Props & { hexSize: number; hexWidth: number; hexHeight: number }) {
  const { isSufficientGoldForNextInGameAsteriskSet, usableRadius } = processForMultiAsteriskSet(
    props.user,
    props.userPageUI
  )

  const hexes = props.user.userAsteriskMap.hexes.map(h => {
    const userAsterisk = h.userAsterisk

    const isHighlighted =
      !!props.userPageUI.selectedAsteriskHexesForSet.find(
        o => o.axialCoordinateQ === h.q && o.axialCoordinateR === h.r
      ) ||
      (!!props.userPageUI.selectedUserInGameAsteriskIdsForRemoval &&
        !!userAsterisk &&
        userAsterisk.isInGame &&
        !!props.userPageUI.selectedUserInGameAsteriskIdsForRemoval.find(id => id === userAsterisk.id))

    const select =
      selectFn(props, h, usableRadius, isSufficientGoldForNextInGameAsteriskSet) || undefined

    return (
      <AsteriskHex
        key={`${h.q}/${h.r}`}
        q={h.q}
        r={h.r}
        userAsterisk={userAsterisk}
        shiftTop={props.user.userAsteriskMap.shownRadius * props.hexHeight}
        shiftLeft={props.user.userAsteriskMap.shownRadius * ((props.hexWidth / 4) * 3)}
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

const processForMultiAsteriskSet = (user: ComputedTargetUserState, userPageUI: UserPageUIState) => {
  let isSufficientGoldForNextInGameAsteriskSet = true
  let remainingGold = user.gold

  if (
    !!userPageUI.selectedInGameAsteriskIdForSet &&
    userPageUI.selectedAsteriskHexesForSet.length > 0
  ) {
    const asterisk = user.inGameAsterisks.find(p => p.id === userPageUI.selectedInGameAsteriskIdForSet)
    if (!asterisk) {
      throw new Error("unknown asterisk")
    }
    const buyableCount = user.gold.div(asterisk.priceGold)
    isSufficientGoldForNextInGameAsteriskSet = buyableCount.gtn(
      userPageUI.selectedAsteriskHexesForSet.length
    )
    remainingGold = user.gold.sub(
      asterisk.priceGold.muln(userPageUI.selectedAsteriskHexesForSet.length)
    )
  }

  const usableRadius = UserAsteriskMapUtil.mapRadiusFromGold(remainingGold)

  return { isSufficientGoldForNextInGameAsteriskSet, usableRadius }
}

const selectFn = (
  props: Props,
  hex: ComputedTargetUserState["userAsteriskMap"]["hexes"][number],
  usableRadius: number,
  isSufficientGoldForNextInGameAsteriskSet: boolean
) => {
  if (props.userPageUI.selectedInGameAsteriskIdForSet) {
    if (props.isMine && !hex.userAsterisk) {
      const isAlreadySet = !!props.userPageUI.selectedAsteriskHexesForSet.find(
        o => o.axialCoordinateQ === hex.q && o.axialCoordinateR === hex.r
      )
      if (
        isAlreadySet || // for unselect
        (isSufficientGoldForNextInGameAsteriskSet &&
          UserAsteriskMapUtil.distanceFromCenter(hex.q, hex.r) <= usableRadius &&
          props.userPageUI.selectedAsteriskHexesForSet.length < maxSelectableAsteriskHexCount)
      ) {
        return () => props.userPageUIActions.selectAsteriskHexForSet(hex.q, hex.r)
      }
    }
    return null
  }

  if (props.userPageUI.selectedTradableAsteriskTokenIdForSet) {
    if (props.isMine && !hex.userAsterisk) {
      if (UserAsteriskMapUtil.distanceFromCenter(hex.q, hex.r) <= usableRadius) {
        const id = props.userPageUI.selectedTradableAsteriskTokenIdForSet
        return () => {
          props.userActions.tradable.setAsteriskTokenToMap(id, hex.q, hex.r)
          props.userPageUIActions.unselectTradableAsteriskTokenForSet()
        }
      }
    }
    return null
  }

  if (props.userPageUI.selectedUserInGameAsteriskIdsForRemoval) {
    const userAsterisk = hex.userAsterisk
    if (props.isMine && userAsterisk && userAsterisk.isInGame) {
      const isAlreadySelected = !!props.userPageUI.selectedUserInGameAsteriskIdsForRemoval.find(
        id => id === userAsterisk.id
      )
      if (
        isAlreadySelected || // for unselect
        props.userPageUI.selectedUserInGameAsteriskIdsForRemoval.length < maxSelectableAsteriskHexCount
      ) {
        return () => props.userPageUIActions.selectUserInGameAsteriskForRemoval(userAsterisk.id)
      }
    }
    return null
  }

  if (hex.userAsterisk) {
    const up = hex.userAsterisk
    if (up.isInGame) {
      return () => props.userPageUIActions.selectUserInGameAsteriskForModal(up.id)
    } else {
      return () => props.userPageUIActions.selectUserTradableAsteriskForModal(up.id)
    }
  }

  return null
}

function UserAsteriskDetailModal(props: Props) {
  if (props.userPageUI.selectedUserInGameAsteriskIdForModal) {
    const up = props.user.userInGameAsterisks.find(
      up => up.id === props.userPageUI.selectedUserInGameAsteriskIdForModal
    )
    // this must be always true
    if (up) {
      return (
        <Modal close={props.userPageUIActions.unselectUserInGameAsteriskForModal}>
          <AsteriskArt kind={up.asterisk.kind} artSeed={up.asterisk.artSeed} canvasSize={300} />
          <UserAsterisk
            userAsterisk={up}
            isMine={props.isMine}
            knowledge={props.user.knowledge}
            now={props.now}
            userActions={props.userActions}
          />
        </Modal>
      )
    }
  }

  if (props.userPageUI.selectedUserTradableAsteriskIdForModal) {
    const up = props.user.userTradableAsterisks.find(
      up => up.id === props.userPageUI.selectedUserTradableAsteriskIdForModal
    )
    // this must be always true
    if (up) {
      const buttonFn = () => props.userActions.tradable.removeUserAsteriskFromMap(up.id)
      const button = props.isMine ? <button onClick={buttonFn}>Remove</button> : <></>
      return (
        <Modal close={props.userPageUIActions.unselectUserTradableAsteriskForModal}>
          <AsteriskArt kind={up.kind} artSeed={up.artSeed} canvasSize={300} />
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

function InGameAsterisksSetForm(props: Props) {
  const asteriskId = props.userPageUI.selectedInGameAsteriskIdForSet
  if (!asteriskId || props.userPageUI.selectedAsteriskHexesForSet.length <= 0) {
    return <></>
  }
  const unselectFn = () => {
    props.userPageUIActions.unselectInGameAsteriskForSet()
    props.userPageUIActions.unselectAsteriskHexesForSet()
  }
  const fn = () => {
    props.userActions.inGame.setAsterisksToMap(
      asteriskId,
      props.userPageUI.selectedAsteriskHexesForSet,
      props.user.userInGameAsterisks.length === 0 && props.user.gold.eqn(0)
    )
    unselectFn()
  }
  return (
    <div>
      <button onClick={fn}>set to map</button>
      <button onClick={unselectFn}>cancel</button>
      <span>
        {props.userPageUI.selectedAsteriskHexesForSet.length}/{maxSelectableAsteriskHexCount}
      </span>
    </div>
  )
}

function InGameAsterisksRemovalForm(props: Props) {
  const selectedUserInGameAsteriskIds = props.userPageUI.selectedUserInGameAsteriskIdsForRemoval

  if (!selectedUserInGameAsteriskIds) {
    return (
      <button onClick={props.userPageUIActions.startSelectingUserInGameAsteriskForRemoval}>
        remove inGame asterisks
      </button>
    )
  }

  const removalFn =
    selectedUserInGameAsteriskIds.length > 0
      ? () => {
          props.userActions.inGame.removeUserAsterisks(selectedUserInGameAsteriskIds)
          props.userPageUIActions.endSelectingUserInGameAsteriskForRemoval()
        }
      : undefined

  return (
    <div>
      <button disabled={!removalFn} onClick={removalFn}>
        remove selected inGame asterisks
      </button>
      <button onClick={props.userPageUIActions.endSelectingUserInGameAsteriskForRemoval}>
        cancel
      </button>
      <span>
        {selectedUserInGameAsteriskIds.length}/{maxSelectableAsteriskHexCount}
      </span>
    </div>
  )
}
