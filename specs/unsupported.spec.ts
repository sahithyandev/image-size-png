import { expect } from "chai"
import { sync as globSync } from "glob"
import { imageSize } from "../lib"

// Test all invalid files
describe("Unsupported images", () => {
  const unsupportedFiles = globSync("specs/images/unsupported/**/*.*")

  unsupportedFiles.forEach((file) => {
    describe(file, () => {
      it("should throw when called synchronously", () => {
        expect(() => imageSize(file)).to.throw(TypeError, "unsupported")
      })

      it("should callback with error when called asynchronously", (done) => {
        imageSize(file, (e) => {
          expect(e).to.be.instanceOf(TypeError)
          expect(e?.message).to.match(/^unsupported .+$/)
          done()
        })
      })
    })
  })
})
