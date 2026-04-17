'use client'

import { GlassProduct, AlliedProduct, Product } from '@/lib/types'
import { formatINR } from '@/lib/formatCurrency'
import { NmModal } from './neumorphic/NmModal'
import { NmButton } from './neumorphic/NmButton'
import { ProductIllustration } from './ProductIllustration'
import { AlliedSuggestions } from './AlliedSuggestions'
import { getCompatibleAlliedProducts } from '@/lib/products'
import { Calculator } from 'lucide-react'
import Link from 'next/link'

interface Props {
  product: Product | null
  onClose: () => void
}

function isGlass(p: Product): p is GlassProduct {
  return (p as GlassProduct).category === 'Glass'
}

export function ProductModal({ product, onClose }: Props) {
  if (!product) return null

  const isGlassProduct = isGlass(product)
  const allied = isGlassProduct ? getCompatibleAlliedProducts(product.name) : []

  return (
    <NmModal open={!!product} onClose={onClose} title={product.name}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <ProductIllustration
            glassType={isGlassProduct ? product.glassType : (product as AlliedProduct).category}
            size={100}
          />
          <div style={{ flex: 1, minWidth: '240px' }}>
            {isGlassProduct ? (
              <GlassDetails product={product} />
            ) : (
              <AlliedDetails product={product as AlliedProduct} />
            )}
          </div>
        </div>

        {isGlassProduct && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '8px',
            }}
          >
            <SpecTile label="Glass Type" value={product.glassType} />
            <SpecTile label="Thickness" value={`${product.thickness}mm`} />
            <SpecTile label="Process" value={product.process} />
            <SpecTile label="Coating" value={product.coating} />
            <SpecTile label="Edge" value={product.edge} />
            <SpecTile label="Certification" value={product.cert} />
            <SpecTile label="Color" value={product.color} />
            {product.config && <SpecTile label="Config" value={product.config} />}
          </div>
        )}

        {isGlassProduct && product.application.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '10px' }}>
              Recommended applications
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {product.application.map((app) => (
                <span
                  key={app}
                  style={{
                    backgroundColor: 'var(--nm-bg)',
                    boxShadow: 'var(--nm-raised-sm)',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: 'var(--nm-text-muted)',
                  }}
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}

        {isGlassProduct && allied.length > 0 && <AlliedSuggestions products={allied} />}

        {isGlassProduct && (
          <Link href={`/estimate?product=${product.id}`} style={{ textDecoration: 'none' }}>
            <NmButton variant="accent" size="lg" style={{ width: '100%' }}>
              <Calculator size={18} />
              Get Instant Estimate
            </NmButton>
          </Link>
        )}
      </div>
    </NmModal>
  )
}

function GlassDetails({ product }: { product: GlassProduct }) {
  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--nm-text-muted)' }}>Supplier</span>
        <div style={{ fontSize: '1rem', fontWeight: 600 }}>{product.supplier}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--nm-accent)',
          }}
        >
          {formatINR(product.rateMin)}–{formatINR(product.rateMax)}
        </span>
        <span style={{ fontSize: '0.85rem', color: 'var(--nm-text-muted)' }}>/sqft</span>
      </div>
    </>
  )
}

function AlliedDetails({ product }: { product: AlliedProduct }) {
  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--nm-text-muted)' }}>Brand</span>
        <div style={{ fontSize: '1rem', fontWeight: 600 }}>{product.brand}</div>
      </div>
      <p
        style={{
          color: 'var(--nm-text-muted)',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          marginBottom: '14px',
        }}
      >
        {product.description}
      </p>
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '1.75rem',
          fontWeight: 700,
          color: 'var(--nm-accent)',
        }}
      >
        {formatINR(product.pricePerUnit)}
      </div>
    </>
  )
}

function SpecTile({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-pressed-sm)',
        borderRadius: '10px',
        padding: '10px 12px',
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          color: 'var(--nm-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '2px',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--nm-text)' }}>{value}</div>
    </div>
  )
}
