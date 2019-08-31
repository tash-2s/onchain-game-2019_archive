import { Eth } from "./eth"
import { Loom } from "./loom"

class Chain {
  constructor(readonly eth: Eth, readonly loom: Loom) {}

  login = async (provider: any, providerChangedFn: () => void) => {
    const isSuccess = await this.eth.login(provider, providerChangedFn)
    if (!isSuccess) {
      return false
    }

    return this.loom.login(this.eth.signer())
  }

  needsSpecialPlanetTokenResume = (existentTokenIds: Array<string>) => {
    const ethAddress = chain.eth.address
    if (!ethAddress) {
      throw new Error("not logined")
    }

    return this.loom.withGateway(chain.eth.signer(), async gateway => {
      const receipt = await chain.loom.getSpecialPlanetTokenWithdrawalReceipt(
        ethAddress,
        chain.eth.specialPlanetToken().options.address,
        gateway
      )

      if (!receipt) {
        return false
      }
      if (!receipt.tokenId) {
        return false
      }

      // Receipt removals can be delayed, so I need to check it if it's already withdrew.
      // If users transfer the token immediately after the resume, users may see wrong resume announcing...
      const tokenIdStr = receipt.tokenId.toString()
      let alreadyWithdrew = false
      existentTokenIds.forEach(id => {
        if (id === tokenIdStr) {
          alreadyWithdrew = true
        }
      })
      if (alreadyWithdrew) {
        return false
      }

      return true
    })
  }
}

export const chain = new Chain(new Eth(), new Loom())
