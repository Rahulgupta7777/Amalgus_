'use client'

import { useRole } from '@/context/RoleContext'
import { ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Role } from '@/lib/types'
import { ROLES } from '@/lib/constants'

export function RoleSelector() {
  const { role, setRole } = useRole()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        aria-label="Select role"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        style={{
          backgroundColor: 'var(--nm-bg)',
          boxShadow: open ? 'var(--nm-pressed-sm)' : 'var(--nm-raised-sm)',
          borderRadius: '12px',
          padding: '10px 16px',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--nm-text)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          transition: 'box-shadow 120ms ease-out',
        }}
      >
        <span style={{ color: 'var(--nm-text-muted)', fontSize: '0.8rem' }}>I&apos;m a</span>
        <span>{role}</span>
        <ChevronDown
          size={14}
          style={{
            transition: 'transform 200ms ease-out',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
          }}
        />
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            backgroundColor: 'var(--nm-bg)',
            boxShadow: 'var(--nm-raised-lg)',
            borderRadius: '16px',
            padding: '8px',
            minWidth: '200px',
            zIndex: 100,
            animation: 'slideUp 0.2s ease-out',
          }}
        >
          {ROLES.map((r) => (
            <button
              key={r}
              role="menuitem"
              onClick={() => {
                setRole(r as Role)
                setOpen(false)
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: r === role ? 'var(--nm-accent-light)' : 'transparent',
                color: r === role ? 'var(--nm-accent-dark)' : 'var(--nm-text)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: r === role ? 600 : 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background-color 120ms ease-out',
              }}
              onMouseEnter={(e) => {
                if (r !== role) {
                  e.currentTarget.style.backgroundColor = 'rgba(14, 116, 144, 0.08)'
                }
              }}
              onMouseLeave={(e) => {
                if (r !== role) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {r}
              {r === role && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
