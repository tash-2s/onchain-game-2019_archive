import { chains } from "../misc/chains"
import { planetKindNumToKind } from "../constants"

export class ChainContractMethods {
  static getSpecialPlanetTokenFields = async (
    tokenIds: Array<string>
  ): Promise<Array<SpecialPlanetTokenFields>> => {
    const r = await chains.loom
      .specialPlanetController()
      .methods.getPlanetFieldsFromTokenIds(tokenIds)
      .call()

    return tokenIds.map((_, i) => ({
      shortId: r.shortIds[i],
      version: strToNum(r.versions[i]),
      kind: planetKindNumToKind(strToNum(r.kinds[i])),
      paramRate: strToNum(r.paramRates[i]),
      artSeed: r.artSeeds[i]
    }))
  }
}

export interface SpecialPlanetTokenFields {
  shortId: string
  version: number
  kind: "residence" | "goldmine" | "technology"
  paramRate: number
  artSeed: string
}

const strToNum = (str: string) => parseInt(str, 10)
