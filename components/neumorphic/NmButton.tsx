'use client'

import { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

type Variant = 'raised' | 'ghost' | 'accent'
type Size = 'sm' | 'md' | 'lg'

interface NmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  children?: ReactNode
}

const sizeMap: Record<Size, { padding: string; fontSize: string; radius: string }> = {
  sm: { padding: '8px 14px', fontSize: '0.85rem', radius: '10px' },
  md: { padding: '12px 22px', fontSize: '0.95rem', radius: '14px' },
  lg: { padding: '16px 28px', fontSize: '1rem', radius: '16px' },
}

export function NmButton({
  variant = 'raised',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  style,
  disabled,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onClick,
  ...rest
}: NmButtonProps) {
  const { padding, fontSize, radius } = sizeMap[size]
  const isDisabled = disabled || loading

  const baseShadow =
    variant === 'ghost' ? 'none' : 'var(--nm-raised-sm)'

  const baseStyle: CSSProperties = {
    backgroundColor: 'var(--nm-bg)',
    color: variant === 'accent' ? 'var(--nm-accent)' : 'var(--nm-text)',
    boxShadow: baseShadow,
    borderRadius: radius,
    padding,
    fontSize,
    fontWeight: 600,
    fontFamily: 'var(--font-outfit), sans-serif',
    letterSpacing: '-0.01em',
    transition: 'box-shadow 120ms ease-out, transform 120ms ease-out, color 120ms ease-out',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    border: 'none',
    ...style,
  }

  return (
    <button
      className={className}
      style={baseStyle}
      disabled={isDisabled}
      onMouseDown={(e) => {
        if (!isDisabled && variant !== 'ghost') {
          e.currentTarget.style.boxShadow = 'var(--nm-pressed-sm)'
        }
        onMouseDown?.(e)
      }}
      onMouseUp={(e) => {
        if (!isDisabled && variant !== 'ghost') {
          e.currentTarget.style.boxShadow = 'var(--nm-raised-sm)'
        }
        onMouseUp?.(e)
      }}
      onMouseLeave={(e) => {
        if (!isDisabled && variant !== 'ghost') {
          e.currentTarget.style.boxShadow = 'var(--nm-raised-sm)'
        }
        onMouseLeave?.(e)
      }}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }}
          aria-label="Loading"
        />
      ) : icon}
      {children}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  )
}
