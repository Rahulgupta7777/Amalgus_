'use client'

import { useState, useMemo } from 'react'
import { FilterBar } from '@/components/FilterBar'
import { ProductGrid } from '@/components/ProductGrid'
import { EmptyState } from '@/components/EmptyState'
import { ProductModal } from '@/components/ProductModal'
import {
  filterGlassProducts,
  sortProductsByRole,
  getGlassProducts,
  getAlliedProducts,
  FilterCriteria,
} from '@/lib/products'
import { useRole } from '@/context/RoleContext'
import { Product } from '@/lib/types'

export default function ProductsPage() {
  const { role } = useRole()

  const [searchText, setSearchText] = useState('')
  const [glassTypes, setGlassTypes] = useState<string[]>([])
  const [thickness, setThickness] = useState<number[]>([])
  const [applications, setApplications] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [modalProduct, setModalProduct] = useState<Product | null>(null)

  const allGlass = useMemo(() => getGlassProducts(), [])
  const allied = useMemo(() => getAlliedProducts(), [])

  const availableGlassTypes = useMemo(
    () => Array.from(new Set(allGlass.map((p) => p.glassType))).sort(),
    [allGlass]
  )
  const availableThickness = useMemo(
    () => Array.from(new Set(allGlass.map((p) => p.thickness))).sort((a, b) => a - b),
    [allGlass]
  )
  const availableApplications = useMemo(() => {
    const set = new Set<string>()
    allGlass.forEach((p) => p.application.forEach((a) => set.add(a)))
    return Array.from(set).sort()
  }, [allGlass])

  const criteria: FilterCriteria = {
    searchText,
    glassTypes,
    thickness,
    applications,
    priceMin: priceRange[0],
    priceMax: priceRange[1],
  }

  const filtered = useMemo(() => filterGlassProducts(criteria), [
    searchText,
    glassTypes,
    thickness,
    applications,
    priceRange,
  ])
  const sorted = useMemo(() => sortProductsByRole(filtered, role), [filtered, role])

  const showingAllied = glassTypes.length === 0 && thickness.length === 0 && applications.length === 0
  const display: Product[] = showingAllied ? [...sorted, ...allied] : sorted

  const handleReset = () => {
    setSearchText('')
    setGlassTypes([])
    setThickness([])
    setApplications([])
    setPriceRange([0, 500])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section style={{ textAlign: 'center', paddingTop: '20px' }}>
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            marginBottom: '10px',
            letterSpacing: '-0.03em',
          }}
        >
          Discover the perfect glass
        </h1>
        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--nm-text-muted)',
            maxWidth: '640px',
            margin: '0 auto 24px',
          }}
        >
          India&apos;s first intelligent glass marketplace — compare types, specs, and prices from
          verified suppliers.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            maxWidth: '640px',
            margin: '0 auto',
          }}
        >
          <StatCard value={`${allGlass.length}+`} label="Glass types" />
          <StatCard value="4" label="Verified suppliers" />
          <StatCard value="Daily" label="Market rates" />
        </div>
      </section>

      <FilterBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        selectedGlassTypes={glassTypes}
        onGlassTypesChange={setGlassTypes}
        selectedThickness={thickness}
        onThicknessChange={setThickness}
        selectedApplications={applications}
        onApplicationsChange={setApplications}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        onReset={handleReset}
        availableGlassTypes={availableGlassTypes}
        availableThickness={availableThickness}
        availableApplications={availableApplications}
        resultCount={sorted.length}
        totalCount={allGlass.length}
      />

      {sorted.length > 0 ? (
        <ProductGrid products={display} onOpenDetails={setModalProduct} />
      ) : (
        <EmptyState
          title="No glass products match"
          message="Try loosening a filter or clearing your search."
          actionLabel="Clear filters"
          onAction={handleReset}
        />
      )}

      <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-raised-sm)',
        borderRadius: '14px',
        padding: '16px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-outfit), sans-serif',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--nm-accent)',
          marginBottom: '2px',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--nm-text-muted)' }}>{label}</div>
    </div>
  )
}
