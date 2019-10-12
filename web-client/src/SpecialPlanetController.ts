import { chains } from "./misc/chains"

export class SpecialPlanetController {
  static getPlanets = (account: string) => {
    return chains.loom
      .specialPlanetController()
      .methods.getPlanets(account)
      .call()
  }

  static setPlanet = (tokenId: string, axialCoordinateQ: string, axialCoordinateR: string) => {
    return chains.loom
      .specialPlanetController()
      .methods.setPlanet(tokenId, axialCoordinateQ, axialCoordinateR)
      .send()
  }

  static removePlanet = (shortId: string) => {
    return chains.loom
      .specialPlanetController()
      .methods.removePlanet(shortId)
      .send()
  }

  static getPlanetFieldsFromTokenIds = (tokenIds: string) => {
    return chains.loom
      .specialPlanetController()
      .methods.getPlanetFieldsFromTokenIds(tokenIds)
      .call()
  }
}
