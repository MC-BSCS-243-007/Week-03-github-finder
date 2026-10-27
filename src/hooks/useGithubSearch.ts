import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchRepos,
  fetchUser,
  GithubApiError,
  isAbortError,
  normalizeUsername,
  REPOS_PAGE_SIZE,
  type GithubRepo,
  type GithubUser,
} from '../lib/github'
import { formatResetTime } from '../lib/format'

export type SearchStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'not-found'
  | 'rate-limit'
  | 'network'
  | 'error'

export type SearchError = {
  kind: 'not-found' | 'rate-limit' | 'network' | 'http'
  title: string
  message: string
  status?: number
  resetAt?: number
}

export type SearchState = {
  status: SearchStatus
  query: string
  profile: GithubUser | null
  repos: GithubRepo[]
  hasMore: boolean
  loadingMore: boolean
  loadMoreError: string | null
  error: SearchError | null
}

const initialState: SearchState = {
  status: 'idle',
  query: '',
  profile: null,
  repos: [],
  hasMore: false,
  loadingMore: false,
  loadMoreError: null,
  error: null,
}

function describeError(error: unknown, query: string) {
  if (error instanceof GithubApiError) {
    if (error.kind === 'not-found') {
      return {
        status: 'not-found' as const,
        error: {
          kind: 'not-found' as const,
          title: `No account named @${query}`,
          message:
            'GitHub returned a 404. Check the spelling, or try another public GitHub handle.',
        },
      }
    }

    if (error.kind === 'rate-limit') {
      const reset = error.resetAt ? formatResetTime(error.resetAt) : ''
      return {
        status: 'rate-limit' as const,
        error: {
          kind: 'rate-limit' as const,
          title: 'GitHub’s rate limit is in the way',
          message: reset
            ? `The public API allows 60 requests per hour per IP address. The limit resets at ${reset}.`
            : 'The public API allows 60 requests per hour per IP address. Try again shortly.',
          resetAt: error.resetAt,
        },
      }
    }

    if (error.kind === 'network') {
      return {
        status: 'network' as const,
        error: {
          kind: 'network' as const,
          title: 'We couldn’t reach GitHub',
          message:
            'Check your internet connection, then retry the search. Nothing was cached or loaded.',
        },
      }
    }

    return {
      status: 'error' as const,
      error: {
        kind: 'http' as const,
        title: 'GitHub couldn’t complete that request',
        message: error.status
          ? `The API responded with HTTP ${error.status}. Please try again in a moment.`
          : 'The API returned an unexpected response. Please try again.',
        status: error.status,
      },
    }
  }

  return {
    status: 'error' as const,
    error: {
      kind: 'http' as const,
      title: 'Something interrupted the search',
      message: 'An unexpected error occurred. Please try again.',
    },
  }
}

export function useGithubSearch() {
  const [state, setState] = useState<SearchState>(initialState)
  const [validationError, setValidationError] = useState<string | null>(null)
  const stateRef = useRef(state)
  const controllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    return () => controllerRef.current?.abort()
  }, [])

  const clearValidationError = useCallback(() => {
    setValidationError(null)
  }, [])

  const search = useCallback(
    async (raw: string) => {
      const normalized = normalizeUsername(raw)
      clearValidationError()

      if (!normalized.ok) {
        setValidationError(
          normalized.reason === 'empty'
            ? 'Enter a GitHub username to search.'
            : 'That doesn’t look like a GitHub username. Use letters, numbers and single hyphens, or paste a profile URL.',
        )
        return
      }

      const username = normalized.username

      controllerRef.current?.abort()
      const controller = new AbortController()
      controllerRef.current = controller
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId

      setState({
        status: 'loading',
        query: username,
        profile: null,
        repos: [],
        hasMore: false,
        loadingMore: false,
        loadMoreError: null,
        error: null,
      })

      try {
        const [profile, repos] = await Promise.all([
          fetchUser(username, controller.signal),
          fetchRepos(username, 1, controller.signal),
        ])

        if (requestId !== requestIdRef.current) return

        setState({
          status: 'success',
          query: profile.login,
          profile,
          repos,
          hasMore:
            repos.length === REPOS_PAGE_SIZE &&
            repos.length < profile.public_repos,
          loadingMore: false,
          loadMoreError: null,
          error: null,
        })
      } catch (error) {
        if (requestId !== requestIdRef.current || isAbortError(error)) return

        const described = describeError(error, username)
        setState({
          status: described.status,
          query: username,
          profile: null,
          repos: [],
          hasMore: false,
          loadingMore: false,
          loadMoreError: null,
          error: described.error,
        })
      }
    },
    [clearValidationError],
  )

  const loadMore = useCallback(async () => {
    const current = stateRef.current

    if (
      current.status !== 'success' ||
      !current.profile ||
      !current.hasMore ||
      current.loadingMore
    ) {
      return
    }

    const requestId = requestIdRef.current
    const nextPage = Math.floor(current.repos.length / REPOS_PAGE_SIZE) + 1
    const controller = new AbortController()
    controllerRef.current = controller

    setState((previous) =>
      previous.status === 'success'
        ? { ...previous, loadingMore: true, loadMoreError: null }
        : previous,
    )

    try {
      const repos = await fetchRepos(
        current.profile.login,
        nextPage,
        controller.signal,
      )

      if (requestId !== requestIdRef.current) return

      setState((previous) => {
        if (previous.status !== 'success' || !previous.profile) return previous

        const seen = new Set(previous.repos.map((repo) => repo.id))
        const merged = [
          ...previous.repos,
          ...repos.filter((repo) => !seen.has(repo.id)),
        ]

        return {
          ...previous,
          repos: merged,
          hasMore:
            repos.length === REPOS_PAGE_SIZE &&
            merged.length < previous.profile.public_repos,
          loadingMore: false,
        }
      })
    } catch (error) {
      if (requestId !== requestIdRef.current || isAbortError(error)) return

      const message =
        error instanceof GithubApiError && error.kind === 'rate-limit'
          ? 'GitHub’s rate limit was reached while loading more repositories. Try again later.'
          : error instanceof GithubApiError && error.kind === 'network'
            ? 'GitHub couldn’t be reached. Check your connection and try again.'
            : 'Those repositories couldn’t be loaded. Please try again.'

      setState((previous) =>
        previous.status === 'success'
          ? { ...previous, loadingMore: false, loadMoreError: message }
          : previous,
      )
    }
  }, [])

  const retry = useCallback(() => {
    const query = stateRef.current.query
    if (query) void search(query)
  }, [search])

  return {
    state,
    validationError,
    clearValidationError,
    search,
    loadMore,
    retry,
  }
}
