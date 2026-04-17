'use client'

import { NmChip } from './neumorphic/NmChip'

interface ExampleChipsProps {
  onSelect: (example: string) => void
}

const EXAMPLES = [
  'Glass for bathroom shower enclosure',
  'Energy efficient windows for my home',
  'Soundproof glass for hospital',
  'Decorative kitchen backsplash glass',
  'Safety glass for balcony railing',
  'Reflective glass for office facade',
]

export function ExampleChips({ onSelect }: ExampleChipsProps) {
  return (
    <div>
      <div
        style={{
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--nm-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '10px',
        }}
      >
        Try an example
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {EXAMPLES.map((ex) => (
          <NmChip key={ex} onClick={() => onSelect(ex)}>
            {ex}
          </NmChip>
        ))}
      </div>
    </div>
  )
}
