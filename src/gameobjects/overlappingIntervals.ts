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

export function normalizedAngles(angles: Interval[]) {
  return angles
    .map(([entryAngle, exitAngle]) => {
      const a = Phaser.Math.Angle.Normalize(entryAngle)
      const b = Phaser.Math.Angle.Normalize(exitAngle)
      const swap = a > b
      return tuple(swap ? b : a, swap ? a : b)
    })
    .sort(([a], [b]) => a - b)
}

export function overlappingIntervals(angles: Interval[]): Interval[] {
  const intervals = normalizedAngles(angles)
  return mergeIntervals(intervals)
}
