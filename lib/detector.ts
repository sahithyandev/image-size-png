import type { imageType } from './types/index'
import { typeHandlers } from './types/index'

const keys = Object.keys(typeHandlers) as imageType[]

// This map helps avoid validating for every single image type
const firstBytes: { [byte: number]: imageType } = {
  0x89: 'png',
}

export function detector(input: Uint8Array): imageType | undefined {
  const byte = input[0]
  if (byte in firstBytes) {
    const type = firstBytes[byte]
    if (type && typeHandlers[type].validate(input)) {
      return type
    }
  }

  const finder = (key: imageType) => typeHandlers[key].validate(input)
  return keys.find(finder)
}
