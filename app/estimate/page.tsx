'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { EstimateForm } from '@/components/EstimateForm'
import { EstimateResult } from '@/components/EstimateResult'
import { Estimate } from '@/lib/types'

function EstimateContent() {
  const searchParams = useSearchParams()
  const preSelectedProductId = searchParams.get('product')
  const [estimate, setEstimate] = useState<Estimate | null>(null)

  if (estimate) {
    return <EstimateResult estimate={estimate} onReset={() => setEstimate(null)} />
  }
  return (
    <EstimateForm
      preSelectedProductId={preSelectedProductId || undefined}
      onEstimate={setEstimate}
    />
  )
}

export default function EstimatePage() {
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
          Instant glass estimate
        </h1>
        <p
          style={{
            fontSize: '1.02rem',
            color: 'var(--nm-text-muted)',
            maxWidth: '640px',
            margin: '0 auto',
          }}
        >
          Get a quick price estimate for your glass requirement. Prices based on today&apos;s
          market rates from leading Indian suppliers.
        </p>
      </section>

      <Suspense
        fallback={
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--nm-text-muted)' }}>
            Loading estimate form…
          </div>
        }
      >
        <EstimateContent />
      </Suspense>
    </div>
  )
}
