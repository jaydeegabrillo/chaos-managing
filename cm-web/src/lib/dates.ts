const DAY_MS = 86_400_000

/** Parses a `YYYY-MM-DD` string as a local calendar date (avoids UTC off-by-one). */
export function parseDateOnly(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS)
}

const shortDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
const shortDateWithYear = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

export function formatDate(value: string, today: Date = startOfToday()): string {
  const date = parseDateOnly(value)
  return (date.getFullYear() === today.getFullYear() ? shortDate : shortDateWithYear).format(date)
}
