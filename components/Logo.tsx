'use client'

import { CSSProperties } from 'react'

interface Props {
  size?: number
  showText?: boolean
  style?: CSSProperties
}

export function Logo({ size = 36, showText = true, style }: Props) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', ...style }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: 'var(--nm-bg)',
          boxShadow: 'var(--nm-raised-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: size * 0.12,
        }}
      >
        <LogoMark size={size * 0.76} />
      </div>
      {showText && (
        <span
          style={{
            fontFamily: 'var(--font-outfit), sans-serif',
            fontSize: '1.3rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--nm-text)',
            lineHeight: 1,
          }}
        >
          Amal<span style={{ color: 'var(--nm-accent)' }}>Gus</span>
        </span>
      )}
    </div>
  )
}

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-label="AmalGus logo"
      role="img"
    >
      <defs>
        <linearGradient id="logo-teal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D6577" />
          <stop offset="100%" stopColor="#1F4E5F" />
        </linearGradient>
        <linearGradient id="logo-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2B955" />
          <stop offset="100%" stopColor="#D99635" />
        </linearGradient>
      </defs>

      {/* Top peak of the A */}
      <path
        d="M 42 8 Q 50 0 58 8 L 60 38 Q 58 42 50 42 Q 42 42 40 38 Z"
        fill="url(#logo-teal)"
      />

      {/* Left leg of the A */}
      <path
        d="M 30 45 Q 26 40 32 36 L 44 36 Q 50 38 50 44 L 50 82 Q 48 94 36 94 Q 22 94 24 82 Z"
        fill="url(#logo-teal)"
      />

      {/* Right leg of the A */}
      <path
        d="M 70 45 Q 74 40 68 36 L 56 36 Q 50 38 50 44 L 50 82 Q 52 94 64 94 Q 78 94 76 82 Z"
        fill="url(#logo-teal)"
      />

      {/* Gold V / checkmark */}
      <path
        d="M 22 40 Q 18 44 22 50 L 44 64 Q 50 68 56 64 L 78 50 Q 82 44 78 40 Q 74 36 70 38 L 54 48 Q 50 52 46 48 L 30 38 Q 26 36 22 40 Z"
        fill="url(#logo-gold)"
      />

      {/* Highlight sheen */}
      <path
        d="M 26 42 Q 24 46 28 48 L 44 58 Q 48 60 46 56 L 32 44 Q 28 40 26 42 Z"
        fill="#FFFFFF"
        opacity="0.3"
      />
    </svg>
  )
}
