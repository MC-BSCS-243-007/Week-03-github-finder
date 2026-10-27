import { Icon } from './Icon'

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#main">
          <span className="brand-mark" aria-hidden="true">
            <Icon name="search" size={19} />
          </span>
          <span className="brand-text">
            <strong>
              handle<span>.</span>
            </strong>
            <span>GitHub profile finder</span>
          </span>
          <span className="sr-only"> — back to top</span>
        </a>

        <div className="header-links">
          <span className="week-tag mono">PHASE 2 / WEEK 03</span>
          <a
            className="docs-link"
            href="https://docs.github.com/en/rest/users/users"
            rel="noreferrer"
            target="_blank"
          >
            API docs
            <Icon name="arrowUpRight" size={13} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </header>
  )
}
