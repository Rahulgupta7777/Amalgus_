import { GlassProduct, Estimate, EstimateLineItem } from './types'
import { MM_TO_SQFT, GST_RATE } from './constants'
import { formatINR } from './formatCurrency'

export function mmToSqft(widthMm: number, heightMm: number): number {
  const area = (widthMm * heightMm) / MM_TO_SQFT
  return isFinite(area) ? area : 0
}

export function mmToSqm(widthMm: number, heightMm: number): number {
  const area = (widthMm * heightMm) / 1000000
  return isFinite(area) ? area : 0
}

export interface CalculateEstimateInput {
  product: GlassProduct
  widthMm: number
  heightMm: number
  quantity: number
  edgeFinish?: 'Plain' | 'Polished' | 'Beveled'
  processing?: 'None' | 'Tempered' | 'Laminated'
  hasHoles?: boolean
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

export function calculateEstimate(input: CalculateEstimateInput): Estimate {
  const {
    product,
    widthMm,
    heightMm,
    quantity,
    edgeFinish = 'Plain',
    processing = 'None',
    hasHoles = false,
  } = input

  const area_sqft = mmToSqft(widthMm, heightMm)
  const baseRate = (product.rateMin + product.rateMax) / 2

  const lineItems: EstimateLineItem[] = []

  // Glass cost
  const glassCost = area_sqft * quantity * baseRate
  lineItems.push({
    label: `${product.name} (${quantity} panes × ${area_sqft.toFixed(2)} sqft)`,
    quantity,
    unitCost: area_sqft * baseRate,
    subtotal: glassCost,
  })

  // Edge finish cost
  let edgeFinishCost = 0
  if (edgeFinish === 'Polished') {
    edgeFinishCost = area_sqft * quantity * 8
  } else if (edgeFinish === 'Beveled') {
    edgeFinishCost = area_sqft * quantity * 15
  }

  if (edgeFinishCost > 0) {
    lineItems.push({
      label: `${edgeFinish} Edge Finish`,
      quantity,
      unitCost: area_sqft * (edgeFinish === 'Polished' ? 8 : 15),
      subtotal: edgeFinishCost,
    })
  }

  // Processing cost
  let processingCost = 0
  if (processing === 'Tempered') {
    processingCost = area_sqft * quantity * 40
  } else if (processing === 'Laminated') {
    processingCost = area_sqft * quantity * 60
  }

  if (processingCost > 0) {
    lineItems.push({
      label: `${processing} Processing`,
      quantity,
      unitCost: area_sqft * (processing === 'Tempered' ? 40 : 60),
      subtotal: processingCost,
    })
  }

  // Holes/cutouts
  let holesCost = 0
  if (hasHoles) {
    holesCost = 200 * quantity
    lineItems.push({
      label: 'Holes/Cutouts',
      quantity,
      unitCost: 200,
      subtotal: holesCost,
    })
  }

  const subtotal = glassCost + edgeFinishCost + processingCost + holesCost
  const gst = subtotal * GST_RATE
  const total = subtotal + gst

  return {
    productId: product.id,
    glassType: product.name,
    thickness: product.thickness,
    quantity,
    width_mm: widthMm,
    height_mm: heightMm,
    area_sqft,
    baseRate,
    lineItems,
    subtotal,
    gst,
    total,
  }
}
