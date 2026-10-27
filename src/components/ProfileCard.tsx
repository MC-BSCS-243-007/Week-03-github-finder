import type { GithubUser } from '../lib/github'
import {
  displayWebsite,
  formatJoinedDate,
  formatNumber,
  safeWebsite,
} from '../lib/format'
import { Icon } from './Icon'

type ProfileCardProps = {
  profile: GithubUser
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const displayName = profile.name?.trim() || profile.login
  const website = safeWebsite(profile.blog)
  const joined = formatJoinedDate(profile.created_at)

  return (
    <article aria-labelledby="profile-name" className="profile-card">
      <div aria-hidden="true" className="profile-card-grid" />

      <div className="profile-main">
        <div className="avatar-frame">
          <img
            alt={`${displayName}’s GitHub avatar`}
            decoding="async"
            height="112"
            loading="lazy"
            src={profile.avatar_url}
            width="112"
          />
        </div>

        <div className="profile-identity">
          <p className="mono-label profile-kicker">Public profile</p>
          <h2 className="profile-name" id="profile-name">
            {displayName}
          </h2>
          <a
            className="profile-handle"
            href={profile.html_url}
            rel="noreferrer"
            target="_blank"
          >
            @{profile.login}
            <Icon name="arrowUpRight" size={14} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          {profile.bio ? <p className="profile-bio">{profile.bio}</p> : null}
        </div>

        <a
          className="btn btn-outline-light profile-open"
          href={profile.html_url}
          rel="noreferrer"
          target="_blank"
        >
          View on GitHub
          <Icon name="arrowUpRight" size={15} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>

      <dl className="profile-stats">
        <div>
          <dt>Public repositories</dt>
          <dd>{formatNumber(profile.public_repos)}</dd>
        </div>
        <div>
          <dt>Followers</dt>
          <dd>{formatNumber(profile.followers)}</dd>
        </div>
        <div>
          <dt>Following</dt>
          <dd>{formatNumber(profile.following)}</dd>
        </div>
      </dl>

      <div className="profile-meta">
        {profile.location ? (
          <span>
            <Icon name="pin" size={15} />
            {profile.location}
          </span>
        ) : null}
        {profile.company ? (
          <span>
            <Icon name="building" size={15} />
            {profile.company}
          </span>
        ) : null}
        {website ? (
          <a href={website.href} rel="noreferrer" target="_blank">
            <Icon name="link" size={15} />
            {displayWebsite(website)}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
        {joined ? (
          <span>
            <Icon name="calendar" size={15} />
            Joined {joined}
          </span>
        ) : null}
      </div>
    </article>
  )
}
