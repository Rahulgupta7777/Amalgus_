'use client'

import { Search } from 'lucide-react'
import { ReactNode } from 'react'
import { NmCard } from './neumorphic/NmCard'
import { NmButton } from './neumorphic/NmButton'

interface EmptyStateProps {
  title?: string
  message?: string
  icon?: ReactNode
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title = 'No results found',
  message = 'Try adjusting your filters or search terms',
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <NmCard variant="raised" size="lg" style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--nm-bg)',
          boxShadow: 'var(--nm-pressed-sm)',
          margin: '0 auto 20px',
          color: 'var(--nm-accent)',
        }}
      >
        {icon ?? <Search size={24} />}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: 'var(--nm-text-muted)', marginBottom: actionLabel ? '24px' : 0 }}>{message}</p>
      {actionLabel && onAction && (
        <NmButton variant="raised" onClick={onAction}>
          {actionLabel}
        </NmButton>
      )}
    </NmCard>
  )
}
