import * as React from "react"
import BN from "bn.js"

import { PrettyBN } from "./PrettyBN"
import { PlanetKind } from "../../constants"

export function PlanetParam(props: { kind: PlanetKind; param: BN }) {
  if (props.kind === "technology") {
    return <span>{props.param.toNumber().toLocaleString()}</span>
  } else {
    return <PrettyBN bn={props.param} />
  }
}
