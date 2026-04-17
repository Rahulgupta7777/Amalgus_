'use client'

import { DailyRate } from '@/lib/types'
import { NmCard } from './neumorphic/NmCard'
import { Sparkline } from './Sparkline'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
  rate: DailyRate
}

export function RateCard({ rate }: Props) {
  const trend = rate.change > 0 ? 'up' : rate.change < 0 ? 'down' : 'flat'
  const icon =
    trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />
  const trendColor =
    trend === 'up' ? 'var(--nm-success)' : trend === 'down' ? 'var(--nm-error)' : 'var(--nm-text-muted)'

  const historyValues = rate.weekHistory.map((h) => h.rate)

  return (
    <NmCard variant="raised" size="md" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px', lineHeight: 1.3 }}>
            {rate.glassType}
          </h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--nm-text-muted)' }}>
            {rate.supplier}
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'var(--nm-bg)',
            boxShadow: 'var(--nm-pressed-sm)',
            borderRadius: '999px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: trendColor,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0,
          }}
        >
          {icon}
          {rate.change > 0 ? '+' : ''}
          {rate.change}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '1.9rem',
            fontWeight: 700,
            color: 'var(--nm-accent)',
            lineHeight: 1,
          }}
        >
          ₹{rate.today}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--nm-text-muted)' }}>{rate.unit}</span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.68rem',
              color: 'var(--nm-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '2px',
            }}
          >
            7-day range
          </div>
          <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            ₹{rate.min}–{rate.max}
          </div>
        </div>
        <Sparkline data={historyValues} trend={trend as 'up' | 'down' | 'flat'} />
      </div>
    </NmCard>
  )
}
