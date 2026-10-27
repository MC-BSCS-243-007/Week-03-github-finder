export function LoadingState({ query }: { query: string }) {
  return (
    <div className="loading-state">
      <div className="loading-head">
        <span aria-hidden="true" className="spinner spinner-large" />
        <div>
          <p className="mono-label">Query in flight</p>
          <p className="loading-title">
            Reading <span>@{query}</span> from GitHub
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="skeleton-profile">
        <div className="skeleton skeleton-avatar" />
        <div className="skeleton-lines">
          <div className="skeleton skeleton-line skeleton-line-sm" />
          <div className="skeleton skeleton-line skeleton-line-lg" />
          <div className="skeleton skeleton-line skeleton-line-md" />
          <div className="skeleton skeleton-line" />
        </div>
        <div className="skeleton skeleton-pill" />
      </div>

      <div aria-hidden="true" className="skeleton-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="skeleton-card" key={index}>
            <div className="skeleton skeleton-line skeleton-line-md" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line-sm" />
            <div className="skeleton-meta">
              <div className="skeleton skeleton-dot" />
              <div className="skeleton skeleton-line skeleton-line-xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
