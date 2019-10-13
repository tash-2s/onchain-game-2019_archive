import * as React from "react"
import BN from "bn.js"

import { BNFormatter } from "../models/BNFormatter"
import {
  getSpecialPlanetTokenFields,
  SpecialPlanetTokenFields
} from "../chain/clients/loom/organized"
import { PlanetArt } from "./utils/PlanetArt"

export function SpecialPlanetTokenMetadataPage(props: { params: Array<string> }) {
  const tokenId = props.params[0]
  const [fields, setFields] = React.useState<null | { tokenId: string } & SpecialPlanetTokenFields>(
    null
  )

  React.useEffect(() => {
    getSpecialPlanetTokenFields([tokenId]).then(f => {
      setFields({ tokenId, ...f[0] })
    })
  }, [tokenId])

  if (fields && tokenId === fields.tokenId) {
    const json = buildJSON(tokenId, fields)

    return (
      <div>
        <div id={"planet-json"}>{json}</div>
        <div id={"planet-art"}>
          <PlanetArt kind={fields.kind} artSeed={new BN(fields.artSeed)} canvasSize={500} />
        </div>
      </div>
    )
  } else {
    return <div>loading...</div>
  }
}

const buildJSON = (tokenId: string, fields: SpecialPlanetTokenFields) => {
  const obj = {
    name: `Fuga #${fields.shortId}`,
    description: `Full ID: ${tokenId}`,
    image: "<IMAGE_URL>",
    attributes: [
      { trait_type: "kind", value: fields.kind },
      {
        trait_type: "parameter",
        value: fields.paramRate
      }
    ],
    background_color: "000000"
  }

  return JSON.stringify(obj)
}
