import type { imageType } from './types/index'
import { typeHandlers } from './types/index'

// This map helps avoid validating for every single image type
const firstBytes: { [byte: number]: imageType } = {
  0x89: 'png',
}

export function detector(input: Uint8Array): imageType | undefined {
  const byte = input[0]
  if (!(byte in firstBytes)) {
    return undefined
  }

  if (typeHandlers.png.validate(input)) {
    return 'png'
  }
  return undefined
}
