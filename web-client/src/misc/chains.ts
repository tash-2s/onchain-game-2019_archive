import { Eth } from "./eth"
import { Loom } from "./loom"
import ChainEnv from "../chain/env.json"

class Chains {
  constructor(readonly eth: Eth, readonly loom: Loom) {}

  login = async (provider: any, providerChangedFn: () => void) => {
    const isSuccess = await this.eth.login(provider, providerChangedFn)
    if (!isSuccess) {
      return false
    }

    return this.loom.login(this.eth.signer())
  }

  getSpecialPlanetTokenTransferResumeReceipt = async () => {
    const ethAddress = this.eth.address
    if (!ethAddress) {
      throw new Error("not logined")
    }

    // this doens't work with local env
    if (this.loom.env.chainId === "default") {
      return null
    }

    return this.loom.withGateway(this.eth.signer(), async gateway => {
      const receipt = await this.loom.getSpecialPlanetTokenWithdrawalReceipt(
        ethAddress,
        ChainEnv.ethContractAddresses.SpecialPlanetToken,
        gateway
      )

      return receipt
    })
  }
}

export const chains = new Chains(new Eth(), new Loom())
