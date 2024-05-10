import { expect } from 'chai'
import { sync as globSync } from 'glob'
import { extname, resolve } from 'path'
import { openSync, readSync } from 'fs'
import { detector } from '../lib/detector'
import { imageSize as imageSizeOld } from 'image-size'
import { imageSize as imageSizeNew } from '../dist'

const bufferSize = 8192

// Test all valid files
describe('Performance', () => {
  const validFiles = globSync('specs/images/valid/**/*.*').filter(
    (file) => extname(file) !== '.md',
  )

  validFiles.forEach((file) =>
    describe('should be faster than image-size for ' + file, () => {
      let type: string | undefined
      const timings: {
        old: {
          buffer: number
          _async: number
        }
        new: {
          buffer: number
          _async: number
        },
        _diff: {
          buffer: string
          _async: string
        }
      } = {
        old: {
          buffer: 0,
          _async: 0,
        },
        new: {
          buffer: 0,
          _async: 0,
        },
        _diff: {
          buffer: "",
          _async: "",
        }
      }

      beforeEach((done) => {
        const buffer = new Uint8Array(bufferSize)
        const filepath = resolve(file)
        const descriptor = openSync(filepath, 'r')
        readSync(descriptor, buffer, 0, bufferSize, 0)
        type = detector(buffer)

        // tiff cannot support buffers, unless the buffer contains the entire file
        if (type !== 'tiff') {
          timings.old.buffer = performance.now()
          imageSizeOld(buffer)
          timings.old.buffer = performance.now() - timings.old.buffer

          timings.new.buffer = performance.now()
          imageSizeNew(buffer)
          timings.new.buffer = performance.now() - timings.new.buffer
        }

        timings.old._async = performance.now()
        imageSizeOld(file, () => {
          timings.old._async = performance.now() - timings.old._async

          timings.new._async = performance.now()
          imageSizeNew(file, (err) => {
            timings.new._async = performance.now() - timings.new._async
            done(err || undefined)
          })
        })

      })

      it(file + ' (buffer)', () => {
        timings._diff.buffer = (timings.old.buffer / timings.new.buffer).toFixed(3);
        console.log('buffer performance improvement: ' + file, timings._diff.buffer);
        expect(timings.new.buffer).to.lessThan(timings.old.buffer)
      })

      it(file + ' (async)', () => {
        timings._diff._async = (timings.old._async / timings.new._async).toFixed(3);
        console.log('async performance improvement: ' + file, timings._diff._async);
        expect(timings.new._async).to.lessThan(timings.old._async)
      })
    }),
  )
})
