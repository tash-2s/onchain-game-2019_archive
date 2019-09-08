import { chains } from "../misc/chains"
import { planetKindNumToKind } from "../constants"

export class ChainContractMethods {
  static getSpecialPlanetTokenFields = async (tokenId: string) => {
    const f = await chains.loom
      .specialPlanetController()
      .methods.getPlanetFieldsFromTokenId(tokenId)
      .call()

    return {
      shortId: f[0] as string,
      version: strToNum(f[1]),
      kind: planetKindNumToKind(strToNum(f[2])),
      originalParamCommonLogarithm: strToNum(f[3]),
      artSeed: f[4] as string
    }
  }
}

const _ChainContractMethodsgetTokenFields = ChainContractMethods.getSpecialPlanetTokenFields
type ExtractFromPromise<T> = T extends Promise<infer R> ? R : never
export type SpecialPlanetTokenFields = ExtractFromPromise<
  ReturnType<typeof _ChainContractMethodsgetTokenFields>
>

const strToNum = (str: string) => parseInt(str, 10)
