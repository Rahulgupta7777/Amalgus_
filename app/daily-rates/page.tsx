'use client'

import { RateCard } from '@/components/RateCard'
import { RateTicker } from '@/components/RateTicker'
import { NmCard } from '@/components/neumorphic/NmCard'
import dailyRatesData from '@/data/dailyRates.json'
import { DailyRate } from '@/lib/types'

export default function DailyRatesPage() {
  const rates = (dailyRatesData as any).rates as DailyRate[]
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section style={{ textAlign: 'center', paddingTop: '20px' }}>
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 700,
            marginBottom: '10px',
            letterSpacing: '-0.03em',
          }}
        >
          Today&apos;s glass rates
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--nm-text-muted)',
            marginBottom: '6px',
          }}
        >
          Updated daily based on factory pricing across India
        </p>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--nm-accent)',
            fontWeight: 600,
          }}
        >
          {dateStr}
        </p>
      </section>

      <RateTicker rates={rates} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        {rates.map((rate, i) => (
          <div
            key={rate.id}
            style={{
              animation: `slideUp 0.4s ease-out ${Math.min(i * 50, 400)}ms both`,
            }}
          >
            <RateCard rate={rate} />
          </div>
        ))}
      </div>

      <NmCard variant="raised" size="md" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.88rem', color: 'var(--nm-text-muted)', lineHeight: 1.6 }}>
          Rates are indicative and subject to change based on market conditions, location, and order
          quantity. Contact suppliers directly for real-time pricing and bulk discounts.
        </p>
      </NmCard>
    </div>
  )
}
