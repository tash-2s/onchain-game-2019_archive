import * as React from "react"
import BN from "bn.js"

import { PrettyBN } from "./PrettyBN"
import { PlanetKind } from "../../constants"

export function PlanetParam(props: { planet: { kind: PlanetKind; param: BN } }) {
  if (props.planet.kind === "technology") {
    return <span>{props.planet.param.toNumber().toLocaleString()}</span>
  } else {
    return <PrettyBN bn={props.planet.param} />
  }
}
