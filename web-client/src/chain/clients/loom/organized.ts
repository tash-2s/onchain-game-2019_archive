import { PlanetKind, planetKindNumToKind } from "../../../constants"
import { SpecialPlanetController } from "./SpecialPlanetController"

type ExtractFromPromise<T> = T extends Promise<infer R> ? R : never

export const getUserSpecialPlanets = async (address: string) => {
  const r = await SpecialPlanetController.getPlanets(address)

  const userSpecialPlanets = r.ids.map((_, i) => ({
    id: r.ids[i],
    kind: planetKindNumToKind(strToNum(r.kinds[i])),
    paramRate: strToNum(r.paramRates[i]),
    rankupedAt: strToNum(r.times[i * 2]),
    createdAt: strToNum(r.times[i * 2 + 1]),
    axialCoordinateQ: strToNum(r.axialCoordinates[i * 2]),
    axialCoordinateR: strToNum(r.axialCoordinates[i * 2 + 1]),
    artSeed: r.artSeeds[i]
  }))

  return {
    user: { confirmedGold: r.confirmedGold, goldConfirmedAt: strToNum(r.goldConfirmedAt) },
    userSpecialPlanets
  }
}

export type ReturnTypeOfGetUserSpecialPlanets = ExtractFromPromise<
  ReturnType<typeof getUserSpecialPlanets>
>

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
