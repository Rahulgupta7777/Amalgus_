import { GlassProduct, AlliedProduct, Product, Role } from './types'
import productsData from '@/data/products.json'

function getAllProductsData(): Product[] {
  const data = productsData as any
  const products = data.products || data
  return products as unknown as Product[]
}

export function getAllProducts(): Product[] {
  return getAllProductsData()
}

export function getGlassProducts(): GlassProduct[] {
  return getAllProductsData().filter((p: any) => p.category === 'Glass') as GlassProduct[]
}

export function getAlliedProducts(): AlliedProduct[] {
  return getAllProductsData().filter((p: any) => p.category !== 'Glass') as AlliedProduct[]
}

export function getProductById(id: number): Product | undefined {
  return getAllProductsData().find((p: any) => p.id === id) as unknown as Product | undefined
}

export interface FilterCriteria {
  glassTypes?: string[]
  thickness?: number[]
  applications?: string[]
  priceMin?: number
  priceMax?: number
  searchText?: string
}

export function filterGlassProducts(criteria: FilterCriteria): GlassProduct[] {
  let products = getGlassProducts()

  if (criteria.searchText) {
    const text = criteria.searchText.toLowerCase()
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(text) ||
        p.supplier.toLowerCase().includes(text) ||
        p.glassType.toLowerCase().includes(text)
    )
  }

  if (criteria.glassTypes && criteria.glassTypes.length > 0) {
    products = products.filter((p) => criteria.glassTypes!.includes(p.glassType))
  }

  if (criteria.thickness && criteria.thickness.length > 0) {
    products = products.filter((p) => criteria.thickness!.includes(p.thickness))
  }

  if (criteria.applications && criteria.applications.length > 0) {
    products = products.filter((p) =>
      p.application.some((app) => criteria.applications!.includes(app))
    )
  }

  if (criteria.priceMin !== undefined || criteria.priceMax !== undefined) {
    products = products.filter((p) => {
      const mid = (p.rateMin + p.rateMax) / 2
      const minOk = criteria.priceMin === undefined || mid >= criteria.priceMin
      const maxOk = criteria.priceMax === undefined || mid <= criteria.priceMax
      return minOk && maxOk
    })
  }

  return products
}

export function sortProductsByRole(products: GlassProduct[], role: Role): GlassProduct[] {
  const sorted = [...products]

  switch (role) {
    case 'Homeowner':
      sorted.sort((a, b) => {
        const aPopular = a.application.length
        const bPopular = b.application.length
        return bPopular - aPopular
      })
      break

    case 'Architect':
      sorted.sort((a, b) => {
        const certA = a.cert.split(',').length
        const certB = b.cert.split(',').length
        return certB - certA
      })
      break

    case 'Builder':
      sorted.sort((a, b) => {
        const midA = (a.rateMin + a.rateMax) / 2
        const midB = (b.rateMin + b.rateMax) / 2
        return midA - midB
      })
      break

    case 'Dealer':
      sorted.sort((a, b) => {
        const marginA = a.rateMax - a.rateMin
        const marginB = b.rateMax - b.rateMin
        return marginB - marginA
      })
      break
  }

  return sorted
}

export function getCompatibleAlliedProducts(glassName: string): AlliedProduct[] {
  return getAlliedProducts().filter((p) =>
    p.compatibleWith.some(
      (ct) => ct === 'All Glass Types' || ct === glassName || glassName.includes(ct)
    )
  )
}
