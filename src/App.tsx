import { useCallback, useEffect, useRef, useState } from 'react'
import { ErrorState } from './components/ErrorState'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Icon } from './components/Icon'
import { Intro } from './components/Intro'
import { LoadingState } from './components/LoadingState'
import { ResultsView } from './components/ResultsView'
import { SearchForm } from './components/SearchForm'
import { useGithubSearch } from './hooks/useGithubSearch'
import { useRecentSearches } from './hooks/useRecentSearches'
import { formatNumber } from './lib/format'

export default function App() {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLElement>(null)

  const {
    state,
    validationError,
    clearValidationError,
    search,
    loadMore,
    retry,
  } = useGithubSearch()
  const { recent, remember, clear } = useRecentSearches()
// 
  const runSearch = useCallback(
    (raw: string) => {
      setInput(raw.trim())
      void search(raw)
    },
    [search],
  )

  const focusSearch = useCallback(() => {
    inputRef.current?.focus({ preventScroll: true })
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    document.getElementById('search')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center',
    })
  }, [])

  useEffect(() => {
    if (validationError) inputRef.current?.focus()
  }, [validationError])

  useEffect(() => {
    const finished =
      state.status === 'success' ||
      state.status === 'not-found' ||
      state.status === 'rate-limit' ||
      state.status === 'network' ||
      state.status === 'error'

    if (finished) resultsRef.current?.focus()
  }, [state.status, state.query])

  useEffect(() => {
    if (state.status === 'success' && state.profile) {
      remember(state.profile.login)
    }
  }, [state.status, state.profile, remember])

  const liveMessage =
    state.status === 'loading'
      ? `Searching GitHub for ${state.query}.`
      : state.status === 'success' && state.profile
        ? `Profile found for ${state.profile.login}. ${formatNumber(state.profile.public_repos)} public repositories and ${formatNumber(state.profile.followers)} followers. Showing ${state.repos.length} repositories.`
        : ''

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        <section aria-labelledby="page-title" className="hero">
          <div aria-hidden="true" className="hero-decor">
            <span className="hero-ghost">@</span>
            <span className="hero-ring hero-ring-a" />
            <span className="hero-ring hero-ring-b" />
            <span className="hero-grid-lines" />
          </div>

          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span aria-hidden="true" className="pulse-dot" />
                <span>Internlytic · Week 03</span>
                <span aria-hidden="true" className="eyebrow-rule" />
                <span className="mono">Public data, live</span>
              </p>

              <h1 id="page-title">
                Find the work
                <br />
                behind the <em>handle.</em>
              </h1>

              <p className="hero-lede">
                A focused GitHub profile finder for collaborators, recruiters
                and the incurably curious. Search a public handle, then read
                the person and the repositories behind it.
              </p>

              <ul className="hero-points">
                <li>
                  <Icon name="search" size={15} />
                  Profile snapshot
                </li>
                <li>
                  <Icon name="book" size={15} />
                  Recent repositories
                </li>
                <li>
                  <Icon name="alert" size={15} />
                  Honest API states
                </li>
              </ul>
            </div>

            <SearchForm
              error={validationError}
              inputRef={inputRef}
              loading={state.status === 'loading'}
              onChange={(value) => {
                setInput(value)
                if (validationError) clearValidationError()
              }}
              onClearRecent={clear}
              onExample={runSearch}
              onSubmit={() => runSearch(input)}
              recent={recent}
              status={state.status}
              value={input}
            />
          </div>
        </section>

        <section
          aria-busy={state.status === 'loading'}
          aria-label="Search results"
          className="results"
          id="results"
          ref={resultsRef}
          tabIndex={-1}
        >
          <div className="container">
            <p
              aria-atomic="true"
              aria-live="polite"
              className="sr-only"
              role="status"
            >
              {liveMessage}
            </p>

            {state.status === 'idle' ? <Intro /> : null}

            {state.status === 'loading' ? (
              <LoadingState query={state.query} />
            ) : null}

            {state.status === 'success' && state.profile ? (
              <ResultsView
                hasMore={state.hasMore}
                loadMoreError={state.loadMoreError}
                loadingMore={state.loadingMore}
                onLoadMore={() => void loadMore()}
                onSearchAgain={focusSearch}
                profile={state.profile}
                repos={state.repos}
              />
            ) : null}

            {state.status !== 'idle' &&
            state.status !== 'loading' &&
            state.status !== 'success' &&
            state.error ? (
              <ErrorState
                error={state.error}
                onRetry={retry}
                onSearchAgain={focusSearch}
                query={state.query}
              />
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
