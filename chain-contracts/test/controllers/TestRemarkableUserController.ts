contract("RemarkableUserController", async accounts => {
  const RemarkableUserController = artifacts.require("RemarkableUserController")

  let instance: PromiseGenericsType<ReturnType<typeof RemarkableUserController.deployed>>
  let ownerAccount: string
  let strangerAccount: string

  beforeEach(async () => {
    instance = await RemarkableUserController.deployed()
    ownerAccount = accounts[0]
    strangerAccount = accounts[1]
  })

  describe("#tackle()", async () => {
    it("should success", async () => {
      assert.isOk(await instance.tackle(strangerAccount))
    })
  })

  describe("#getUsers()", async () => {
    it("should return data", async () => {
      const result = await instance.getUsers()

      assert.include(result[0], strangerAccount)
      assert.notInclude(result[0], ownerAccount)
      assert.equal(result[1].length, 100)
    })
  })
})
