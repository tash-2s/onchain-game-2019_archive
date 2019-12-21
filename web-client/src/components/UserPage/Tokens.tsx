import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { UserActionsForTradableAsterisk } from "../../actions/UserActionsForTradableAsterisk"
import { UserPageUIActions } from "../../actions/UserPageUIActions"

import { AsteriskArt } from "../utils/AsteriskArt"

export function Tokens(props: {
  user: ComputedTargetUserState
  userActionsForTradableAsterisk: UserActionsForTradableAsterisk
  userPageUIActions: UserPageUIActions
}) {
  React.useEffect(() => {
    props.userActionsForTradableAsterisk.setTargetUserAsteriskTokens()
    return props.userActionsForTradableAsterisk.clearTargetUserAsteriskTokens
  }, [props.user.address])

  if (!props.user.tradableAsteriskToken) {
    return <div className={"box"}>loading...</div>
  }

  const reload = () => {
    props.userActionsForTradableAsterisk.clearTargetUserAsteriskTokens()
    props.userActionsForTradableAsterisk.setTargetUserAsteriskTokens()
  }
  const ethTokens = props.user.tradableAsteriskToken.ethTokens.map(token => {
    const onClick = () => props.userActionsForTradableAsterisk.transferAsteriskTokenToLoom(token.id)
    return (
      <li key={token.id}>
        {token.id}:{token.shortId}:{token.version}:{token.kind}:{token.paramRate}:
        {token.artSeed.toString()}
        <AsteriskArt kind={token.kind} artSeed={token.artSeed} canvasSize={100} />
        <button onClick={onClick}>transfer to loom</button>
      </li>
    )
  })
  const msg1 = props.user.tradableAsteriskToken.transferToLoomTx
    ? `Transfer requested. After the confirmation of eth tx (${props.user.tradableAsteriskToken.transferToLoomTx}), it takes additional 15 minutes to see the token on loom`
    : ""
  const loomTokens = props.user.tradableAsteriskToken.loomTokens.map(token => {
    const transferFn = () =>
      props.userActionsForTradableAsterisk.transferAsteriskTokenToEth(token.id)
    const selectForSetFn = () => props.userPageUIActions.selectTradableAsteriskTokenForSet(token.id)
    return (
      <li key={token.id}>
        {token.id}:{token.shortId}:{token.version}:{token.kind}:{token.paramRate}:
        {token.artSeed.toString()}
        <AsteriskArt kind={token.kind} artSeed={token.artSeed} canvasSize={100} />
        <button onClick={transferFn}>transfer to eth</button>
        <button onClick={selectForSetFn}>set to map</button>
      </li>
    )
  })
  const msg2 = props.user.tradableAsteriskToken.transferToEthTx
    ? `requested. tx: ${props.user.tradableAsteriskToken.transferToEthTx}`
    : ""
  const resumeFn = () => props.userActionsForTradableAsterisk.transferAsteriskTokenToEth()
  const resume = props.user.tradableAsteriskToken.needsTransferResume ? (
    <button onClick={resumeFn}>you have an ongoing transfer, resume it</button>
  ) : (
    <></>
  )
  const goToMainView = () => props.userPageUIActions.selectPageViewKind("main")
  return (
    <div className={"box"}>
      <button onClick={goToMainView}>go main view</button>

      <button onClick={reload}>reload</button>

      <h2 className={"title is-6"}>eth</h2>
      <ul>{ethTokens}</ul>
      <div>{msg1}</div>
      <button onClick={props.userActionsForTradableAsterisk.buyAsteriskToken}>
        buy a asterisk
      </button>
      <div>{props.user.tradableAsteriskToken.buyTx}</div>

      <h2 className={"title is-6"}>loom</h2>
      <ul>{loomTokens}</ul>
      <div>{msg2}</div>
      {resume}
    </div>
  )
}
