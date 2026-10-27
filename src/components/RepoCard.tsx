import type { GithubRepo } from '../lib/github'
import {
  formatCompactNumber,
  formatExactDate,
  formatNumber,
  formatRelativeDate,
  languageColor,
} from '../lib/format'
import { Icon } from './Icon'

type RepoCardProps = {
  repo: GithubRepo
}

export function RepoCard({ repo }: RepoCardProps) {
  const updated = formatRelativeDate(repo.updated_at)
  const exactUpdated = formatExactDate(repo.updated_at)

  return (
    <article className="repo-card">
      <div className="repo-top">
        <span aria-hidden="true" className="repo-icon">
          <Icon name="book" size={16} />
        </span>
        <h3 className="repo-name">
          <a
            className="repo-link"
            href={repo.html_url}
            rel="noreferrer"
            target="_blank"
          >
            {repo.name}
            <Icon name="arrowUpRight" size={14} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </h3>
        <span className="repo-badges">
          {repo.archived ? <span className="repo-badge">Archived</span> : null}
          {repo.fork ? <span className="repo-badge">Fork</span> : null}
        </span>
      </div>

      {repo.description ? (
        <p className="repo-description">{repo.description}</p>
      ) : (
        <p className="repo-description repo-description-empty">
          No description provided.
        </p>
      )}

      <div className="repo-meta">
        {repo.language ? (
          <span className="repo-language">
            <i
              aria-hidden="true"
              style={{ backgroundColor: languageColor(repo.language) }}
            />
            {repo.language}
          </span>
        ) : null}
        <span title={`${formatNumber(repo.stargazers_count)} stars`}>
          <Icon name="star" size={14} />
          {formatCompactNumber(repo.stargazers_count)}
          <span className="sr-only"> stars</span>
        </span>
        {repo.forks_count > 0 ? (
          <span title={`${formatNumber(repo.forks_count)} forks`}>
            <Icon name="fork" size={14} />
            {formatCompactNumber(repo.forks_count)}
            <span className="sr-only"> forks</span>
          </span>
        ) : null}
        {updated ? (
          <span className="repo-updated" title={exactUpdated}>
            Updated {updated}
          </span>
        ) : null}
      </div>
    </article>
  )
}
