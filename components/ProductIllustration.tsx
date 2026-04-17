'use client'

import { CSSProperties, ReactElement } from 'react'

interface Props {
  glassType: string
  size?: number
  style?: CSSProperties
}

const uid = (prefix: string, key: string) => `${prefix}-${key.replace(/[^a-z0-9]/gi, '')}`

const illustrations: Record<string, (s: number) => ReactElement> = {
  Float: (s) => {
    const id = uid('float', 'grad')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#E6F9FC" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#BEF0F5" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect x="22" y="18" width="56" height="64" rx="4" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="1.5" strokeOpacity="0.8" />
        <path d="M28 26 L36 26 L28 38 Z" fill="#FFFFFF" opacity="0.7" />
        <path d="M28 26 L40 26 L28 50 Z" fill="#FFFFFF" opacity="0.3" />
        <rect x="22" y="18" width="56" height="64" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.6" />
      </svg>
    )
  },
  Toughened: (s) => {
    const id = uid('tough', 'grad')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#BEF0F5" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <rect x="20" y="16" width="60" height="68" rx="4" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="2" />
        <g opacity="0.35" stroke="#0E7490" strokeWidth="0.6" fill="none">
          <path d="M30 30 L45 45 M32 52 L50 68 M60 22 L50 36 M68 44 L54 58 M42 22 L52 34" />
          <path d="M28 62 L42 72 M62 64 L70 74 M58 28 L66 38" />
        </g>
        <path d="M26 22 L34 22 L26 34 Z" fill="#FFFFFF" opacity="0.7" />
        <circle cx="74" cy="24" r="3" fill="#15803D" />
        <path d="M72.5 24 L73.5 25 L75.5 23" stroke="#FFFFFF" strokeWidth="0.7" fill="none" />
      </svg>
    )
  },
  Laminated: (s) => {
    const id = uid('lam', 'grad')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#BEF0F5" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <rect x="20" y="20" width="60" height="26" rx="3" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="1.5" />
        <rect x="20" y="46" width="60" height="8" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.8" strokeOpacity="0.6" />
        <rect x="20" y="46" width="60" height="8" fill="url(#pvbStripes)" opacity="0.4" />
        <rect x="20" y="54" width="60" height="26" rx="3" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="1.5" />
        <path d="M26 24 L34 24 L26 36 Z" fill="#FFFFFF" opacity="0.6" />
        <path d="M26 58 L34 58 L26 70 Z" fill="#FFFFFF" opacity="0.6" />
        <text x="50" y="52" fontSize="5" fill="#B45309" textAnchor="middle" fontWeight="600" opacity="0.7">PVB</text>
      </svg>
    )
  },
  Insulated: (s) => {
    const idA = uid('igu', 'a')
    const idB = uid('igu', 'b')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={idA} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#BEF0F5" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id={idB} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E5E7EB" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D1D5DB" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect x="16" y="18" width="26" height="64" rx="3" fill={`url(#${idA})`} stroke="#0E7490" strokeWidth="1.5" />
        <rect x="42" y="18" width="16" height="64" fill={`url(#${idB})`} stroke="#0E7490" strokeWidth="0.8" strokeOpacity="0.5" />
        <rect x="58" y="18" width="26" height="64" rx="3" fill={`url(#${idA})`} stroke="#0E7490" strokeWidth="1.5" />
        <path d="M20 24 L26 24 L20 36 Z" fill="#FFFFFF" opacity="0.7" />
        <path d="M62 24 L68 24 L62 36 Z" fill="#FFFFFF" opacity="0.7" />
        <g stroke="#5A6478" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.5">
          <line x1="46" y1="30" x2="54" y2="30" />
          <line x1="46" y1="50" x2="54" y2="50" />
          <line x1="46" y1="70" x2="54" y2="70" />
        </g>
        <text x="50" y="14" fontSize="6" fill="#0E7490" textAnchor="middle" fontWeight="700" opacity="0.8">DGU</text>
      </svg>
    )
  },
  Frosted: (s) => {
    const id = uid('frost', 'grad')
    const pid = uid('frost', 'pat')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F1F5F9" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.7" />
          </linearGradient>
          <pattern id={pid} width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.6" fill="#94A3B8" opacity="0.5" />
          </pattern>
        </defs>
        <rect x="22" y="18" width="56" height="64" rx="4" fill={`url(#${id})`} stroke="#64748B" strokeWidth="1.5" />
        <rect x="22" y="18" width="56" height="64" rx="4" fill={`url(#${pid})`} />
        <rect x="22" y="18" width="56" height="64" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.7" />
        <circle cx="38" cy="35" r="8" fill="#FFFFFF" opacity="0.2" />
        <circle cx="62" cy="58" r="6" fill="#FFFFFF" opacity="0.15" />
      </svg>
    )
  },
  Reflective: (s) => {
    const id = uid('refl', 'grad')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#D97706" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#92400E" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#451A03" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <rect x="22" y="18" width="56" height="64" rx="4" fill={`url(#${id})`} stroke="#92400E" strokeWidth="1.5" />
        <path d="M22 18 L42 18 L22 60 Z" fill="#FFFFFF" opacity="0.35" />
        <path d="M22 18 L32 18 L22 40 Z" fill="#FFFFFF" opacity="0.5" />
        <path d="M55 78 L78 78 L78 55 Z" fill="#000000" opacity="0.15" />
      </svg>
    )
  },
  'Low-Emissivity': (s) => {
    const id = uid('lowe', 'grad')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#BEF0F5" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <rect x="22" y="18" width="56" height="64" rx="4" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="1.5" />
        <circle cx="30" cy="34" r="6" fill="#F59E0B" opacity="0.75" />
        <g stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" opacity="0.75">
          <line x1="30" y1="22" x2="30" y2="25" />
          <line x1="30" y1="43" x2="30" y2="46" />
          <line x1="18" y1="34" x2="21" y2="34" />
          <line x1="39" y1="34" x2="42" y2="34" />
          <line x1="22" y1="26" x2="24" y2="28" />
          <line x1="36" y1="26" x2="38" y2="28" />
        </g>
        <path d="M45 30 Q55 38 50 48 T55 66" stroke="#F59E0B" strokeWidth="1.2" fill="none" strokeDasharray="3,2" opacity="0.5" />
        <path d="M50 30 Q60 38 55 48 T60 66" stroke="#F59E0B" strokeWidth="1.2" fill="none" strokeDasharray="3,2" opacity="0.3" />
        <rect x="68" y="30" width="6" height="40" rx="1" fill="#0E7490" opacity="0.15" />
        <path d="M26 22 L34 22 L26 34 Z" fill="#FFFFFF" opacity="0.6" />
      </svg>
    )
  },
  'Back-Painted': (s) => {
    const id = uid('bp', 'grad')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0E7490" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0C5E73" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <rect x="22" y="18" width="56" height="64" rx="4" fill={`url(#${id})`} />
        <rect x="22" y="18" width="56" height="64" rx="4" fill="#CFFAFE" opacity="0.18" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.5" />
        <path d="M26 22 L44 22 L26 54 Z" fill="#FFFFFF" opacity="0.25" />
        <path d="M26 22 L34 22 L26 38 Z" fill="#FFFFFF" opacity="0.4" />
        <circle cx="70" cy="72" r="2.5" fill="#FFFFFF" opacity="0.35" />
      </svg>
    )
  },
  Tinted: (s) => {
    const id = uid('tint', 'grad')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A78B5F" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#6B5835" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect x="22" y="18" width="56" height="64" rx="4" fill={`url(#${id})`} stroke="#3F2F18" strokeWidth="1.2" strokeOpacity="0.6" />
        <path d="M26 22 L38 22 L26 42 Z" fill="#FFFFFF" opacity="0.45" />
        <path d="M26 22 L32 22 L26 32 Z" fill="#FFFFFF" opacity="0.7" />
        <rect x="22" y="18" width="56" height="64" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.4" />
      </svg>
    )
  },
  Mirror: (s) => {
    const id = uid('mir', 'grad')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>
        <rect x="22" y="16" width="56" height="68" rx="4" fill={`url(#${id})`} stroke="#64748B" strokeWidth="1.2" />
        <path d="M22 16 L58 16 L22 52 Z" fill="#FFFFFF" opacity="0.5" />
        <path d="M22 16 L40 16 L22 34 Z" fill="#FFFFFF" opacity="0.75" />
        <path d="M60 76 L78 76 L78 58 Z" fill="#1F2937" opacity="0.18" />
      </svg>
    )
  },
  'Ceramic Printed': (s) => {
    const id = uid('cp', 'grad')
    const pid = uid('cp', 'pat')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#BEF0F5" stopOpacity="0.5" />
          </linearGradient>
          <pattern id={pid} width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="2" fill="#0E7490" opacity="0.7" />
          </pattern>
        </defs>
        <rect x="22" y="18" width="56" height="64" rx="4" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="1.5" />
        <rect x="22" y="18" width="56" height="64" rx="4" fill={`url(#${pid})`} />
        <rect x="22" y="18" width="56" height="64" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.5" />
      </svg>
    )
  },
  Switchable: (s) => {
    const id = uid('sw', 'grad')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#E0F2F1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#E5E7EB" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect x="22" y="18" width="56" height="64" rx="4" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="1.5" />
        <g stroke="#0E7490" strokeWidth="0.8" opacity="0.4">
          <line x1="50" y1="18" x2="50" y2="82" strokeDasharray="3,2" />
        </g>
        <circle cx="72" cy="30" r="5" fill="#15803D" />
        <path d="M70 30 L71 32 L74 28" stroke="#FFFFFF" strokeWidth="1" fill="none" />
        <path d="M26 22 L34 22 L26 34 Z" fill="#FFFFFF" opacity="0.7" />
        <text x="64" y="76" fontSize="5" fill="#0E7490" textAnchor="middle" fontWeight="700" opacity="0.7">PDLC</text>
      </svg>
    )
  },
  Bulletproof: (s) => {
    const id = uid('bp2', 'grad')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#BEF0F5" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <rect x="20" y="20" width="60" height="14" rx="2" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="1" />
        <rect x="20" y="34" width="60" height="4" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.5" />
        <rect x="20" y="38" width="60" height="14" rx="2" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="1" />
        <rect x="20" y="52" width="60" height="4" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.5" />
        <rect x="20" y="56" width="60" height="14" rx="2" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="1" />
        <rect x="20" y="70" width="60" height="4" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.5" />
        <rect x="20" y="74" width="60" height="8" rx="2" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="1" />
        <circle cx="52" cy="45" r="3" fill="none" stroke="#DC2626" strokeWidth="1" />
        <path d="M50 43 L54 47 M50 47 L54 43" stroke="#DC2626" strokeWidth="0.8" />
      </svg>
    )
  },
  Acoustic: (s) => {
    const id = uid('ac', 'grad')
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#BEF0F5" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <rect x="20" y="20" width="60" height="22" rx="3" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="1.5" />
        <rect x="20" y="42" width="60" height="16" fill="#E0E7FF" stroke="#6366F1" strokeWidth="0.8" strokeOpacity="0.6" />
        <g stroke="#6366F1" strokeWidth="0.5" opacity="0.6">
          <line x1="20" y1="46" x2="80" y2="46" />
          <line x1="20" y1="50" x2="80" y2="50" />
          <line x1="20" y1="54" x2="80" y2="54" />
        </g>
        <rect x="20" y="58" width="60" height="22" rx="3" fill={`url(#${id})`} stroke="#0E7490" strokeWidth="1.5" />
        <g stroke="#0E7490" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M30 30 Q36 34 30 38" opacity="0.7" />
          <path d="M30 62 Q36 66 30 70" opacity="0.7" />
        </g>
        <g stroke="#0E7490" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5">
          <path d="M24 28 Q34 34 24 40" />
          <path d="M24 60 Q34 66 24 72" />
        </g>
        <path d="M26 24 L32 24 L26 34 Z" fill="#FFFFFF" opacity="0.5" />
      </svg>
    )
  },
  Hardware: (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="hw-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E5E7EB" />
          <stop offset="50%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#6B7280" />
        </linearGradient>
      </defs>
      <rect x="30" y="46" width="40" height="8" rx="2" fill="url(#hw-grad)" />
      <circle cx="30" cy="50" r="14" fill="url(#hw-grad)" stroke="#4B5563" strokeWidth="1" />
      <circle cx="30" cy="50" r="4" fill="#374151" />
      <circle cx="70" cy="50" r="14" fill="url(#hw-grad)" stroke="#4B5563" strokeWidth="1" />
      <circle cx="70" cy="50" r="4" fill="#374151" />
      <path d="M30 36 L30 48 M30 52 L30 64 M16 50 L28 50 M32 50 L44 50" stroke="#4B5563" strokeWidth="1.5" opacity="0.5" />
      <rect x="28" y="40" width="4" height="20" fill="#FFFFFF" opacity="0.3" />
      <rect x="68" y="40" width="4" height="20" fill="#FFFFFF" opacity="0.3" />
    </svg>
  ),
  Sealant: (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="se-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E7490" />
          <stop offset="100%" stopColor="#0C5E73" />
        </linearGradient>
      </defs>
      <rect x="38" y="28" width="24" height="52" rx="2" fill="url(#se-grad)" />
      <rect x="40" y="30" width="6" height="48" fill="#FFFFFF" opacity="0.15" />
      <path d="M48 28 L52 28 L54 20 L46 20 Z" fill="#FDE68A" />
      <rect x="46" y="14" width="8" height="6" rx="1" fill="#9CA3AF" />
      <rect x="34" y="76" width="32" height="6" rx="2" fill="#374151" />
      <rect x="38" y="38" width="24" height="14" rx="1" fill="#FFFFFF" opacity="0.25" />
      <text x="50" y="48" fontSize="5" fill="#FFFFFF" textAnchor="middle" fontWeight="700" opacity="0.8">GLUE</text>
    </svg>
  ),
  Frame: (s) => (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="fr-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D1D5DB" />
          <stop offset="100%" stopColor="#6B7280" />
        </linearGradient>
        <linearGradient id="fr-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#BEF0F5" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect x="18" y="22" width="64" height="56" rx="3" fill="url(#fr-grad)" stroke="#4B5563" strokeWidth="1" />
      <rect x="28" y="32" width="44" height="36" fill="url(#fr-glass)" stroke="#0E7490" strokeWidth="0.8" />
      <path d="M30 34 L38 34 L30 46 Z" fill="#FFFFFF" opacity="0.7" />
      <rect x="18" y="22" width="64" height="4" fill="#FFFFFF" opacity="0.35" />
      <rect x="18" y="22" width="4" height="56" fill="#FFFFFF" opacity="0.2" />
    </svg>
  ),
}

export function ProductIllustration({ glassType, size = 80, style }: Props) {
  const key = illustrations[glassType] ? glassType : 'Float'
  return (
    <div
      style={{
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-pressed-sm)',
        borderRadius: '14px',
        padding: '10px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {illustrations[key](size)}
    </div>
  )
}
