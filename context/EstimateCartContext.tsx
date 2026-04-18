'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface AlliedCartItem {
  productId: number
  quantity: number
}

interface EstimateCart {
  alliedItems: AlliedCartItem[]
}

interface CartContextValue {
  alliedItems: AlliedCartItem[]
  addAllied: (productId: number, quantity?: number) => void
  removeAllied: (productId: number) => void
  setAlliedQuantity: (productId: number, quantity: number) => void
  clearAllied: () => void
  totalAlliedCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'amalgus-estimate-cart-v1'

function readStorage(): EstimateCart {
  if (typeof window === 'undefined') return { alliedItems: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { alliedItems: [] }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.alliedItems)) return { alliedItems: [] }
    return { alliedItems: parsed.alliedItems }
  } catch {
    return { alliedItems: [] }
  }
}

function writeStorage(cart: EstimateCart) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // ignore storage errors
  }
}

export function EstimateCartProvider({ children }: { children: ReactNode }) {
  const [alliedItems, setAlliedItems] = useState<AlliedCartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = readStorage()
    setAlliedItems(stored.alliedItems)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) writeStorage({ alliedItems })
  }, [alliedItems, hydrated])

  const addAllied = useCallback((productId: number, quantity = 1) => {
    setAlliedItems((prev) => {
      const existing = prev.find((i) => i.productId === productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { productId, quantity }]
    })
  }, [])

  const removeAllied = useCallback((productId: number) => {
    setAlliedItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const setAlliedQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setAlliedItems((prev) => prev.filter((i) => i.productId !== productId))
      return
    }
    setAlliedItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    )
  }, [])

  const clearAllied = useCallback(() => {
    setAlliedItems([])
  }, [])

  const totalAlliedCount = alliedItems.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ alliedItems, addAllied, removeAllied, setAlliedQuantity, clearAllied, totalAlliedCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useEstimateCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    return {
      alliedItems: [],
      addAllied: () => {},
      removeAllied: () => {},
      setAlliedQuantity: () => {},
      clearAllied: () => {},
      totalAlliedCount: 0,
    }
  }
  return ctx
}
