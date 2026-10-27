import type { GithubRepo, GithubUser } from '../lib/github'
import { Icon } from './Icon'
import { ProfileCard } from './ProfileCard'
import { RepoList } from './RepoList'

type ResultsViewProps = {
  profile: GithubUser
  repos: GithubRepo[]
  hasMore: boolean
  loadingMore: boolean
  loadMoreError: string | null
  onLoadMore: () => void
  onSearchAgain: () => void
}

export function ResultsView({
  profile,
  repos,
  hasMore,
  loadingMore,
  loadMoreError,
  onLoadMore,
  onSearchAgain,
}: ResultsViewProps) {
  return (
    <div className="results-view">
      <div className="results-head">
        <div>
          <p className="mono-label">Profile found</p>
          <p className="results-handle">
            <span aria-hidden="true">@</span>
            {profile.login}
          </p>
        </div>
        <div className="results-actions">
          <span className="live-badge">
            <span aria-hidden="true" className="pulse-dot" />
            Live from GitHub
          </span>
          <button
            className="btn btn-quiet"
            onClick={onSearchAgain}
            type="button"
          >
            <Icon name="arrowUp" size={15} />
            New search
          </button>
        </div>
      </div>

      <ProfileCard key={profile.id} profile={profile} />

      <RepoList
        hasMore={hasMore}
        loadMoreError={loadMoreError}
        loadingMore={loadingMore}
        onLoadMore={onLoadMore}
        profile={profile}
        repos={repos}
      />
    </div>
  )
}
