import {
  GlassProduct,
  AlliedProduct,
  Estimate,
  EstimateLineItem,
  EstimateExtras,
  DeliveryOption,
} from './types'
import { MM_TO_SQFT, GST_RATE } from './constants'

export function mmToSqft(widthMm: number, heightMm: number): number {
  const area = (widthMm * heightMm) / MM_TO_SQFT
  return isFinite(area) ? area : 0
}

export function mmToSqm(widthMm: number, heightMm: number): number {
  const area = (widthMm * heightMm) / 1000000
  return isFinite(area) ? area : 0
}

export interface CartAlliedEntry {
  product: AlliedProduct
  quantity: number
}

export interface CalculateEstimateInput {
  product: GlassProduct
  widthMm: number
  heightMm: number
  quantity: number
  edgeFinish?: 'Plain' | 'Polished' | 'Beveled'
  processing?: 'None' | 'Tempered' | 'Laminated'
  hasHoles?: boolean
  allied?: CartAlliedEntry[]
  extras?: Partial<EstimateExtras>
}

export function validateDimensions(widthMm: number, heightMm: number): { valid: boolean; warning?: string } {
  if (!isFinite(widthMm) || !isFinite(heightMm)) {
    return { valid: false }
  }
  if (widthMm <= 0 || heightMm <= 0) {
    return { valid: false }
  }
  if (widthMm > 10000 || heightMm > 10000) {
    return { valid: true, warning: 'Dimension exceeds 10000mm - ensure this is intentional' }
  }
  return { valid: true }
}

const DELIVERY_RATES: Record<DeliveryOption, number> = {
  'Self-Pickup': 0,
  Local: 500,
  'Inter-City': 2000,
}

const SITE_VISIT_FLAT = 800
const INSTALLATION_PER_SQFT = 45

export function estimateLeadTime(
  product: GlassProduct,
  timeline: EstimateExtras['timeline']
): number {
  const base =
    product.glassType === 'Switchable' || product.glassType === 'Bulletproof'
      ? 45
      : product.glassType === 'Insulated' ||
        product.glassType === 'Bent' ||
        product.glassType === 'Fire-Rated'
      ? 18
      : product.process === 'Laminated' || product.process.includes('Tempered')
      ? 10
      : 5

  if (timeline === 'Express') return Math.max(3, Math.ceil(base / 2))
  if (timeline === 'Flexible') return base + 5
  return base
}

function defaultExtras(): EstimateExtras {
  return {
    installation: false,
    siteVisit: false,
    delivery: 'Self-Pickup',
    timeline: 'Standard',
    notes: '',
    customer: {},
  }
}

export function calculateEstimate(input: CalculateEstimateInput): Estimate {
  const {
    product,
    widthMm,
    heightMm,
    quantity,
    edgeFinish = 'Plain',
    processing = 'None',
    hasHoles = false,
    allied = [],
    extras: extrasInput,
  } = input

  const extras: EstimateExtras = { ...defaultExtras(), ...(extrasInput || {}) }

  const area_sqft = mmToSqft(widthMm, heightMm)
  const area_sqm = mmToSqm(widthMm, heightMm)
  const totalArea = area_sqft * quantity
  const baseRate = (product.rateMin + product.rateMax) / 2

  const lineItems: EstimateLineItem[] = []

  const glassCost = totalArea * baseRate
  lineItems.push({
    label: `${product.name} (${quantity} × ${area_sqft.toFixed(2)} sqft)`,
    quantity,
    unitCost: area_sqft * baseRate,
    subtotal: glassCost,
    kind: 'glass',
  })

  let edgeFinishCost = 0
  const edgeRate = edgeFinish === 'Polished' ? 8 : edgeFinish === 'Beveled' ? 15 : 0
  if (edgeRate > 0) {
    edgeFinishCost = totalArea * edgeRate
    lineItems.push({
      label: `${edgeFinish} Edge Finish`,
      quantity,
      unitCost: area_sqft * edgeRate,
      subtotal: edgeFinishCost,
      kind: 'edge',
    })
  }

  let processingCost = 0
  const procRate = processing === 'Tempered' ? 40 : processing === 'Laminated' ? 60 : 0
  if (procRate > 0) {
    processingCost = totalArea * procRate
    lineItems.push({
      label: `${processing} Processing`,
      quantity,
      unitCost: area_sqft * procRate,
      subtotal: processingCost,
      kind: 'processing',
    })
  }

  let holesCost = 0
  if (hasHoles) {
    holesCost = 200 * quantity
    lineItems.push({
      label: 'Holes/Cutouts',
      quantity,
      unitCost: 200,
      subtotal: holesCost,
      kind: 'cutout',
    })
  }

  let alliedCost = 0
  allied.forEach((entry) => {
    const cost = entry.product.pricePerUnit * entry.quantity
    alliedCost += cost
    lineItems.push({
      label: `${entry.product.name} (${entry.product.brand})`,
      quantity: entry.quantity,
      unitCost: entry.product.pricePerUnit,
      subtotal: cost,
      kind: 'allied',
    })
  })

  let installCost = 0
  if (extras.installation) {
    installCost = totalArea * INSTALLATION_PER_SQFT
    lineItems.push({
      label: `Installation (${totalArea.toFixed(2)} sqft)`,
      quantity: 1,
      unitCost: installCost,
      subtotal: installCost,
      kind: 'service',
    })
  }

  let siteVisitCost = 0
  if (extras.siteVisit) {
    siteVisitCost = SITE_VISIT_FLAT
    lineItems.push({
      label: 'Site visit & measurement',
      quantity: 1,
      unitCost: SITE_VISIT_FLAT,
      subtotal: SITE_VISIT_FLAT,
      kind: 'service',
    })
  }

  let deliveryCost = 0
  if (extras.delivery !== 'Self-Pickup') {
    deliveryCost = DELIVERY_RATES[extras.delivery]
    lineItems.push({
      label: `Delivery (${extras.delivery})`,
      quantity: 1,
      unitCost: deliveryCost,
      subtotal: deliveryCost,
      kind: 'service',
    })
  }

  const subtotal =
    glassCost + edgeFinishCost + processingCost + holesCost + alliedCost + installCost + siteVisitCost + deliveryCost
  const gst = subtotal * GST_RATE
  const total = subtotal + gst

  const leadTimeDays = estimateLeadTime(product, extras.timeline)

  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + 7)

  return {
    productId: product.id,
    glassType: product.name,
    thickness: product.thickness,
    quantity,
    width_mm: widthMm,
    height_mm: heightMm,
    area_sqft,
    area_sqm,
    baseRate,
    lineItems,
    subtotal,
    gst,
    total,
    extras,
    leadTimeDays,
    validUntil: validUntil.toISOString().slice(0, 10),
  }
}
