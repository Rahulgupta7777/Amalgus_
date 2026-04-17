'use client'

import { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'

interface Props {
  products: Product[]
  onOpenDetails?: (p: Product) => void
}

export function ProductGrid({ products, onOpenDetails }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
      }}
    >
      {products.map((p, i) => (
        <div
          key={p.id}
          style={{
            animation: `slideUp 0.4s ease-out ${Math.min(i * 40, 400)}ms both`,
          }}
        >
          <ProductCard product={p} onOpenDetails={onOpenDetails} />
        </div>
      ))}
    </div>
  )
}
