import { useCallback, useState } from 'react'

const STORAGE_KEY = 'handle.recent-searches'
const MAX_RECENT = 5

function readRecent(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? '[]',
    )
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((value): value is string => typeof value === 'string')
      .slice(0, MAX_RECENT)
  } catch {
    return []
  }
}

function writeRecent(values: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
  } catch {
    // Storage can be unavailable in private browsing; recents are optional.
  }
}

export function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>(readRecent)

  const remember = useCallback((username: string) => {
    setRecent((previous) => {
      const next = [
        username,
        ...previous.filter(
          (item) => item.toLowerCase() !== username.toLowerCase(),
        ),
      ].slice(0, MAX_RECENT)
      writeRecent(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setRecent([])
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage failures.
    }
  }, [])

  return { recent, remember, clear }
}
// 