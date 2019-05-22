import * as React from "react"
import BN from "bn.js"
import { BNFormatter } from "../../models/BNFormatter"

export function PrettyBN(props: { bn: BN }) {
  const [num, sym] = BNFormatter.pretty(props.bn)

  return (
    <span>
      <span>{num}</span>
      <span style={{ color: "red" }}>{sym}</span>
    </span>
  )
}
