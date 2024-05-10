import { PNG } from "./png"

export const typeHandlers = {
  png: PNG,
}

export type imageType = keyof typeof typeHandlers
