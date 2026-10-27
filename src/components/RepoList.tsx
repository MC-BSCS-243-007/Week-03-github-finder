import type { GithubRepo, GithubUser } from '../lib/github'
import { formatNumber } from '../lib/format'
import { Icon } from './Icon'
import { RepoCard } from './RepoCard'

type RepoListProps = {
  profile: GithubUser
  repos: GithubRepo[]
  hasMore: boolean
  loadingMore: boolean
  loadMoreError: string | null
  onLoadMore: () => void
}

export function RepoList({
  profile,
  repos,
  hasMore,
  loadingMore,
  loadMoreError,
  onLoadMore,
}: RepoListProps) {
  const total = profile.public_repos
  const repositoryTab = `${profile.html_url}?tab=repositories`

  return (
    <section aria-labelledby="repos-title" className="repo-section">
      <div className="repos-head">
        <div>
          <p className="mono-label">Repository shelf</p>
          <h3 id="repos-title">Public repositories</h3>
          <p className="repos-sub">
            Showing {formatNumber(repos.length)} of {formatNumber(total)}{' '}
            {total === 1 ? 'repository' : 'repositories'} · newest updates first
          </p>
        </div>
        <a
          className="text-link"
          href={repositoryTab}
          rel="noreferrer"
          target="_blank"
        >
          All on GitHub
          <Icon name="arrowUpRight" size={14} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>

      {repos.length > 0 ? (
        <ul className="repo-grid">
          {repos.map((repo) => (
            <li key={repo.id}>
              <RepoCard repo={repo} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="repos-empty">
          <span aria-hidden="true" className="repos-empty-icon">
            <Icon name="book" size={22} />
          </span>
          <div>
            <p className="repos-empty-title">No public repositories yet.</p>
            <p>
              This account has not published any public repositories. Visit
              the profile on GitHub for the latest activity.
            </p>
          </div>
        </div>
      )}

      {loadMoreError ? (
        <p className="load-more-error" role="alert">
          <Icon name="alert" size={15} />
          {loadMoreError}
        </p>
      ) : null}

      {hasMore ? (
        <div className="load-more-wrap">
          <button
            aria-busy={loadingMore}
            className="btn btn-load-more"
            disabled={loadingMore}
            onClick={onLoadMore}
            type="button"
          >
            {loadingMore ? (
              <>
                <span aria-hidden="true" className="spinner spinner-dark" />
                Loading repositories
              </>
            ) : (
              <>
                {loadMoreError ? 'Try again' : 'Load more repositories'}
                <Icon
                  name={loadMoreError ? 'refresh' : 'arrowDown'}
                  size={15}
                  className="load-more-icon"
                />
              </>
            )}
          </button>
          <p className="load-more-note">
            {loadMoreError
              ? 'The repositories already loaded are still available.'
              : `Loaded in pages of 12 to respect GitHub’s public rate limit.`}
          </p>
        </div>
      ) : null}
    </section>
  )
}
