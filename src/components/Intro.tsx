import { Icon } from './Icon'

const steps = [
  {
    number: '01',
    title: 'Read the person',
    body: 'Avatar, display name, bio, company, location and the numbers that describe public reach — all in one place.',
  },
  {
    number: '02',
    title: 'Scan the shelf',
    body: 'The public repositories updated most recently, with language, stars, forks and when each one last changed.',
  },
  {
    number: '03',
    title: 'Know the state',
    body: 'Loading, 404s, rate limits and offline failures are explained plainly. Old results never masquerade as new ones.',
  },
]

export function Intro() {
  return (
    <section aria-labelledby="guide-title" className="guide">
      <div className="guide-head">
        <div>
          <p className="mono-label">What you get</p>
          <h2 id="guide-title">
            A profile, minus the <em>tab-hopping.</em>
          </h2>
        </div>
        <p className="guide-lede">
          One search reads a public GitHub account the way a collaborator
          would: who they are, what they ship, and where the momentum is.
        </p>
      </div>

      <div className="guide-grid">
        <ol className="guide-steps">
          {steps.map((step) => (
            <li key={step.number}>
              <span className="step-number mono" aria-hidden="true">
                {step.number}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <aside aria-labelledby="api-title" className="api-card">
          <div className="api-card-top">
            <span aria-hidden="true" className="api-icon">
              <Icon name="code" size={17} />
            </span>
            <p className="mono-label" id="api-title">
              Public endpoints
            </p>
          </div>
          <code>GET /users/:username</code>
          <code>GET /users/:username/repos</code>
          <p>
            Read-only requests to GitHub’s REST API. No sign-in, no token, and
            no account data stored by this app.
          </p>
          <div className="rate-chip">
            <span className="rate-number">60</span>
            <span>
              requests per hour
              <br />
              unauthenticated
            </span>
          </div>
        </aside>
      </div>

      <p className="guide-footnote">
        <span aria-hidden="true" className="pulse-dot" />
        Results are fetched live from GitHub. The public API never exposes
        private repositories.
      </p>
    </section>
  )
}
