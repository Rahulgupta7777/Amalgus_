'use client'

import { useState, useEffect, useMemo } from 'react'
import { Estimate, GlassProduct } from '@/lib/types'
import { getGlassProducts } from '@/lib/products'
import { calculateEstimate, mmToSqft, validateDimensions } from '@/lib/estimate'
import { NmCard } from './neumorphic/NmCard'
import { NmInput } from './neumorphic/NmInput'
import { NmButton } from './neumorphic/NmButton'
import { NmChip } from './neumorphic/NmChip'
import { AlertTriangle, Calculator } from 'lucide-react'

interface Props {
  preSelectedProductId?: string
  onEstimate: (estimate: Estimate) => void
}

export function EstimateForm({ preSelectedProductId, onEstimate }: Props) {
  const products = useMemo(() => getGlassProducts(), [])
  const initialProduct = useMemo(() => {
    if (preSelectedProductId) {
      const numId = parseInt(preSelectedProductId, 10)
      const byNum = products.find((p) => p.id === numId)
      if (byNum) return byNum
    }
    return products[0] || null
  }, [preSelectedProductId, products])

  const [selected, setSelected] = useState<GlassProduct | null>(initialProduct)
  const [width, setWidth] = useState('1200')
  const [height, setHeight] = useState('900')
  const [quantity, setQuantity] = useState('1')
  const [edge, setEdge] = useState<'Plain' | 'Polished' | 'Beveled'>('Polished')
  const [processing, setProcessing] = useState<'None' | 'Tempered' | 'Laminated'>('None')
  const [hasHoles, setHasHoles] = useState(false)

  useEffect(() => {
    if (!selected && products.length > 0) setSelected(products[0])
  }, [products, selected])

  const widthNum = parseFloat(width)
  const heightNum = parseFloat(height)
  const qtyNum = parseInt(quantity, 10)

  const dimensionCheck = validateDimensions(widthNum, heightNum)
  const qtyValid = isFinite(qtyNum) && qtyNum >= 1 && qtyNum <= 10000
  const canEstimate = selected && dimensionCheck.valid && qtyValid

  const area = canEstimate ? mmToSqft(widthNum, heightNum) : 0
  const warnings: string[] = []
  if (dimensionCheck.warning) warnings.push(dimensionCheck.warning)
  if (qtyValid && qtyNum > 1000) warnings.push('Large order — bulk pricing may apply')

  const handleCalculate = () => {
    if (!canEstimate || !selected) return
    const estimate = calculateEstimate({
      product: selected,
      widthMm: widthNum,
      heightMm: heightNum,
      quantity: qtyNum,
      edgeFinish: edge,
      processing,
      hasHoles,
    })
    onEstimate(estimate)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '720px', margin: '0 auto' }}>
      <NmCard variant="raised" size="md">
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--nm-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '10px',
          }}
        >
          1. Select glass
        </div>
        <select
          value={selected?.id ?? ''}
          onChange={(e) => {
            const id = parseInt(e.target.value, 10)
            const p = products.find((p) => p.id === id)
            if (p) setSelected(p)
          }}
          style={{
            width: '100%',
            backgroundColor: 'var(--nm-bg)',
            boxShadow: 'var(--nm-pressed-sm)',
            borderRadius: '12px',
            padding: '12px 16px',
            border: 'none',
            fontSize: '0.95rem',
            color: 'var(--nm-text)',
            outline: 'none',
            fontFamily: 'var(--font-dm-sans), sans-serif',
          }}
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — ₹{p.rateMin}–{p.rateMax}/sqft
            </option>
          ))}
        </select>
      </NmCard>

      <NmCard variant="raised" size="md">
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--nm-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px',
          }}
        >
          2. Dimensions & quantity
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <FormField label="Width (mm)">
            <NmInput
              type="number"
              fullWidth
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              min="0"
              max="20000"
              placeholder="1200"
            />
          </FormField>
          <FormField label="Height (mm)">
            <NmInput
              type="number"
              fullWidth
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="0"
              max="20000"
              placeholder="900"
            />
          </FormField>
          <FormField label="Qty">
            <NmInput
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max="10000"
              placeholder="1"
            />
          </FormField>
        </div>
        {canEstimate && (
          <div
            style={{
              marginTop: '12px',
              fontSize: '0.85rem',
              color: 'var(--nm-text-muted)',
            }}
          >
            Area per pane:{' '}
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--nm-accent)', fontWeight: 600 }}>
              {area.toFixed(2)} sqft
            </span>
          </div>
        )}
        {warnings.map((w) => (
          <div
            key={w}
            style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              color: 'var(--nm-warning)',
            }}
          >
            <AlertTriangle size={14} />
            {w}
          </div>
        ))}
      </NmCard>

      <NmCard variant="raised" size="md">
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--nm-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px',
          }}
        >
          3. Finishing options
        </div>

        <OptionGroup label="Edge finish">
          {(['Plain', 'Polished', 'Beveled'] as const).map((v) => (
            <NmChip key={v} selected={edge === v} onClick={() => setEdge(v)}>
              {v}
            </NmChip>
          ))}
        </OptionGroup>

        <OptionGroup label="Processing">
          {(['None', 'Tempered', 'Laminated'] as const).map((v) => (
            <NmChip key={v} selected={processing === v} onClick={() => setProcessing(v)}>
              {v}
            </NmChip>
          ))}
        </OptionGroup>

        <OptionGroup label="Cutouts">
          <NmChip selected={!hasHoles} onClick={() => setHasHoles(false)}>
            None
          </NmChip>
          <NmChip selected={hasHoles} onClick={() => setHasHoles(true)}>
            Holes / cutouts
          </NmChip>
        </OptionGroup>
      </NmCard>

      <NmButton
        variant="accent"
        size="lg"
        disabled={!canEstimate}
        onClick={handleCalculate}
        style={{ width: '100%' }}
      >
        <Calculator size={18} />
        Calculate Estimate
      </NmButton>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--nm-text-muted)', marginBottom: '6px' }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--nm-text-muted)', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{children}</div>
    </div>
  )
}
