'use client'

import { GlassProduct, AlliedProduct, Product } from '@/lib/types'
import { formatINR } from '@/lib/formatCurrency'
import { NmCard } from './neumorphic/NmCard'
import { NmButton } from './neumorphic/NmButton'
import { ProductIllustration } from './ProductIllustration'
import { ChevronRight, Calculator, Check } from 'lucide-react'
import Link from 'next/link'

interface Props {
  product: Product
  onOpenDetails?: (p: Product) => void
}

function isGlass(p: Product): p is GlassProduct {
  return (p as GlassProduct).category === 'Glass'
}

export function ProductCard({ product, onOpenDetails }: Props) {
  if (isGlass(product)) {
    return <GlassProductCard product={product} onOpenDetails={onOpenDetails} />
  }
  return <AlliedProductCard product={product as AlliedProduct} />
}

function GlassProductCard({
  product,
  onOpenDetails,
}: {
  product: GlassProduct
  onOpenDetails?: (p: Product) => void
}) {
  return (
    <NmCard variant="raised" size="md" interactive style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <ProductIllustration glassType={product.glassType} size={60} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1.3,
              marginBottom: '4px',
              color: 'var(--nm-text)',
            }}
          >
            {product.name}
          </h3>
          <div
            style={{
              fontSize: '0.78rem',
              color: 'var(--nm-text-muted)',
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
            }}
          >
            <span>{product.supplier}</span>
            {product.inStock && (
              <>
                <span>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--nm-success)' }}>
                  <Check size={11} /> In stock
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          fontSize: '0.72rem',
        }}
      >
        <Spec label="Thickness" value={`${product.thickness}mm`} />
        <Spec label="Process" value={product.process} />
        <Spec label="Edge" value={product.edge} />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '6px',
          paddingTop: '4px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--nm-accent)',
          }}
        >
          {formatINR(product.rateMin)}–{formatINR(product.rateMax)}
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--nm-text-muted)' }}>/sqft</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        {onOpenDetails && (
          <NmButton
            variant="raised"
            size="sm"
            onClick={() => onOpenDetails(product)}
            style={{ flex: 1 }}
          >
            Details
            <ChevronRight size={14} />
          </NmButton>
        )}
        <Link href={`/estimate?product=${product.id}`} style={{ flex: 1, textDecoration: 'none' }}>
          <NmButton variant="accent" size="sm" style={{ width: '100%' }}>
            <Calculator size={14} />
            Estimate
          </NmButton>
        </Link>
      </div>
    </NmCard>
  )
}

function AlliedProductCard({ product }: { product: AlliedProduct }) {
  return (
    <NmCard variant="raised" size="md" interactive style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <ProductIllustration glassType={product.category} size={60} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1.3,
              marginBottom: '4px',
              color: 'var(--nm-text)',
            }}
          >
            {product.name}
          </h3>
          <div style={{ fontSize: '0.78rem', color: 'var(--nm-text-muted)' }}>
            {product.brand} · {product.category}
          </div>
        </div>
      </div>

      <p
        style={{
          fontSize: '0.82rem',
          color: 'var(--nm-text-muted)',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {product.description}
      </p>

      <div style={{ marginTop: 'auto' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--nm-accent)',
          }}
        >
          {formatINR(product.pricePerUnit)}
        </span>
      </div>
    </NmCard>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-pressed-sm)',
        borderRadius: '8px',
        padding: '6px 8px',
      }}
    >
      <div
        style={{
          fontSize: '0.65rem',
          color: 'var(--nm-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--nm-text)' }}>{value}</div>
    </div>
  )
}
