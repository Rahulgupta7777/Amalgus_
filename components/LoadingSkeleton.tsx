'use client'

interface LoadingSkeletonProps {
  count?: number
  message?: string
}

export function LoadingSkeleton({ count = 3, message }: LoadingSkeletonProps) {
  return (
    <div>
      {message && (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--nm-text-muted)',
            marginBottom: '20px',
            fontSize: '0.95rem',
          }}
        >
          {message}
        </p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div
      style={{
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-raised-sm)',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      <SkeletonBlock height="104px" style={{ marginBottom: '16px' }} />
      <SkeletonBlock height="20px" width="60%" style={{ marginBottom: '10px' }} />
      <SkeletonBlock height="16px" width="40%" style={{ marginBottom: '16px' }} />
      <SkeletonBlock height="14px" width="90%" style={{ marginBottom: '6px' }} />
      <SkeletonBlock height="14px" width="80%" />
    </div>
  )
}

export function SkeletonBlock({
  height = '16px',
  width = '100%',
  style,
}: {
  height?: string
  width?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className="animate-shimmer"
      style={{
        height,
        width,
        borderRadius: '8px',
        boxShadow: 'var(--nm-pressed-sm)',
        ...style,
      }}
    />
  )
}
