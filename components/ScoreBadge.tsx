'use client'

interface ScoreBadgeProps {
  score: number
  size?: number
}

export function ScoreBadge({ score, size = 64 }: ScoreBadgeProps) {
  const clamped = Math.max(0, Math.min(100, score))
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  const color =
    clamped >= 90
      ? 'var(--nm-success)'
      : clamped >= 75
      ? 'var(--nm-accent)'
      : clamped >= 60
      ? 'var(--nm-warning)'
      : 'var(--nm-text-muted)'

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-raised-sm)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
        />
      </svg>
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: size * 0.3,
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {clamped}
      </div>
    </div>
  )
}
