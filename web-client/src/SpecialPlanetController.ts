import { chains } from "./misc/chains"

export class SpecialPlanetController {
  static getPlanets = (
    account: string
  ): Promise<{
    confirmedGold: string
    goldConfirmedAt: string
    ids: Array<string>
    kinds: Array<string>
    paramRates: Array<string>
    times: Array<string>
    axialCoordinates: Array<string>
    artSeeds: Array<string>
  }> => {
    return chains.loom
      .specialPlanetController()
      .methods.getPlanets(account)
      .call()
  }

  static setPlanet = (
    tokenId: string,
    axialCoordinateQ: string,
    axialCoordinateR: string
  ): Promise<any> => {
    return chains.loom
      .specialPlanetController()
      .methods.setPlanet(tokenId, axialCoordinateQ, axialCoordinateR)
      .send()
  }

  static removePlanet = (shortId: string): Promise<any> => {
    return chains.loom
      .specialPlanetController()
      .methods.removePlanet(shortId)
      .send()
  }

  static getPlanetFieldsFromTokenIds = (
    tokenIds: string
  ): Promise<{
    shortIds: Array<string>
    versions: Array<string>
    kinds: Array<string>
    paramRates: Array<string>
    artSeeds: Array<string>
  }> => {
    return chains.loom
      .specialPlanetController()
      .methods.getPlanetFieldsFromTokenIds(tokenIds)
      .call()
  }
}
