'use client'

import { DailyRate } from '@/lib/types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
  rates: DailyRate[]
}

export function RateTicker({ rates }: Props) {
  const tickerItems = [...rates, ...rates]

  return (
    <div
      style={{
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-pressed-sm)',
        borderRadius: '14px',
        padding: '12px 0',
        overflow: 'hidden',
        position: 'relative',
      }}
      aria-label="Live market rates"
    >
      <div
        style={{
          display: 'flex',
          gap: '32px',
          animation: 'scroll 40s linear infinite',
          whiteSpace: 'nowrap',
          width: 'max-content',
        }}
      >
        {tickerItems.map((rate, i) => {
          const trend = rate.change > 0 ? 'up' : rate.change < 0 ? 'down' : 'flat'
          const icon =
            trend === 'up' ? (
              <TrendingUp size={12} />
            ) : trend === 'down' ? (
              <TrendingDown size={12} />
            ) : (
              <Minus size={12} />
            )
          const color =
            trend === 'up'
              ? 'var(--nm-success)'
              : trend === 'down'
              ? 'var(--nm-error)'
              : 'var(--nm-text-muted)'

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                padding: '0 8px',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--nm-text)' }}>{rate.glassType}</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--nm-accent)',
                }}
              >
                ₹{rate.today}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  color,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                }}
              >
                {icon}
                {rate.change > 0 ? '+' : ''}
                {rate.change}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
