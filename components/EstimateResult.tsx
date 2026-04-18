'use client'

import { useState } from 'react'
import { Estimate, EstimateLineItem } from '@/lib/types'
import { formatINR } from '@/lib/formatCurrency'
import { NmCard } from './neumorphic/NmCard'
import { NmButton } from './neumorphic/NmButton'
import { useToast } from './neumorphic/Toast'
import { Share2, RotateCcw, Check, Clock, Truck, Wrench, Package, FileText, User, MapPin } from 'lucide-react'

interface Props {
  estimate: Estimate
  onReset: () => void
}

const KIND_LABEL: Record<string, { label: string; icon: React.ReactNode }> = {
  glass: { label: 'Glass', icon: <Package size={12} /> },
  edge: { label: 'Edge', icon: <Package size={12} /> },
  processing: { label: 'Process', icon: <Wrench size={12} /> },
  cutout: { label: 'Cutouts', icon: <Wrench size={12} /> },
  allied: { label: 'Allied', icon: <Package size={12} /> },
  service: { label: 'Service', icon: <Truck size={12} /> },
}

export function EstimateResult({ estimate, onReset }: Props) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const text = buildShareText(estimate)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast('Estimate copied to clipboard', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast('Unable to copy — try selecting text manually', 'error')
    }
  }

  const customerProvided = !!(
    estimate.extras.customer.name ||
    estimate.extras.customer.phone ||
    estimate.extras.customer.pincode ||
    estimate.extras.customer.siteAddress
  )

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <NmCard variant="raised" size="lg">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--nm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Smart estimate
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700 }}>{estimate.glassType}</h2>
            <div
              style={{
                fontSize: '0.82rem',
                color: 'var(--nm-text-muted)',
                fontFamily: 'var(--font-mono)',
                marginTop: '4px',
              }}
            >
              {estimate.width_mm}mm × {estimate.height_mm}mm · {estimate.quantity} pane
              {estimate.quantity > 1 ? 's' : ''} · {estimate.area_sqft.toFixed(2)} sqft each ({estimate.area_sqm.toFixed(3)} sqm)
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
            <Badge icon={<Clock size={12} />}>Lead time: {estimate.leadTimeDays} days</Badge>
            <Badge icon={<FileText size={12} />}>Valid until {formatDate(estimate.validUntil)}</Badge>
          </div>
        </div>

        <LineItemsTable items={estimate.lineItems} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', marginTop: '16px' }}>
          <Row label="Subtotal" value={formatINR(Math.round(estimate.subtotal))} />
          <Row label="GST (18%)" value={formatINR(Math.round(estimate.gst))} muted />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid rgba(184, 190, 200, 0.5)',
          }}
        >
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>Total</span>
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '1.7rem',
              fontWeight: 700,
              color: 'var(--nm-accent)',
            }}
          >
            {formatINR(Math.round(estimate.total))}
          </span>
        </div>
      </NmCard>

      {(customerProvided || estimate.extras.notes) && (
        <NmCard variant="raised" size="md">
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--nm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            Project details
          </div>
          {customerProvided && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: estimate.extras.notes ? '14px' : 0 }}>
              {estimate.extras.customer.name && (
                <DetailTile icon={<User size={12} />} label="Name" value={estimate.extras.customer.name} />
              )}
              {estimate.extras.customer.phone && (
                <DetailTile icon={<User size={12} />} label="Phone" value={estimate.extras.customer.phone} />
              )}
              {estimate.extras.customer.pincode && (
                <DetailTile icon={<MapPin size={12} />} label="Pincode" value={estimate.extras.customer.pincode} />
              )}
              {estimate.extras.customer.siteAddress && (
                <DetailTile icon={<MapPin size={12} />} label="Site" value={estimate.extras.customer.siteAddress} />
              )}
            </div>
          )}
          {estimate.extras.notes && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--nm-text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={12} /> Notes
              </div>
              <div
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--nm-text)',
                  backgroundColor: 'var(--nm-bg)',
                  boxShadow: 'var(--nm-pressed-sm)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {estimate.extras.notes}
              </div>
            </div>
          )}
        </NmCard>
      )}

      <NmCard variant="raised" size="md">
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <NmButton variant="raised" size="md" onClick={handleShare} style={{ flex: 1 }}>
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            {copied ? 'Copied!' : 'Share estimate'}
          </NmButton>
          <NmButton variant="accent" size="md" onClick={onReset} style={{ flex: 1 }}>
            <RotateCcw size={16} />
            New estimate
          </NmButton>
        </div>
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--nm-text-muted)',
            marginTop: '16px',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Indicative estimate based on average market rates and your selected options. Final pricing depends on
          supplier, location, daily rate fluctuations, and order volume. Contact a supplier for a formal quote.
        </p>
      </NmCard>
    </div>
  )
}

