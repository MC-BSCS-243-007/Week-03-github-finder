import type { SearchError } from '../hooks/useGithubSearch'
import { Icon, type IconName } from './Icon'

type ErrorStateProps = {
  error: SearchError
  query: string
  onRetry: () => void
  onSearchAgain: () => void
}

function visualFor(error: SearchError): {
  code: string
  icon: IconName
  eyebrow: string
} {
  if (error.kind === 'not-found') {
    return { code: '404', icon: 'search', eyebrow: 'No match' }
  }
  if (error.kind === 'rate-limit') {
    return { code: '429', icon: 'alert', eyebrow: 'Rate limited' }
  }
  if (error.kind === 'network') {
    return { code: 'OFFLINE', icon: 'wifiOff', eyebrow: 'Connection lost' }
  }
  return {
    code: error.status ? `HTTP ${error.status}` : 'ERROR',
    icon: 'alert',
    eyebrow: 'Request failed',
  }
}

export function ErrorState({
  error,
  query,
  onRetry,
  onSearchAgain,
}: ErrorStateProps) {
  const visual = visualFor(error)
  const canRetry = error.kind === 'network' || error.kind === 'http'

  return (
    <div aria-labelledby="state-title" className="state-card" role="alert">
      <div className="state-visual" aria-hidden="true">
        <span className={`state-icon state-icon-${error.kind}`}>
          <Icon name={visual.icon} size={27} />
        </span>
        <span className="state-code mono">{visual.code}</span>
      </div>

      <div className="state-copy">
        <p className="mono-label">{visual.eyebrow}</p>
        <h2 id="state-title">{error.title}</h2>
        <p className="state-message">{error.message}</p>

        {error.kind === 'rate-limit' ? (
          <p className="state-note">
            Rate limits are shared by everyone on this IP address. Waiting is
            the only reliable fix — no token is ever placed in the browser.
          </p>
        ) : null}

        {error.kind === 'not-found' ? (
          <p className="state-note">
            Handles are case-insensitive, but they cannot contain spaces. Try
            checking the profile URL, or search for “{query}” on GitHub.
          </p>
        ) : null}

        <div className="state-actions">
          {canRetry ? (
            <button className="btn btn-primary" onClick={onRetry} type="button">
              <Icon name="refresh" size={16} />
              Try again
            </button>
          ) : null}

          <button
            className="btn btn-secondary"
            onClick={onSearchAgain}
            type="button"
          >
            {error.kind === 'not-found' ? 'Try another handle' : 'Back to search'}
          </button>

          {error.kind === 'rate-limit' ? (
            <a
              className="text-link"
              href="https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api"
              rel="noreferrer"
              target="_blank"
            >
              About GitHub rate limits
              <Icon name="arrowUpRight" size={14} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}

          {error.kind === 'not-found' ? (
            <a
              className="text-link"
              href={`https://github.com/search?q=${encodeURIComponent(query)}&type=users`}
              rel="noreferrer"
              target="_blank"
            >
              Search GitHub users
              <Icon name="arrowUpRight" size={14} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
