export function getSeed(length: number): number {
  if (length <= 0) {
    throw Error("Length must be > 0")
  }
  return Math.floor(Math.random() * length)
}

export function getQuestionSet(seed: number, totalLength: number, targetLength: number): Array<number> {
  if (seed < 0) {
    throw Error("Seed must be >= 0")
  }
  if (totalLength <= 0) {
    throw Error("TotalLength must be > 0")
  }
  let result: Array<number> = []
  let candidate = -1
  result[0] = seed % totalLength
  result[1] = seed + 1 % totalLength
  for (let i = 1; i < targetLength - 1; i++) {
    candidate = (result[i - 1] + result[i]) % totalLength
    while (result.includes(candidate)) {
      candidate++ % totalLength
    }
    result[i + 1] = candidate
  }
  return result
}

export async function api<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await (response.json() as Promise<T>);
}
