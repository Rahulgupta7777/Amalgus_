'use client'

import { AlliedProduct } from '@/lib/types'
import { formatINR } from '@/lib/formatCurrency'
import { NmCard } from './neumorphic/NmCard'
import { NmButton } from './neumorphic/NmButton'
import { ProductIllustration } from './ProductIllustration'
import { useEstimateCart } from '@/context/EstimateCartContext'
import { useToast } from './neumorphic/Toast'
import { Plus, Check } from 'lucide-react'

interface Props {
  products: AlliedProduct[]
  title?: string
}

export function AlliedSuggestions({ products, title = 'Compatible allied products' }: Props) {
  const { alliedItems, addAllied } = useEstimateCart()
  const { toast } = useToast()

  if (products.length === 0) return null

  const added = new Set(alliedItems.map((i) => i.productId))

  const handleAdd = (p: AlliedProduct) => {
    addAllied(p.id, 1)
    toast(`${p.name} added to estimate`, 'success')
  }

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
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '12px',
        }}
      >
        {products.map((p) => {
          const isAdded = added.has(p.id)
          return (
            <NmCard key={p.id} variant="raised" size="sm">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <ProductIllustration glassType={p.category} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--nm-text-muted)' }}>{p.brand}</div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--nm-accent)',
                      marginTop: '6px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {formatINR(p.pricePerUnit)}
                  </div>
                </div>
              </div>
              <NmButton
                variant={isAdded ? 'ghost' : 'accent'}
                size="sm"
                onClick={() => handleAdd(p)}
                style={{ width: '100%', marginTop: '10px' }}
              >
                {isAdded ? (
                  <>
                    <Check size={12} /> Added — add one more
                  </>
                ) : (
                  <>
                    <Plus size={12} /> Add to estimate
                  </>
                )}
              </NmButton>
            </NmCard>
          )
        })}
      </div>
    </div>
  )
}
