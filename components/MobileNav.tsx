'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Package, Sparkles, Calculator, TrendingUp } from 'lucide-react'
import { RoleSelector } from './RoleSelector'
import { Logo } from './Logo'

interface Props {
  open: boolean
  onClose: () => void
}

const navItems = [
  { href: '/', label: 'Products', icon: Package },
  { href: '/smart-match', label: 'Smart Match', icon: Sparkles },
  { href: '/estimate', label: 'Estimate', icon: Calculator },
  { href: '/daily-rates', label: 'Daily Rates', icon: TrendingUp },
]

export function MobileNav({ open, onClose }: Props) {
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(45, 55, 72, 0.4)',
          zIndex: 998,
          animation: 'fadeIn 0.2s ease-out',
        }}
      />
      <aside
        role="dialog"
        aria-label="Navigation menu"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(300px, 80vw)',
          backgroundColor: 'var(--nm-bg)',
          boxShadow: 'var(--nm-raised-lg)',
          padding: '24px',
          zIndex: 999,
          animation: 'slideInFromRight 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size={36} />
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              backgroundColor: 'var(--nm-bg)',
              boxShadow: 'var(--nm-raised-sm)',
              border: 'none',
              borderRadius: '10px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px' }}>
          {navItems.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--nm-accent)' : 'var(--nm-text)',
                  textDecoration: 'none',
                  boxShadow: active ? 'var(--nm-pressed-sm)' : 'none',
                  transition: 'all 120ms ease-out',
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <RoleSelector />
        </div>
      </aside>
    </>
  )
}
