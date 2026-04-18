import { GlassProduct } from './types'
import { MAX_QUERY_LEN, MIN_QUERY_LEN } from './constants'

export interface ParsedQuery {
  thicknessMm?: number[]
  keywords: string[]
  applications: string[]
  safety: boolean
  soundproof: boolean
  energyEfficient: boolean
  decorative: boolean
  privacy: boolean
}

export function sanitizeQuery(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  const trimmed = raw.trim()
  if (trimmed.length === 0) return ''
  return trimmed.slice(0, MAX_QUERY_LEN)
}

export function validateQuery(query: string): { valid: boolean; error?: string } {
  if (query.length < MIN_QUERY_LEN) {
    return { valid: false, error: `Query must be at least ${MIN_QUERY_LEN} characters` }
  }
  if (query.length > MAX_QUERY_LEN) {
    return { valid: false, error: `Query must be ${MAX_QUERY_LEN} characters or fewer` }
  }
  return { valid: true }
}

export function preParseQuery(query: string): ParsedQuery {
  const lower = query.toLowerCase()
  const parsed: ParsedQuery = {
    keywords: [],
    applications: [],
    safety: false,
    soundproof: false,
    energyEfficient: false,
    decorative: false,
    privacy: false,
  }

  const thicknessMatch = query.match(/(\d{1,2})\s?mm/gi)
  if (thicknessMatch) {
    parsed.thicknessMm = Array.from(
      new Set(
        thicknessMatch
          .map((t) => parseInt(t.replace(/\s?mm/i, ''), 10))
          .filter((n) => isFinite(n) && n > 0 && n <= 50)
      )
    )
  }

  const appKeywords: Array<{ key: RegExp; app: string }> = [
    { key: /shower|bath/i, app: 'Shower Enclosures' },
    { key: /railing|balcony/i, app: 'Railings' },
    { key: /partition|office|conference/i, app: 'Partition Walls' },
    { key: /kitchen|backsplash/i, app: 'Kitchen Backsplash' },
    { key: /window/i, app: 'Windows' },
    { key: /facade|exterior/i, app: 'Facades' },
    { key: /skylight|roof/i, app: 'Skylights' },
    { key: /door/i, app: 'Doors' },
    { key: /commercial|office building/i, app: 'Commercial' },
    { key: /hospital|clinic/i, app: 'Hospitals' },
  ]

  appKeywords.forEach(({ key, app }) => {
    if (key.test(lower) && !parsed.applications.includes(app)) {
      parsed.applications.push(app)
    }
  })

  if (/safe|safety|shatter|break|impact/i.test(lower)) {
    parsed.safety = true
  }

  if (/sound|noise|acoustic|quiet/i.test(lower)) {
    parsed.soundproof = true
  }

  if (/energy|efficient|thermal|insul|heat|cool|hvac/i.test(lower)) {
    parsed.energyEfficient = true
  }

  if (/decorative|color|paint|design|aesthetic/i.test(lower)) {
    parsed.decorative = true
  }

  if (/privacy|frosted|opaque/i.test(lower)) {
    parsed.privacy = true
  }

  return parsed
}

export function hardFilterProducts(
  candidates: GlassProduct[],
  hints: ParsedQuery
): GlassProduct[] {
  let filtered = [...candidates]

  if (hints.thicknessMm && hints.thicknessMm.length > 0) {
    const thicknessFiltered = filtered.filter((p) =>
      hints.thicknessMm!.some((t) => Math.abs(p.thickness - t) <= 2)
    )
    if (thicknessFiltered.length > 0) filtered = thicknessFiltered
  }

  if (hints.applications.length > 0) {
    const appFiltered = filtered.filter((p) =>
      p.application.some((app) => hints.applications.includes(app))
    )
    if (appFiltered.length > 0) filtered = appFiltered
  }

  if (hints.safety) {
    const safeFiltered = filtered.filter(
      (p) =>
        p.glassType === 'Toughened' ||
        p.glassType === 'Laminated' ||
        p.glassType === 'Acoustic' ||
        p.process === 'Tempered' ||
        p.process === 'Laminated'
    )
    if (safeFiltered.length > 0) filtered = safeFiltered
  }

  if (hints.soundproof) {
    const soundFiltered = filtered.filter(
      (p) => p.glassType === 'Acoustic' || p.coating === 'Acoustic Interlayer'
    )
    if (soundFiltered.length > 0) filtered = soundFiltered
  }

  if (hints.energyEfficient) {
    const efFiltered = filtered.filter(
      (p) =>
        p.glassType === 'Low-Emissivity' ||
        p.glassType === 'Insulated' ||
        p.coating === 'Low-E' ||
        p.coating === 'Low-E Option'
    )
    if (efFiltered.length > 0) filtered = efFiltered
  }

  if (hints.privacy) {
    const privacyFiltered = filtered.filter(
      (p) => p.glassType === 'Frosted' || p.glassType === 'Back-Painted'
    )
    if (privacyFiltered.length > 0) filtered = privacyFiltered
  }

  if (hints.decorative) {
    const decFiltered = filtered.filter(
      (p) => p.glassType === 'Back-Painted' || p.glassType === 'Frosted' || p.glassType === 'Reflective'
    )
    if (decFiltered.length > 0) filtered = decFiltered
  }

  return filtered.length > 0 ? filtered : candidates
}
