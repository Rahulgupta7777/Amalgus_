'use client'

import { useState } from 'react'
import { Estimate } from '@/lib/types'
import { formatINR } from '@/lib/formatCurrency'
import { NmCard } from './neumorphic/NmCard'
import { NmButton } from './neumorphic/NmButton'
import { useToast } from './neumorphic/Toast'
import { Share2, RotateCcw, Check } from 'lucide-react'

interface Props {
  estimate: Estimate
  onReset: () => void
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

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <NmCard variant="raised" size="lg">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--nm-text-muted)', marginBottom: '4px' }}>
              Estimate for
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{estimate.glassType}</h2>
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--nm-text-muted)',
                fontFamily: 'var(--font-mono)',
                marginTop: '4px',
              }}
            >
              {estimate.width_mm}mm × {estimate.height_mm}mm · {estimate.quantity} pane
              {estimate.quantity > 1 ? 's' : ''} · {estimate.area_sqft.toFixed(2)} sqft each
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--nm-bg)',
            boxShadow: 'var(--nm-pressed-sm)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          {estimate.lineItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom:
                  i < estimate.lineItems.length - 1 ? '1px dashed rgba(184, 190, 200, 0.4)' : 'none',
              }}
            >
              <span style={{ fontSize: '0.88rem', color: 'var(--nm-text)' }}>{item.label}</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--nm-text)',
                }}
              >
                {formatINR(Math.round(item.subtotal))}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
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
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--nm-accent)',
            }}
          >
            {formatINR(Math.round(estimate.total))}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '24px',
            flexWrap: 'wrap',
          }}
        >
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
            marginTop: '20px',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Estimates are indicative based on average market rates. Final pricing may vary based on
          supplier, location, and order volume.
        </p>
      </NmCard>
    </div>
  )
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

function buildShareText(est: Estimate): string {
  const lines = [
    `AmalGus Glass Estimate`,
    `-----------------------`,
    `Product: ${est.glassType}`,
    `Dimensions: ${est.width_mm}mm × ${est.height_mm}mm`,
    `Quantity: ${est.quantity} pane${est.quantity > 1 ? 's' : ''}`,
    `Area per pane: ${est.area_sqft.toFixed(2)} sqft`,
    ``,
    ...est.lineItems.map((l) => `${l.label}: ${formatINR(Math.round(l.subtotal))}`),
    ``,
    `Subtotal: ${formatINR(Math.round(est.subtotal))}`,
    `GST (18%): ${formatINR(Math.round(est.gst))}`,
    `Total: ${formatINR(Math.round(est.total))}`,
  ]
  return lines.join('\n')
}
