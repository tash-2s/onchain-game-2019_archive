import * as React from "react"
import BN from "bn.js"

import { PrettyBN } from "./PrettyBN"
import { AsteriskKind } from "../../constants"

export function AsteriskParam(props: { kind: AsteriskKind; param: BN }) {
  if (props.kind === "technology") {
    return <span>{props.param.toNumber().toLocaleString()}</span>
  } else {
    return <PrettyBN bn={props.param} />
  }
}
