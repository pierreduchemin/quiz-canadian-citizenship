export function getSeed(length: number): number {
  if (length <= 0) {
    throw Error("Length must be > 0")
  }
  return Math.floor(Math.random() * length)
}

export function getQuestionSet(seed: number, length: number): Array<number> {
  if (seed < 0) {
    throw Error("Seed must be >= 0")
  }
  if (length <= 0) {
    throw Error("Length must be > 0")
  }
  let result: Array<number> = []
  let candidate = -1
  result[0] = seed % length
  result[1] = seed + 1 % length
  for (let i = 1; i < length - 1; i++) {
    candidate = (result[i - 1] + result[i]) % length
    while (result.includes(candidate)) {
      candidate++ % length
    }
    result[i + 1] = candidate
  }
  return result
}
