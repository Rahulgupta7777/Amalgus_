'use client'

import { useState, useEffect, useMemo } from 'react'
import { Estimate, GlassProduct, AlliedProduct, DeliveryOption, EstimateExtras } from '@/lib/types'
import { getGlassProducts, getAlliedProducts, getCompatibleAlliedProducts } from '@/lib/products'
import { calculateEstimate, mmToSqft, validateDimensions, CartAlliedEntry } from '@/lib/estimate'
import { formatINR } from '@/lib/formatCurrency'
import { useEstimateCart } from '@/context/EstimateCartContext'
import { NmCard } from './neumorphic/NmCard'
import { NmInput, NmTextarea } from './neumorphic/NmInput'
import { NmButton } from './neumorphic/NmButton'
import { NmChip } from './neumorphic/NmChip'
import { AlertTriangle, Calculator, Plus, Minus, X, Sparkles } from 'lucide-react'

interface Props {
  preSelectedProductId?: string
  onEstimate: (estimate: Estimate) => void
}

export function EstimateForm({ preSelectedProductId, onEstimate }: Props) {
  const products = useMemo(() => getGlassProducts(), [])
  const allAllied = useMemo(() => getAlliedProducts(), [])
  const initialProduct = useMemo(() => {
    if (preSelectedProductId) {
      const numId = parseInt(preSelectedProductId, 10)
      const byNum = products.find((p) => p.id === numId)
      if (byNum) return byNum
    }
    return products[0] || null
  }, [preSelectedProductId, products])

  const { alliedItems, addAllied, setAlliedQuantity, removeAllied } = useEstimateCart()

  const [selected, setSelected] = useState<GlassProduct | null>(initialProduct)
  const [width, setWidth] = useState('1200')
  const [height, setHeight] = useState('900')
  const [quantity, setQuantity] = useState('1')
  const [edge, setEdge] = useState<'Plain' | 'Polished' | 'Beveled'>('Polished')
  const [processing, setProcessing] = useState<'None' | 'Tempered' | 'Laminated'>('None')
  const [hasHoles, setHasHoles] = useState(false)

  const [installation, setInstallation] = useState(false)
  const [siteVisit, setSiteVisit] = useState(false)
  const [delivery, setDelivery] = useState<DeliveryOption>('Self-Pickup')
  const [timeline, setTimeline] = useState<EstimateExtras['timeline']>('Standard')
  const [notes, setNotes] = useState('')

  const [custName, setCustName] = useState('')
  const [custPhone, setCustPhone] = useState('')
  const [custPincode, setCustPincode] = useState('')
  const [custAddress, setCustAddress] = useState('')

  useEffect(() => {
    if (!selected && products.length > 0) setSelected(products[0])
  }, [products, selected])

  const widthNum = parseFloat(width)
  const heightNum = parseFloat(height)
  const qtyNum = parseInt(quantity, 10)

  const dimensionCheck = validateDimensions(widthNum, heightNum)
  const qtyValid = isFinite(qtyNum) && qtyNum >= 1 && qtyNum <= 10000
  const canEstimate = !!selected && dimensionCheck.valid && qtyValid

  const area = canEstimate ? mmToSqft(widthNum, heightNum) : 0
  const warnings: string[] = []
  if (dimensionCheck.warning) warnings.push(dimensionCheck.warning)
  if (qtyValid && qtyNum > 1000) warnings.push('Large order — bulk pricing may apply. Contact supplier.')

  const compatibleAllied = selected ? getCompatibleAlliedProducts(selected.name) : []
  const cartAlliedMap = new Map(alliedItems.map((i) => [i.productId, i.quantity]))

  const cartAlliedEntries: CartAlliedEntry[] = alliedItems
    .map((item) => {
      const prod = allAllied.find((p) => p.id === item.productId)
      return prod ? { product: prod, quantity: item.quantity } : null
    })
    .filter((e): e is CartAlliedEntry => e !== null)

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
      allied: cartAlliedEntries,
      extras: {
        installation,
        siteVisit,
        delivery,
        timeline,
        notes: notes.trim(),
        customer: {
          name: custName.trim() || undefined,
          phone: custPhone.trim() || undefined,
          pincode: custPincode.trim() || undefined,
          siteAddress: custAddress.trim() || undefined,
        },
      },
    })
    onEstimate(estimate)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', maxWidth: '780px', margin: '0 auto' }}>
      <SectionCard step={1} title="Select glass">
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
        {selected && (
          <div
            style={{
              marginTop: '10px',
              fontSize: '0.8rem',
              color: 'var(--nm-text-muted)',
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span>Supplier: <b style={{ color: 'var(--nm-text)' }}>{selected.supplier}</b></span>
            <span>Cert: <b style={{ color: 'var(--nm-text)' }}>{selected.cert}</b></span>
          </div>
        )}
      </SectionCard>

      <SectionCard step={2} title="Dimensions & quantity">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <FormField label="Width (mm)">
            <NmInput type="number" fullWidth value={width} onChange={(e) => setWidth(e.target.value)} min="0" max="20000" />
          </FormField>
          <FormField label="Height (mm)">
            <NmInput type="number" fullWidth value={height} onChange={(e) => setHeight(e.target.value)} min="0" max="20000" />
          </FormField>
          <FormField label="Qty">
            <NmInput type="number" fullWidth value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" max="10000" />
          </FormField>
        </div>
        {canEstimate && (
          <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--nm-text-muted)' }}>
            Area per pane:{' '}
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--nm-accent)', fontWeight: 600 }}>
              {area.toFixed(2)} sqft
            </span>
            {' · '}
            Total: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--nm-accent)', fontWeight: 600 }}>
              {(area * qtyNum).toFixed(2)} sqft
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
      </SectionCard>

      <SectionCard step={3} title="Finishing options">
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
          <NmChip selected={!hasHoles} onClick={() => setHasHoles(false)}>None</NmChip>
          <NmChip selected={hasHoles} onClick={() => setHasHoles(true)}>Holes / cutouts</NmChip>
        </OptionGroup>
      </SectionCard>

      <SectionCard
        step={4}
        title="Allied products"
        subtitle={
          cartAlliedEntries.length > 0
            ? `${cartAlliedEntries.length} item${cartAlliedEntries.length > 1 ? 's' : ''} added`
            : 'Add compatible hardware, sealants & frames'
        }
      >
        {cartAlliedEntries.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {cartAlliedEntries.map(({ product, quantity: qty }) => (
              <AlliedRow
                key={product.id}
                product={product}
                quantity={qty}
                onInc={() => setAlliedQuantity(product.id, qty + 1)}
                onDec={() => setAlliedQuantity(product.id, qty - 1)}
                onRemove={() => removeAllied(product.id)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--nm-bg)',
              boxShadow: 'var(--nm-pressed-sm)',
              borderRadius: '12px',
              color: 'var(--nm-text-muted)',
              fontSize: '0.85rem',
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            No allied items yet. Add from the suggestions below or from any product&apos;s details modal.
          </div>
        )}

        {compatibleAllied.length > 0 && (
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--nm-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={12} />
              Recommended for {selected?.glassType}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {compatibleAllied.slice(0, 8).map((a) => {
                const already = cartAlliedMap.has(a.id)
                return (
                  <NmChip
                    key={a.id}
                    onClick={() => addAllied(a.id, 1)}
                    selected={already}
                    tone={already ? 'accent' : 'default'}
                  >
                    {already ? <Plus size={11} /> : <Plus size={11} />}
                    {a.name} · {formatINR(a.pricePerUnit)}
                  </NmChip>
                )
              })}
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard step={5} title="Services & delivery">
        <OptionGroup label="Timeline">
          {(['Standard', 'Express', 'Flexible'] as const).map((v) => (
            <NmChip key={v} selected={timeline === v} onClick={() => setTimeline(v)}>
              {v}
            </NmChip>
          ))}
        </OptionGroup>
        <OptionGroup label="Delivery">
          {(['Self-Pickup', 'Local', 'Inter-City'] as const).map((v) => (
            <NmChip key={v} selected={delivery === v} onClick={() => setDelivery(v)}>
              {v === 'Local' ? 'Local (+₹500)' : v === 'Inter-City' ? 'Inter-City (+₹2000)' : 'Self-Pickup (free)'}
            </NmChip>
          ))}
        </OptionGroup>
        <OptionGroup label="Add-ons">
          <NmChip selected={installation} onClick={() => setInstallation(!installation)}>
            Installation (+₹45/sqft)
          </NmChip>
          <NmChip selected={siteVisit} onClick={() => setSiteVisit(!siteVisit)}>
            Site measurement (+₹800)
          </NmChip>
        </OptionGroup>
      </SectionCard>

      <SectionCard step={6} title="Customer & site details" subtitle="Optional — helps the supplier prepare a formal quote">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <FormField label="Your name">
            <NmInput fullWidth value={custName} onChange={(e) => setCustName(e.target.value)} placeholder="e.g. Priya Sharma" />
          </FormField>
          <FormField label="Phone">
            <NmInput fullWidth value={custPhone} onChange={(e) => setCustPhone(e.target.value)} placeholder="+91 98..." inputMode="tel" />
          </FormField>
          <FormField label="Site pincode">
            <NmInput fullWidth value={custPincode} onChange={(e) => setCustPincode(e.target.value)} placeholder="400001" inputMode="numeric" maxLength={6} />
          </FormField>
        </div>
        <div style={{ marginTop: '12px' }}>
          <FormField label="Site address (optional)">
            <NmInput fullWidth value={custAddress} onChange={(e) => setCustAddress(e.target.value)} placeholder="Building / Street / City" />
          </FormField>
        </div>
        <div style={{ marginTop: '12px' }}>
          <FormField label="Notes & special requirements">
            <NmTextarea
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Need holes for pull handles, edge polish on all sides, urgent installation by 25th…"
              style={{ minHeight: '80px' }}
              maxLength={500}
            />
          </FormField>
          <div style={{ textAlign: 'right', fontSize: '0.72rem', color: 'var(--nm-text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            {notes.length}/500
          </div>
        </div>
      </SectionCard>

      <NmButton
        variant="accent"
        size="lg"
        disabled={!canEstimate}
        onClick={handleCalculate}
        style={{ width: '100%' }}
      >
        <Calculator size={18} />
        Generate smart estimate
      </NmButton>
    </div>
  )
}

function SectionCard({
  step,
  title,
  subtitle,
  children,
}: {
  step: number
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <NmCard variant="raised" size="md">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: 'var(--nm-bg)',
            boxShadow: 'var(--nm-pressed-sm)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--nm-accent)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {step}
        </div>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--nm-text)' }}>{title}</div>
          {subtitle && (
            <div style={{ fontSize: '0.78rem', color: 'var(--nm-text-muted)', marginTop: '2px' }}>{subtitle}</div>
          )}
        </div>
      </div>
      {children}
    </NmCard>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--nm-text-muted)', marginBottom: '6px' }}>{label}</div>
      {children}
    </div>
  )
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--nm-text-muted)', marginBottom: '6px' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{children}</div>
    </div>
  )
}

function AlliedRow({
  product,
  quantity,
  onInc,
  onDec,
  onRemove,
}: {
  product: AlliedProduct
  quantity: number
  onInc: () => void
  onDec: () => void
  onRemove: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-pressed-sm)',
        borderRadius: '12px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.88rem',
            fontWeight: 600,
            color: 'var(--nm-text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {product.name}
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--nm-text-muted)' }}>
          {product.brand} · {formatINR(product.pricePerUnit)} each
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'var(--nm-bg)',
          boxShadow: 'var(--nm-raised-sm)',
          borderRadius: '999px',
          padding: '2px',
        }}
      >
        <button
          onClick={onDec}
          aria-label="Decrease"
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--nm-text-muted)',
          }}
        >
          <Minus size={12} />
        </button>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            fontWeight: 600,
            minWidth: '20px',
            textAlign: 'center',
          }}
        >
          {quantity}
        </span>
        <button
          onClick={onInc}
          aria-label="Increase"
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--nm-accent)',
          }}
        >
          <Plus size={12} />
        </button>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.88rem',
          fontWeight: 700,
          color: 'var(--nm-accent)',
          minWidth: '80px',
          textAlign: 'right',
        }}
      >
        {formatINR(product.pricePerUnit * quantity)}
      </div>
      <button
        onClick={onRemove}
        aria-label="Remove"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--nm-text-muted)',
          padding: '4px',
          display: 'flex',
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
