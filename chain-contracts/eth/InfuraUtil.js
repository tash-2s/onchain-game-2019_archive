const fs = require("fs")
const path = require("path")

class InfuraUtil {
  getApiKey() {
    const infuraKeyPath = path.join(__dirname, "infura_api_key")
    if (!fs.existsSync(infuraKeyPath)) {
      throw new Error("infura api key not found")
    }
    return fs.readFileSync(infuraKeyPath, "utf-8")
  }

  getApiEndpoint() {
    return `https://rinkeby.infura.io/v3/${this.getApiKey()}` // TODO: other networks
  }
}

module.exports = InfuraUtil
