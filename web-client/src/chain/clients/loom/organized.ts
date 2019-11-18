import { planetKindNumToKind } from "../../../constants"
import { SpecialPlanetController } from "./SpecialPlanetController"
import { NormalPlanetController } from "./NormalPlanetController"
import { chains } from "../../chains"

type ExtractFromPromise<T> = T extends Promise<infer R> ? R : never

export const getUserNormalPlanets = async (address: string) => {
  const r = await new NormalPlanetController(chains.loom).getPlanets(address)

  const userNormalPlanets = r.ranks.map((_, i) => ({
    id: r.ids[i * 2],
    normalPlanetId: strToNum(r.ids[i * 2 + 1]),
    rank: strToNum(r.ranks[i]),
    rankupedAt: strToNum(r.times[i * 2]),
    createdAt: strToNum(r.times[i * 2 + 1]),
    axialCoordinateQ: strToNum(r.coordinates[i * 2]),
    axialCoordinateR: strToNum(r.coordinates[i * 2 + 1])
  }))

  return {
    user: { confirmedGold: r.confirmedGold, goldConfirmedAt: strToNum(r.goldConfirmedAt) },
    userNormalPlanets
  }
}
export type ReturnTypeOfGetUserNormalPlanets = ExtractFromPromise<
  ReturnType<typeof getUserNormalPlanets>
>

export const getUserSpecialPlanets = async (address: string) => {
  const r = await new SpecialPlanetController(chains.loom).getPlanets(address)

  const userSpecialPlanets = r.ids.map((_, i) => ({
    id: r.ids[i],
    kind: planetKindNumToKind(strToNum(r.kinds[i])),
    paramRate: strToNum(r.paramRates[i]),
    rankupedAt: strToNum(r.times[i * 2]),
    createdAt: strToNum(r.times[i * 2 + 1]),
    axialCoordinateQ: strToNum(r.coordinates[i * 2]),
    axialCoordinateR: strToNum(r.coordinates[i * 2 + 1]),
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

export const getSpecialPlanetTokensByIds = async (tokenIds: Array<string>) => {
  const fields: Array<SpecialPlanetToken> = []
  const batchSize = 100

  for (let i = 0; i < tokenIds.length; i += batchSize) {
    const ids = tokenIds.slice(i, i + batchSize)
    const fs = await _getSpecialPlanetTokensByIds(ids)
    fields.push(...fs)
  }

  return fields
}

const _getSpecialPlanetTokensByIds = async (tokenIds: Array<string>) => {
  const r = await new SpecialPlanetController(chains.loom).getPlanetFieldsFromTokenIds(tokenIds)

  return tokenIds.map((id, i) => ({
    id: id,
    shortId: r.shortIds[i],
    version: strToNum(r.versions[i]),
    kind: planetKindNumToKind(strToNum(r.kinds[i])),
    paramRate: strToNum(r.paramRates[i]),
    artSeed: r.artSeeds[i]
  }))
}
export type SpecialPlanetToken = ExtractFromPromise<
  ReturnType<typeof _getSpecialPlanetTokensByIds>
>[number]

const strToNum = (str: string) => parseInt(str, 10)
