import * as React from "react"
import BN from "bn.js"

import { BNFormatter } from "../models/BNFormatter"
import { ChainContractMethods, SpecialPlanetTokenFields } from "../models/ChainContractMethods"
import { PlanetArt } from "./utils/PlanetArt"

export function SpecialPlanetTokenMetadataPage(props: { params: Array<string> }) {
  const tokenId = props.params[0]
  const [fields, setFields] = React.useState<null | { tokenId: string } & SpecialPlanetTokenFields>(
    null
  )

  React.useEffect(() => {
    ChainContractMethods.getSpecialPlanetTokenFields(tokenId).then(f => {
      setFields({ tokenId, ...f })
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
  const param = new BN(10).pow(new BN(fields.originalParamCommonLogarithm))
  const obj = {
    name: `Fuga ${fields.shortId}`,
    description: `piyopiyo ${tokenId}`,
    image: "<IMAGE_URL>",
    attributes: [
      { trait_type: "kind", value: fields.kind },
      {
        trait_type: "parameter",
        value: BNFormatter.pretty(param).join("")
      }
    ],
    background_color: "000000"
  }

  return JSON.stringify(obj)
}
