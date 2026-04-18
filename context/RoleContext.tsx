'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Role } from '@/lib/types'

interface RoleContextType {
  role: Role
  setRole: (role: Role) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('Homeowner')

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
}

export function useRole(): RoleContextType {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within RoleProvider')
  }
  return context
}
