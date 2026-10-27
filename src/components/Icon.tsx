export type IconName =
  | 'search'
  | 'arrowUpRight'
  | 'arrowUp'
  | 'arrowDown'
  | 'star'
  | 'fork'
  | 'pin'
  | 'building'
  | 'link'
  | 'calendar'
  | 'book'
  | 'alert'
  | 'wifiOff'
  | 'refresh'
  | 'close'
  | 'code'

type IconProps = {
  name: IconName
  size?: number
  className?: string
}

export function Icon({ name, size = 18, className }: IconProps) {
  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
    className,
  }

  if (name === 'search') {
    return (
      <svg {...shared}>
        <circle cx="11" cy="11" r="7" />
        <path d="m16.5 16.5 4.5 4.5" />
      </svg>
    )
  }

  if (name === 'arrowUpRight') {
    return (
      <svg {...shared}>
        <path d="M7 17 17 7" />
        <path d="M8 7h9v9" />
      </svg>
    )
  }

  if (name === 'arrowUp') {
    return (
      <svg {...shared}>
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    )
  }

  if (name === 'arrowDown') {
    return (
      <svg {...shared}>
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    )
  }

  if (name === 'star') {
    return (
      <svg {...shared}>
        <path d="m12 3.5 2.7 5.7 6.3.9-4.6 4.4 1.1 6.2-5.5-3-5.5 3 1.1-6.2L3 9.1l6.3-.9z" />
      </svg>
    )
  }

  if (name === 'fork') {
    return (
      <svg {...shared}>
        <circle cx="6" cy="5" r="2" />
        <circle cx="18" cy="5" r="2" />
        <circle cx="12" cy="19" r="2" />
        <path d="M6 7v3a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V7" />
        <path d="M12 14v3" />
      </svg>
    )
  }

  if (name === 'pin') {
    return (
      <svg {...shared}>
        <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    )
  }

  if (name === 'building') {
    return (
      <svg {...shared}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3" />
      </svg>
    )
  }

  if (name === 'link') {
    return (
      <svg {...shared}>
        <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" />
      </svg>
    )
  }

  if (name === 'calendar') {
    return (
      <svg {...shared}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </svg>
    )
  }

  if (name === 'book') {
    return (
      <svg {...shared}>
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
        <path d="M8 2v20" />
      </svg>
    )
  }

  if (name === 'alert') {
    return (
      <svg {...shared}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5.5" />
        <path d="M12 16.8h.01" />
      </svg>
    )
  }

  if (name === 'wifiOff') {
    return (
      <svg {...shared}>
        <path d="m2 2 20 20" />
        <path d="M5 12.5a10 10 0 0 1 5-2.3" />
        <path d="M14.5 10.4A10 10 0 0 1 19 12.5" />
        <path d="M8.5 16a4 4 0 0 1 5.3-.4" />
        <path d="M12 20h.01" />
      </svg>
    )
  }

  if (name === 'refresh') {
    return (
      <svg {...shared}>
        <path d="M20.5 12a8.5 8.5 0 1 1-2.5-6" />
        <path d="M21 3v6h-6" />
      </svg>
    )
  }

  if (name === 'close') {
    return (
      <svg {...shared}>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </svg>
    )
  }

  return (
    <svg {...shared}>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
    </svg>
  )
}
