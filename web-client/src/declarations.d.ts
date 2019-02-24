declare module "*/_loom.js" {
  export class LoomWeb3 {
    static setup: () => void
    static resetWithNewAccount: () => string
    static accountAddress: string
    static isGuest: boolean
  }

  export const getLoomContracts: () => {
    Web: import("./chain/types/Web").Web
    Logic: import("./chain/types/Logic").Logic
  }
}
