declare module "*/_loom.js" {
  export class LoomWeb3 {
    static setup: () => void
    static resetWithNewAccount: () => string
    static accountAddress: string
    static isGuest: boolean
  }

  export const getLoomContracts: () => {
    testNFT: import("./contracts/TestNFT").TestNFT
  }
}
