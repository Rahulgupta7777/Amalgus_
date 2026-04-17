'use client'

import { AlliedProduct } from '@/lib/types'
import { formatINR } from '@/lib/formatCurrency'
import { NmCard } from './neumorphic/NmCard'
import { ProductIllustration } from './ProductIllustration'

interface Props {
  products: AlliedProduct[]
  title?: string
}

export function AlliedSuggestions({ products, title = 'Compatible allied products' }: Props) {
  if (products.length === 0) return null

  return (
    <div>
      <h4
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '12px',
          color: 'var(--nm-text)',
        }}
      >
        {title}
      </h4>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '12px',
        }}
      >
        {products.map((p) => (
          <NmCard key={p.id} variant="raised" size="sm">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ProductIllustration glassType={p.category} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--nm-text-muted)' }}>{p.brand}</div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--nm-accent)',
                    marginTop: '4px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {formatINR(p.pricePerUnit)}
                </div>
              </div>
            </div>
          </NmCard>
        ))}
      </div>
    </div>
  )
}
