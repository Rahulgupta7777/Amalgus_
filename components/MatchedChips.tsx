'use client'

interface MatchedChipsProps {
  attributes: string[]
}

export function MatchedChips({ attributes }: MatchedChipsProps) {
  if (attributes.length === 0) return null

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {attributes.map((attr, i) => (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--nm-accent-dark)',
            backgroundColor: 'var(--nm-accent-light)',
            boxShadow: 'var(--nm-pressed-sm)',
            textTransform: 'capitalize',
            letterSpacing: '0.02em',
          }}
        >
          {attr.replace(/_/g, ' ')}
        </span>
      ))}
    </div>
  )
}
