import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { UserActionsForSpecialPlanet } from "../../actions/UserActionsForSpecialPlanet"
import { UserPageUiActions } from "../../actions/UserPageUiActions"

import { PlanetArt } from "../utils/PlanetArt"

export function Tokens(props: {
  user: ComputedTargetUserState
  userActionsForSpecialPlanet: UserActionsForSpecialPlanet
  userPageUiActions: UserPageUiActions
}) {
  React.useEffect(() => {
    props.userActionsForSpecialPlanet.setTargetUserPlanetTokens()
    return props.userActionsForSpecialPlanet.clearTargetUserPlanetTokens
  }, [props.user.address])

  if (!props.user.specialPlanetToken) {
    return <div className={"box"}>loading...</div>
  }

  const reload = () => props.userActionsForSpecialPlanet.setTargetUserPlanetTokens()
  const ethTokens = props.user.specialPlanetToken.ethTokens.map(token => {
    const onClick = () => props.userActionsForSpecialPlanet.transferPlanetTokenToLoom(token.id)
    return (
      <li key={token.id}>
        {token.id}:{token.shortId}:{token.version}:{token.kind}:{token.originalParamCommonLogarithm}
        :{token.artSeed.toString()}
        <PlanetArt kind={token.kind} artSeed={token.artSeed} canvasSize={100} />
        <button onClick={onClick}>transfer to loom</button>
      </li>
    )
  })
  const msg1 = props.user.specialPlanetToken.transferToLoomTx
    ? `Transfer requested. After the confirmation of eth tx (${props.user.specialPlanetToken.transferToLoomTx}), it takes additional 15 minutes to see the token on loom`
    : ""
  const loomTokens = props.user.specialPlanetToken.loomTokens.map(token => {
    const transferFn = () => props.userActionsForSpecialPlanet.transferPlanetTokenToEth(token.id)
    const selectForSetFn = () => props.userPageUiActions.selectSpecialPlanetTokenForSet(token.id)
    return (
      <li key={token.id}>
        {token.id}:{token.shortId}:{token.version}:{token.kind}:{token.originalParamCommonLogarithm}
        :{token.artSeed.toString()}
        <PlanetArt kind={token.kind} artSeed={token.artSeed} canvasSize={100} />
        <button onClick={transferFn}>transfer to eth</button>
        <button onClick={selectForSetFn}>set to map</button>
      </li>
    )
  })
  const msg2 = props.user.specialPlanetToken.transferToEthTx
    ? `requested. tx: ${props.user.specialPlanetToken.transferToEthTx}`
    : ""
  const resumeFn = () => props.userActionsForSpecialPlanet.transferPlanetTokenToEth()
  const resume = props.user.specialPlanetToken.needsTransferResume ? (
    <button onClick={resumeFn}>you have an ongoing transfer, resume it</button>
  ) : (
    <></>
  )
  const goToMainView = () => props.userPageUiActions.selectViewKind("main")
  return (
    <div className={"box"}>
      <button onClick={goToMainView}>go main view</button>

      <button onClick={reload}>reload</button>

      <h2 className={"title is-6"}>eth</h2>
      <ul>{ethTokens}</ul>
      <div>{msg1}</div>
      <button onClick={props.userActionsForSpecialPlanet.buyPlanetToken}>buy a planet</button>
      <div>{props.user.specialPlanetToken.buyTx}</div>

      <h2 className={"title is-6"}>loom</h2>
      <ul>{loomTokens}</ul>
      <div>{msg2}</div>
      {resume}
    </div>
  )
}
