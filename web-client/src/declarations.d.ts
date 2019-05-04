declare module "*/_loom.js" {
  export class LoomWeb3 {
    static setup: () => void
    static resetWithNewAccount: () => string
    static accountAddress: string
    static isGuest: boolean
    static getLoomTime: () => number
  }

  export const getLoomContracts: () => {
    UserController: import("./chain/types/UserController").UserController
    NormalPlanetController: import("./chain/types/NormalPlanetController").NormalPlanetController
    RemarkableUserController: import("./chain/types/RemarkableUserController").RemarkableUserController
  }
}
