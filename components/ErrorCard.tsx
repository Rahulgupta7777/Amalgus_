'use client'

import { AlertCircle } from 'lucide-react'
import { NmCard } from './neumorphic/NmCard'
import { NmButton } from './neumorphic/NmButton'

interface ErrorCardProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorCard({
  title = 'Something went wrong',
  message = 'Please try again in a moment',
  onRetry,
}: ErrorCardProps) {
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
          color: 'var(--nm-error)',
        }}
      >
        <AlertCircle size={24} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: 'var(--nm-text-muted)', marginBottom: onRetry ? '24px' : 0 }}>{message}</p>
      {onRetry && (
        <NmButton variant="raised" onClick={onRetry}>
          Try again
        </NmButton>
      )}
    </NmCard>
  )
}
