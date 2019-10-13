import { PlanetKind, planetKindNumToKind } from "../../../constants"
import { SpecialPlanetController } from "./SpecialPlanetController"

export const getSpecialPlanetTokenFields = async (
  tokenIds: Array<string>
): Promise<Array<SpecialPlanetTokenFields>> => {
  const r = await SpecialPlanetController.getPlanetFieldsFromTokenIds(tokenIds)

  return tokenIds.map((_, i) => ({
    shortId: r.shortIds[i],
    version: strToNum(r.versions[i]),
    kind: planetKindNumToKind(strToNum(r.kinds[i])),
    paramRate: strToNum(r.paramRates[i]),
    artSeed: r.artSeeds[i]
  }))
}

export interface SpecialPlanetTokenFields {
  shortId: string
  version: number
  kind: PlanetKind
  paramRate: number
  artSeed: string
}

const strToNum = (str: string) => parseInt(str, 10)
