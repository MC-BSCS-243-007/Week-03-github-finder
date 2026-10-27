import type { RefObject } from 'react'
import { exampleProfiles } from '../data/examples'
import type { SearchStatus } from '../hooks/useGithubSearch'
import { Icon } from './Icon'

type SearchFormProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onExample: (username: string) => void
  onClearRecent: () => void
  inputRef: RefObject<HTMLInputElement | null>
  loading: boolean
  error: string | null
  status: SearchStatus
  recent: string[]
}

const STATUS_LABELS: Record<SearchStatus, string> = {
  idle: 'Ready',
  loading: 'Fetching',
  success: 'Found',
  'not-found': '404',
  'rate-limit': 'Rate limit',
  network: 'Offline',
  error: 'Error',
}

export function SearchForm({
  value,
  onChange,
  onSubmit,
  onExample,
  onClearRecent,
  inputRef,
  loading,
  error,
  status,
  recent,
}: SearchFormProps) {
  const describedBy = error
    ? 'search-hint username-error'
    : 'search-hint'

  return (
    <section
      aria-labelledby="search-title"
      className="search-panel"
      id="search"
    >
      <div className="search-panel-top">
        <span className="mono-label">Profile lookup</span>
        <span
          aria-hidden="true"
          className={`panel-status panel-status-${status}`}
        >
          <i />
          {STATUS_LABELS[status]}
        </span>
      </div>

      <h2 id="search-title">Who are you looking for?</h2>
      <p className="search-hint" id="search-hint">
        Enter a GitHub username, or paste a profile URL.
      </p>

      <form
        aria-busy={loading}
        className="search-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <label className="sr-only" htmlFor="username">
          GitHub username
        </label>

        <div className={`search-field${error ? ' has-error' : ''}`}>
          <span aria-hidden="true" className="field-at">
            @
          </span>
          <input
            aria-describedby={describedBy}
            aria-invalid={Boolean(error)}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            id="username"
            maxLength={120}
            name="username"
            onChange={(event) => onChange(event.target.value)}
            placeholder="octocat"
            ref={inputRef}
            spellCheck={false}
            type="text"
            value={value}
          />
          <button className="btn btn-search" type="submit">
            {loading ? (
              <>
                <span aria-hidden="true" className="spinner" />
                Searching
              </>
            ) : (
              <>
                <Icon name="search" size={17} />
                Search
              </>
            )}
          </button>
        </div>

        {error ? (
          <p className="field-error" id="username-error" role="alert">
            <Icon name="alert" size={15} />
            {error}
          </p>
        ) : null}
      </form>

      <div className="search-examples">
        <span className="mono-label">Try one</span>
        <div className="chip-row">
          {exampleProfiles.map((example) => (
            <button
              className="chip"
              key={example.username}
              onClick={() => onExample(example.username)}
              title={example.note}
              type="button"
            >
              @{example.username}
            </button>
          ))}
        </div>
      </div>

      {recent.length > 0 ? (
        <div className="recent-row">
          <span className="mono-label">Recent</span>
          <div className="chip-row">
            {recent.map((username) => (
              <button
                className="chip chip-recent"
                key={username}
                onClick={() => onExample(username)}
                type="button"
              >
                @{username}
              </button>
            ))}
            <button
              className="recent-clear"
              onClick={onClearRecent}
              type="button"
            >
              <Icon name="close" size={13} />
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
