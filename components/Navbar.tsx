'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, Package, Sparkles, Calculator, TrendingUp } from 'lucide-react'
import { RoleSelector } from './RoleSelector'
import { MobileNav } from './MobileNav'
import { Logo } from './Logo'

const navItems = [
  { href: '/', label: 'Products', icon: Package },
  { href: '/smart-match', label: 'Smart Match', icon: Sparkles },
  { href: '/estimate', label: 'Estimate', icon: Calculator },
  { href: '/daily-rates', label: 'Daily Rates', icon: TrendingUp },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'var(--nm-bg)',
          padding: '14px 0',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }} aria-label="AmalGus home">
            <Logo size={40} />
          </Link>

          <nav className="nav-desktop" aria-label="Primary">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'var(--nm-bg)',
                boxShadow: 'var(--nm-raised-sm)',
                borderRadius: '14px',
                padding: '6px',
              }}
            >
              {navItems.map((item) => {
                const active = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: active ? 600 : 500,
                      color: active ? 'var(--nm-accent)' : 'var(--nm-text-muted)',
                      textDecoration: 'none',
                      boxShadow: active ? 'var(--nm-pressed-sm)' : 'none',
                      transition: 'all 120ms ease-out',
                    }}
                  >
                    <Icon size={15} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="nav-desktop-role">
              <RoleSelector />
            </div>
            <button
              className="nav-mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{
                backgroundColor: 'var(--nm-bg)',
                boxShadow: 'var(--nm-raised-sm)',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
                display: 'none',
              }}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <style jsx global>{`
        @media (max-width: 900px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-desktop-role {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  )
}
