export const REPOS_PAGE_SIZE = 12

const API_ROOT = 'https://api.github.com'

export type GithubUser = {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  bio: string | null
  twitter_username?: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export type GithubRepo = {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  updated_at: string
  archived: boolean
  fork: boolean
}

export type GithubErrorKind = 'not-found' | 'rate-limit' | 'network' | 'http'

export class GithubApiError extends Error {
  readonly kind: GithubErrorKind
  readonly status: number | undefined
  readonly resetAt: number | undefined

  constructor(
    kind: GithubErrorKind,
    message: string,
    details?: { status?: number; resetAt?: number },
  ) {
    super(message)
    this.name = 'GithubApiError'
    this.kind = kind
    this.status = details?.status
    this.resetAt = details?.resetAt
  }
}

export type NormalizedUsername =
  | { ok: true; username: string }
  | { ok: false; reason: 'empty' | 'invalid' }

/**
 * Accepts a plain handle, an @handle, or a github.com profile URL.
 * GitHub handles are 1–39 characters: alphanumerics and single hyphens.
 */
export function normalizeUsername(raw: string): NormalizedUsername {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: false, reason: 'empty' }

  const urlMatch = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#\s]+)/i.exec(trimmed)
  let candidate = trimmed

  if (urlMatch) {
    candidate = urlMatch[1]
  } else if (/^https?:\/\//i.test(trimmed) || /github\.com/i.test(trimmed)) {
    return { ok: false, reason: 'invalid' }
  }

  candidate = candidate.replace(/^@+/, '').replace(/\/+$/, '')

  if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(candidate)) {
    return { ok: false, reason: 'invalid' }
  }

  return { ok: true, username: candidate }
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

async function request<T>(path: string, signal: AbortSignal): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_ROOT}${path}`, {
      signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new GithubApiError('network', 'GitHub could not be reached.')
  }

  const remaining = response.headers.get('x-ratelimit-remaining')
  const resetSeconds = Number(response.headers.get('x-ratelimit-reset'))
  const resetAt =
    Number.isFinite(resetSeconds) && resetSeconds > 0
      ? resetSeconds * 1000
      : undefined

  if (response.status === 404) {
    throw new GithubApiError('not-found', 'GitHub returned 404.', {
      status: 404,
    })
  }

  if (!response.ok) {
    let apiMessage = ''

    try {
      const payload: unknown = await response.clone().json()
      if (
        payload &&
        typeof payload === 'object' &&
        'message' in payload &&
        typeof payload.message === 'string'
      ) {
        apiMessage = payload.message
      }
    } catch {
      // A non-JSON error body should not hide the HTTP status.
    }

    const rateLimited =
      response.status === 429 ||
      remaining === '0' ||
      /rate limit/i.test(apiMessage)

    if (rateLimited) {
      throw new GithubApiError('rate-limit', 'The GitHub API rate limit was reached.', {
        status: response.status,
        resetAt,
      })
    }

    throw new GithubApiError(
      'http',
      `GitHub returned HTTP ${response.status}.`,
      { status: response.status },
    )
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new GithubApiError('http', 'GitHub returned an unexpected response.', {
      status: response.status,
    })
  }
}

export function fetchUser(username: string, signal: AbortSignal) {
  return request<GithubUser>(`/users/${encodeURIComponent(username)}`, signal)
}

export function fetchRepos(
  username: string,
  page: number,
  signal: AbortSignal,
) {
  const safePage = Math.max(1, Math.floor(page))
  const query = new URLSearchParams({
    sort: 'updated',
    direction: 'desc',
    per_page: String(REPOS_PAGE_SIZE),
    page: String(safePage),
  })

  return request<GithubRepo[]>(
    `/users/${encodeURIComponent(username)}/repos?${query.toString()}`,
    signal,
  )
}
// 