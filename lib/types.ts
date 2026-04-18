export type Role = 'Homeowner' | 'Architect' | 'Builder' | 'Dealer'

export interface GlassProduct {
  id: number
  name: string
  glassType: string
  category: 'Glass'
  thickness: number
  process: string
  application: string[]
  rateMin: number
  rateMax: number
  supplier: string
  cert: string
  edge: string
  coating: string
  color: string
  inStock: boolean
  config: string | null
}

export interface AlliedProduct {
  id: number
  name: string
  category: 'Hardware' | 'Sealant' | 'Frame' | 'Cladding'
  brand: string
  material: string
  finish: string
  pricePerUnit: number
  compatibleWith: string[]
  description: string
}

export type Product = GlassProduct | AlliedProduct

export interface DailyRate {
  id: number
  glassType: string
  thickness: string
  today: number
  unit: string
  change: number
  changePercent: number
  weekHistory: Array<{
    date: string
    rate: number
  }>
  min: number
  max: number
  supplier: string
}

export interface MatchResult {
  product_id: number
  match_score: number
  explanation: string
  matched_attributes: string[]
  why_this_glass: string
}

export interface MatchAPIResponse {
  results: MatchResult[]
  meta: {
    latency_ms: number
    candidate_count: number
  }
}

export interface EstimateLineItem {
  label: string
  quantity: number
  unitCost: number
  subtotal: number
  kind?: 'glass' | 'processing' | 'edge' | 'cutout' | 'allied' | 'service'
}

export type DeliveryOption = 'Self-Pickup' | 'Local' | 'Inter-City'

export interface EstimateCustomer {
  name?: string
  phone?: string
  pincode?: string
  siteAddress?: string
}

export interface EstimateExtras {
  installation: boolean
  siteVisit: boolean
  delivery: DeliveryOption
  timeline: 'Standard' | 'Express' | 'Flexible'
  notes: string
  customer: EstimateCustomer
}

export interface Estimate {
  productId: number
  glassType: string
  thickness: number
  quantity: number
  width_mm: number
  height_mm: number
  area_sqft: number
  area_sqm: number
  baseRate: number
  lineItems: EstimateLineItem[]
  subtotal: number
  gst: number
  total: number
  extras: EstimateExtras
  leadTimeDays: number
  validUntil: string
}
