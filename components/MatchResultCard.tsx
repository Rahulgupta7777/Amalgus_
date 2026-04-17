'use client'

import { MatchResult, GlassProduct } from '@/lib/types'
import { getProductById } from '@/lib/products'
import { formatINR } from '@/lib/formatCurrency'
import { NmCard } from './neumorphic/NmCard'
import { NmButton } from './neumorphic/NmButton'
import { ProductIllustration } from './ProductIllustration'
import { ScoreBadge } from './ScoreBadge'
import { MatchedChips } from './MatchedChips'
import { Calculator, Lightbulb } from 'lucide-react'
import Link from 'next/link'

interface Props {
  match: MatchResult
  index?: number
}

export function MatchResultCard({ match, index = 0 }: Props) {
  const product = getProductById(match.product_id) as GlassProduct | undefined

  if (!product || (product as any).category !== 'Glass') {
    return null
  }

  return (
    <div style={{ animation: `slideUp 0.4s ease-out ${index * 80}ms both` }}>
      <NmCard variant="raised" size="md">
        <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <ScoreBadge score={match.match_score} size={70} />
            <ProductIllustration glassType={product.glassType} size={56} />
          </div>

          <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>
                {product.name}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--nm-text-muted)' }}>
                {product.supplier} · {product.cert}
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--nm-text)' }}>
              {match.explanation}
            </p>

            <MatchedChips attributes={match.matched_attributes} />

            {match.why_this_glass && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                  backgroundColor: 'var(--nm-bg)',
                  boxShadow: 'var(--nm-pressed-sm)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                }}
              >
                <Lightbulb size={14} style={{ color: 'var(--nm-warning)', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--nm-text-muted)', lineHeight: 1.4 }}>
                  {match.why_this_glass}
                </span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                paddingTop: '4px',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--nm-accent)',
                  }}
                >
                  {formatINR(product.rateMin)}–{formatINR(product.rateMax)}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--nm-text-muted)', marginLeft: '4px' }}>
                  /sqft
                </span>
              </div>

              <Link href={`/estimate?product=${product.id}`} style={{ textDecoration: 'none' }}>
                <NmButton variant="accent" size="sm">
                  <Calculator size={14} />
                  Get Estimate
                </NmButton>
              </Link>
            </div>
          </div>
        </div>
      </NmCard>
    </div>
  )
}
