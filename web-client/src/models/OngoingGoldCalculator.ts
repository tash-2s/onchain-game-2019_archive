import { UserNormalPlanet } from "./UserNormalPlanet"

export class OngoingGoldCalculator {
  static calculate = (
    gold: { confirmed: number; confirmedAt: number },
    userNormalPlanets: Array<UserNormalPlanet>
  ): number => {
    const goldPerSec = (ups => {
      let totalResidenceParam = 0
      let totalGoldveinParam = 0
      ups.forEach(up => {
        switch (up.planetKind()) {
          case "residence":
            totalResidenceParam += up.paramMemo
            break
          case "goldvein":
            totalGoldveinParam += up.paramMemo
            break
        }
      })
      return totalResidenceParam * totalGoldveinParam
    })(userNormalPlanets)

    const diffSec = Math.floor(Date.now() / 1000) - gold.confirmedAt

    return gold.confirmed + goldPerSec * diffSec
  }
}
