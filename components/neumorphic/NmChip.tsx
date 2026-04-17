'use client'

import { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

interface NmChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  children: ReactNode
  tone?: 'default' | 'accent' | 'success' | 'warning' | 'error'
}

export function NmChip({
  selected = false,
  children,
  tone = 'default',
  style,
  className = '',
  ...rest
}: NmChipProps) {
  const toneColor: Record<typeof tone, string> = {
    default: 'var(--nm-text)',
    accent: 'var(--nm-accent)',
    success: 'var(--nm-success)',
    warning: 'var(--nm-warning)',
    error: 'var(--nm-error)',
  }

  const baseStyle: CSSProperties = {
    backgroundColor: 'var(--nm-bg)',
    color: selected ? 'var(--nm-accent)' : toneColor[tone],
    boxShadow: selected ? 'var(--nm-pressed-sm)' : 'var(--nm-raised-sm)',
    borderRadius: '999px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: 600,
    fontFamily: 'var(--font-dm-sans), sans-serif',
    border: 'none',
    cursor: 'pointer',
    transition: 'box-shadow 120ms ease-out, color 120ms ease-out',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    ...style,
  }

  return (
    <button className={className} style={baseStyle} {...rest}>
      {children}
    </button>
  )
}
