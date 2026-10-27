import { Icon } from './Icon'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand-block">
          <a className="footer-brand" href="#main">
            handle<span>.</span>
            <span className="sr-only"> — back to top</span>
          </a>
          <p>
            GitHub profile finder · Week 03 build for Internlytic
            Technologies.
          </p>
        </div>

        <div className="footer-side">
          <a
            className="text-link"
            href="https://docs.github.com/en/rest"
            rel="noreferrer"
            target="_blank"
          >
            GitHub REST API
            <Icon name="arrowUpRight" size={14} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <p>Public data only. No account connection, no stored profile.</p>
          <p className="mono footer-year">PHASE 2 / 2026</p>
        </div>
      </div>
    </footer>
  )
}
