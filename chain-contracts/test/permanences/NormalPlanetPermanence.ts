const NormalPlanetPermanence = artifacts.require("NormalPlanetPermanence")

contract("NormalPlanetPermanence", async accounts => {
  it("should exist", async () => {
    let instance = await NormalPlanetPermanence.deployed()
    assert.equal(!!instance, true)
  })
})
