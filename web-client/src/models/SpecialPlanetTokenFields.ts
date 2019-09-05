import BN from "bn.js"

import { PlanetKind, planetKindNumToKind } from "../constants"

export class SpecialPlanetTokenFields {
  shortId: string
  version: number
  kind: PlanetKind
  originalParamCommonLogarithm: number
  artSeedStr: string
  artSeed: BN

  constructor(fields: Array<string>) {
    if (fields.length !== 5) {
      throw new Error("invalid arg")
    }
    this.shortId = fields[0]
    this.version = strToNum(fields[1])
    this.kind = planetKindNumToKind(strToNum(fields[2]))
    this.originalParamCommonLogarithm = strToNum(fields[3])
    this.artSeedStr = fields[4]
    this.artSeed = new BN(fields[4])
  }
}

const strToNum = (str: string) => parseInt(str, 10)
