import { expect } from 'chai'
import { sync as globSync } from 'glob'
import { extname, resolve } from 'path'
import { openSync, readSync } from 'fs'
import { imageSize } from '../lib'
import { detector } from '../lib/detector'
import type { ISizeCalculationResult } from '../lib/types/interface'

const bufferSize = 8192

const sizes: { [key: string]: ISizeCalculationResult } = {
  default: {
    width: 123,
    height: 456,
  },
  'specs/images/valid/png/sample_fried.png': {
    width: 128,
    height: 68,
  },
  'specs/images/valid/png/sample-big-1.png': {
    width: 1847,
    height: 595,
  },
  'specs/images/valid/png/sample-big-2.png': {
    width: 1505,
    height: 470,
  },
  'specs/images/valid/png/sample-big-3.png': {
    width: 1812,
    height: 585,
  },
}

// Test all valid files
describe('Valid images', () => {
  const validFiles = globSync('specs/images/valid/**/*.*').filter(
    (file) => extname(file) !== '.md',
  )

  validFiles.forEach((file) =>
    describe(file, () => {
      let type: string | undefined
      let bufferDimensions: ISizeCalculationResult
      let asyncDimensions: ISizeCalculationResult

      beforeEach((done) => {
        const buffer = new Uint8Array(bufferSize)
        const filepath = resolve(file)
        const descriptor = openSync(filepath, 'r')
        readSync(descriptor, buffer, 0, bufferSize, 0)
        type = detector(buffer)

        // tiff cannot support buffers, unless the buffer contains the entire file
        if (type !== 'tiff') {
          bufferDimensions = imageSize(buffer)
        }

        imageSize(file, (err, dim) => {
          if (err || !dim) {
            done(err)
          } else {
            asyncDimensions = dim
            done()
          }
        })
      })

      it('should return correct size for ' + file, () => {
        const expected = sizes[file as keyof typeof sizes] || sizes.default
        expect(asyncDimensions.width).to.equal(expected.width)
        expect(asyncDimensions.height).to.equal(expected.height)
        if (asyncDimensions.images) {
          asyncDimensions.images.forEach((item, index) => {
            if (expected.images) {
              const expectedItem = expected.images[index]
              expect(item.width).to.equal(expectedItem.width)
              expect(item.height).to.equal(expectedItem.height)
              if (expectedItem.type) {
                expect(item.type).to.equal(expectedItem.type)
              }
            }
          })
        }

        if (expected.orientation) {
          expect(asyncDimensions.orientation).to.equal(expected.orientation)
        }

        if (type !== 'tiff') {
          expect(bufferDimensions.width).to.equal(expected.width)
          expect(bufferDimensions.height).to.equal(expected.height)
          if (bufferDimensions.images) {
            bufferDimensions.images.forEach((item, index) => {
              if (expected.images) {
                const expectedItem = expected.images[index]
                expect(item.width).to.equal(expectedItem.width)
                expect(item.height).to.equal(expectedItem.height)
              }
            })
          }
        }
      })
    }),
  )
})
