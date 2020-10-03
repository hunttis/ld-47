const PI2 = Math.PI * 2

export type Interval = [number, number]

function mergeIntervals(intervals: Interval[]) {
  if (intervals.length === 0) return []

  let top = intervals[0]
  const result: Interval[] = [top]
  const n = intervals.length

  for (let i = 1; i < n; i++) {
    const curr = intervals[i]

    if (top[1] >= curr[0]) {
      result.pop()
      const temp: Interval = curr[1] >= top[1] ?
        [top[0], curr[1]] :
        [top[0], top[1]];

      result.push(temp)
      top = temp
    }

    if (top[1] < curr[0]) {
      result.push(curr)
      top = curr
    }
  }

  return result
}

const tuple = (a: number, b: number): Interval => [a, b]

const toPositiveRad = (rad: number) =>
  (rad >= 0) ? rad : rad + PI2

export function overlappingIntervals(angles: readonly Interval[]): Interval[] {
  const intervals = angles
    .map(([entryAngle, exitAngle]) => {
      const a = toPositiveRad(entryAngle % PI2)
      const b = toPositiveRad(exitAngle % PI2)
      const swap = a > b
      return tuple(swap ? b : a, swap ? a : b)
    })
    .sort(([a], [b]) => a - b)

  return mergeIntervals(intervals)
}
