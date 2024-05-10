import { expect } from "chai"
import { imageSize, types, disableFS } from "../lib"

// If something other than a buffer or filepath is passed
describe("Invalid invocation", () => {
  describe("when FS reads are disabled", () => {
    before(() => disableFS(true))
    after(() => disableFS(false))

    it("should only allow Uint8Array inputs", () => {
      expect(() => imageSize("specs/images/valid/png/sample.png")).to.throw(
        TypeError,
        "invalid invocation. input should be a Uint8Array",
      )
    })
  })
})

describe("Callback ", () => {
  it("should be called only once", (done) => {
    const tmpError = new Error()

    const origException = process.listeners("uncaughtException").pop()
    if (origException) {
      process.removeListener("uncaughtException", origException)
    }

    process.once("uncaughtException", (err) => {
      expect(err).to.equal(tmpError)
    })

    process.nextTick(() => done())
  })
})

describe(".types property", () => {
  it("should expose supported file types", () => {
    expect(types).to.eql(["png"])
  })
})
