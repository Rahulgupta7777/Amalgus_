'use client'

import { Search, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { NmCard } from './neumorphic/NmCard'
import { NmChip } from './neumorphic/NmChip'
import { NmInput } from './neumorphic/NmInput'
import { NmSlider } from './neumorphic/NmSlider'
import { NmButton } from './neumorphic/NmButton'

interface FilterBarProps {
  searchText: string
  onSearchTextChange: (v: string) => void
  selectedGlassTypes: string[]
  onGlassTypesChange: (v: string[]) => void
  selectedThickness: number[]
  onThicknessChange: (v: number[]) => void
  selectedApplications: string[]
  onApplicationsChange: (v: string[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (v: [number, number]) => void
  onReset: () => void
  availableGlassTypes: string[]
  availableThickness: number[]
  availableApplications: string[]
  resultCount?: number
  totalCount?: number
}

export function FilterBar({
  searchText,
  onSearchTextChange,
  selectedGlassTypes,
  onGlassTypesChange,
  selectedThickness,
  onThicknessChange,
  selectedApplications,
  onApplicationsChange,
  priceRange,
  onPriceRangeChange,
  onReset,
  availableGlassTypes,
  availableThickness,
  availableApplications,
  resultCount,
  totalCount,
}: FilterBarProps) {
  const toggle = <T,>(arr: T[], value: T, setter: (v: T[]) => void) => {
    if (arr.includes(value)) setter(arr.filter((v) => v !== value))
    else setter([...arr, value])
  }

  const hasAnyFilter =
    searchText.length > 0 ||
    selectedGlassTypes.length > 0 ||
    selectedThickness.length > 0 ||
    selectedApplications.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 500

  return (
    <NmCard variant="raised" size="md">
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--nm-text-muted)',
          }}
        />
        <NmInput
          fullWidth
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          placeholder="Search by name, supplier, or glass type…"
          aria-label="Search"
          style={{ paddingLeft: '40px' }}
        />
        {searchText && (
          <button
            onClick={() => onSearchTextChange('')}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'var(--nm-text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <FilterGroup label="Glass type">
        {availableGlassTypes.map((t) => (
          <NmChip
            key={t}
            selected={selectedGlassTypes.includes(t)}
            onClick={() => toggle(selectedGlassTypes, t, onGlassTypesChange)}
          >
            {t}
          </NmChip>
        ))}
      </FilterGroup>

      <FilterGroup label="Thickness (mm)">
        {availableThickness.map((t) => (
          <NmChip
            key={t}
            selected={selectedThickness.includes(t)}
            onClick={() => toggle(selectedThickness, t, onThicknessChange)}
          >
            {t}mm
          </NmChip>
        ))}
      </FilterGroup>

      <CollapsibleGroup label="Application" count={selectedApplications.length}>
        {availableApplications.map((a) => (
          <NmChip
            key={a}
            selected={selectedApplications.includes(a)}
            onClick={() => toggle(selectedApplications, a, onApplicationsChange)}
          >
            {a}
          </NmChip>
        ))}
      </CollapsibleGroup>

      <div style={{ marginBottom: '16px' }}>
        <NmSlider
          label="Max price (₹/sqft)"
          min={50}
          max={500}
          step={25}
          value={priceRange[1]}
          onChange={(v) => onPriceRangeChange([priceRange[0], v])}
          unit=" ₹"
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px dashed rgba(184, 190, 200, 0.5)',
        }}
      >
        <span style={{ fontSize: '0.85rem', color: 'var(--nm-text-muted)' }}>
          {resultCount !== undefined && totalCount !== undefined
            ? `${resultCount} of ${totalCount} products`
            : ''}
        </span>
        {hasAnyFilter && (
          <NmButton variant="ghost" size="sm" onClick={onReset}>
            Reset
          </NmButton>
        )}
      </div>
    </NmCard>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        style={{
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--nm-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '8px',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{children}</div>
    </div>
  )
}

function CollapsibleGroup({
  label,
  count,
  children,
}: {
  label: string
  count: number
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginBottom: '16px' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--nm-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: open ? '8px' : '0',
          background: 'none',
          border: 'none',
          padding: '4px 0',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
        }}
      >
        {label}
        {count > 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '18px',
              height: '18px',
              padding: '0 6px',
              borderRadius: '999px',
              backgroundColor: 'var(--nm-accent-light)',
              color: 'var(--nm-accent-dark)',
              fontSize: '0.7rem',
              fontWeight: 700,
            }}
          >
            {count}
          </span>
        )}
        <ChevronDown
          size={12}
          style={{
            marginLeft: 'auto',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 200ms ease-out',
          }}
        />
      </button>
      {open && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
