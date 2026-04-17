'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { NmButton } from './NmButton'

interface NmModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxWidth?: string
}

export function NmModal({ open, onClose, title, children, maxWidth = '720px' }: NmModalProps) {
  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'nm-modal-title' : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(45, 55, 72, 0.4)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--nm-bg)',
          boxShadow: 'var(--nm-raised-lg)',
          borderRadius: '24px',
          padding: '32px',
          maxWidth,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        {title && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h2 id="nm-modal-title" style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
              {title}
            </h2>
            <NmButton variant="raised" size="sm" onClick={onClose} aria-label="Close">
              <X size={16} />
            </NmButton>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
