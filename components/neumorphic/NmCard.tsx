'use client'

import { CSSProperties, HTMLAttributes, ReactNode, useState } from 'react'

type Variant = 'raised' | 'pressed' | 'flat'
type Size = 'sm' | 'md' | 'lg'

interface NmCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  interactive?: boolean
}

const shadowMap: Record<Variant, Record<Size, string>> = {
  raised: {
    sm: 'var(--nm-raised-sm)',
    md: 'var(--nm-raised)',
    lg: 'var(--nm-raised-lg)',
  },
  pressed: {
    sm: 'var(--nm-pressed-sm)',
    md: 'var(--nm-pressed)',
    lg: 'var(--nm-pressed-lg)',
  },
  flat: { sm: 'none', md: 'none', lg: 'none' },
}

const paddingMap: Record<Size, string> = {
  sm: '12px',
  md: '20px',
  lg: '32px',
}

const radiusMap: Record<Size, string> = {
  sm: '12px',
  md: '18px',
  lg: '24px',
}

export function NmCard({
  variant = 'raised',
  size = 'md',
  interactive = false,
  children,
  className = '',
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: NmCardProps) {
  const [hovered, setHovered] = useState(false)

  const baseShadow = shadowMap[variant][size]
  const hoverShadow =
    interactive && variant === 'raised'
      ? size === 'lg'
        ? 'var(--nm-raised-lg)'
        : 'var(--nm-raised)'
      : baseShadow

  const baseStyle: CSSProperties = {
    backgroundColor: 'var(--nm-bg)',
    boxShadow: hovered ? hoverShadow : baseShadow,
    borderRadius: radiusMap[size],
    padding: paddingMap[size],
    transform: interactive && hovered ? 'translateY(-2px)' : 'translateY(0)',
    transition: 'box-shadow 260ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
    ...style,
  }

  return (
    <div
      className={className}
      style={baseStyle}
      data-nm-variant={variant}
      data-nm-interactive={interactive}
      onMouseEnter={(e) => {
        if (interactive) setHovered(true)
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        if (interactive) setHovered(false)
        onMouseLeave?.(e)
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
