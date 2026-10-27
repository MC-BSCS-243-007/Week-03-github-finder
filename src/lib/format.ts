const fullNumber = new Intl.NumberFormat('en')
const compactNumber = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
const joinedDate = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
})
const exactDate = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 31_536_000_000],
  ['month', 2_592_000_000],
  ['week', 604_800_000],
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]

export function formatNumber(value: number) {
  return fullNumber.format(value)
}

export function formatCompactNumber(value: number) {
  return compactNumber.format(value)
}

export function formatRelativeDate(isoDate: string, now = Date.now()) {
  const timestamp = new Date(isoDate).getTime()
  if (!Number.isFinite(timestamp)) return ''

  const difference = Math.min(timestamp - now, 0)

  if (Math.abs(difference) < 60_000) return 'just now'

  for (const [unit, milliseconds] of RELATIVE_UNITS) {
    if (Math.abs(difference) >= milliseconds) {
      return relativeTime.format(Math.round(difference / milliseconds), unit)
    }
  }

  return 'just now'
}

export function formatJoinedDate(isoDate: string) {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? '' : joinedDate.format(date)
}

export function formatExactDate(isoDate: string) {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? '' : exactDate.format(date)
}

export function formatResetTime(timestamp: number) {
  const reset = new Date(timestamp)
  if (Number.isNaN(reset.getTime())) return ''

  const sameDay = reset.toDateString() === new Date().toDateString()
  return new Intl.DateTimeFormat('en', {
    ...(sameDay
      ? { hour: 'numeric', minute: '2-digit' }
      : { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
  }).format(reset)
}

/** Only allow http(s) URLs from API-provided blog fields. */
export function safeWebsite(value: string | null | undefined) {
  if (!value) return null

  const candidate = value.trim()
  if (!candidate) return null

  try {
    const url = new URL(
      /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`,
    )
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    return url
  } catch {
    return null
  }
}

export function displayWebsite(url: URL) {
  return `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`
}

const LANGUAGE_COLORS: Record<string, string> = {
  C: '#555555',
  'C#': '#178600',
  'C++': '#F34B7D',
  CSS: '#563D7C',
  Dart: '#00B4AB',
  Go: '#00ADD8',
  HTML: '#E34C26',
  Java: '#B07219',
  JavaScript: '#F1E05A',
  'Jupyter Notebook': '#DA5B0B',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  Python: '#3572A5',
  Ruby: '#701516',
  Rust: '#DEA584',
  SCSS: '#C6538C',
  Shell: '#89E051',
  Svelte: '#FF3E00',
  Swift: '#F05138',
  TypeScript: '#3178C6',
  Vue: '#41B883',
}

export function languageColor(language: string | null) {
  if (!language) return '#18B59A'
  return LANGUAGE_COLORS[language] ?? '#18B59A'
}