function LineItemsTable({ items }: { items: EstimateLineItem[] }) {
  const groups = groupByKind(items)
  return (
    <div
      style={{
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-pressed-sm)',
        borderRadius: '14px',
        padding: '14px 16px',
      }}
    >
      {Object.entries(groups).map(([kind, group], groupIdx) => (
        <div key={kind} style={{ marginBottom: groupIdx < Object.keys(groups).length - 1 ? '12px' : 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--nm-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '6px',
            }}
          >
            {KIND_LABEL[kind]?.icon}
            {KIND_LABEL[kind]?.label || kind}
          </div>
          {group.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                alignItems: 'baseline',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '0.86rem', color: 'var(--nm-text)', minWidth: 0, flex: 1 }}>
                {item.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--nm-text)',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatINR(Math.round(item.subtotal))}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function groupByKind(items: EstimateLineItem[]): Record<string, EstimateLineItem[]> {
  const order = ['glass', 'processing', 'edge', 'cutout', 'allied', 'service']
  const grouped: Record<string, EstimateLineItem[]> = {}
  items.forEach((item) => {
    const key = item.kind || 'glass'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(item)
  })
  const ordered: Record<string, EstimateLineItem[]> = {}
  order.forEach((k) => {
    if (grouped[k]) ordered[k] = grouped[k]
  })
  return ordered
}

function Row({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ fontSize: '0.9rem', color: muted ? 'var(--nm-text-muted)' : 'var(--nm-text)' }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: muted ? 'var(--nm-text-muted)' : 'var(--nm-text)',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '0.74rem',
        fontWeight: 600,
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-pressed-sm)',
        color: 'var(--nm-accent)',
        padding: '5px 10px',
        borderRadius: '999px',
      }}
    >
      {icon}
      {children}
    </span>
  )
}

function DetailTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-pressed-sm)',
        borderRadius: '10px',
        padding: '8px 12px',
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          color: 'var(--nm-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '2px',
        }}
      >
        {icon}
        {label}
      </div>
      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--nm-text)', wordBreak: 'break-word' }}>
        {value}
      </div>
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function buildShareText(est: Estimate): string {
  const customer = est.extras.customer
  const lines = ['AmalGus Smart Estimate', '='.repeat(30), '']

  if (customer.name || customer.phone) {
    lines.push(`Customer: ${[customer.name, customer.phone].filter(Boolean).join(' · ')}`)
  }
  if (customer.siteAddress || customer.pincode) {
    lines.push(`Site: ${[customer.siteAddress, customer.pincode].filter(Boolean).join(', ')}`)
  }
  if (customer.name || customer.phone || customer.siteAddress) lines.push('')

  lines.push(`Product: ${est.glassType}`)
  lines.push(`Dimensions: ${est.width_mm}mm × ${est.height_mm}mm`)
  lines.push(`Quantity: ${est.quantity} pane${est.quantity > 1 ? 's' : ''}`)
  lines.push(`Area: ${est.area_sqft.toFixed(2)} sqft per pane (${(est.area_sqft * est.quantity).toFixed(2)} sqft total)`)
  lines.push('')
  lines.push('-- Line items --')

  est.lineItems.forEach((l) => {
    lines.push(`${l.label}: ${formatINR(Math.round(l.subtotal))}`)
  })

  lines.push('')
  lines.push(`Subtotal: ${formatINR(Math.round(est.subtotal))}`)
  lines.push(`GST (18%): ${formatINR(Math.round(est.gst))}`)
  lines.push(`TOTAL: ${formatINR(Math.round(est.total))}`)
  lines.push('')
  lines.push(`Timeline: ${est.extras.timeline} · Lead time: ${est.leadTimeDays} days`)
  lines.push(`Delivery: ${est.extras.delivery}`)
  lines.push(`Valid until: ${formatDate(est.validUntil)}`)

  if (est.extras.notes) {
    lines.push('')
    lines.push('Notes:')
    lines.push(est.extras.notes)
  }

  return lines.join('\n')
}
