'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { Check, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return {
      toast: () => {
        if (typeof window !== 'undefined') console.warn('Toast outside provider')
      },
    }
  }
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 3000)
    return () => clearTimeout(timer)
  }, [onRemove])

  const iconMap = {
    success: <Check size={18} color="var(--nm-success)" />,
    error: <AlertCircle size={18} color="var(--nm-error)" />,
    info: <Info size={18} color="var(--nm-accent)" />,
  }

  return (
    <div
      role="status"
      style={{
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-raised)',
        borderRadius: '14px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'auto',
        minWidth: '280px',
        animation: 'slideUp 0.3s ease-out',
        color: 'var(--nm-text)',
        fontSize: '0.95rem',
        fontWeight: 500,
      }}
    >
      {iconMap[toast.type]}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={onRemove}
        aria-label="Dismiss"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--nm-text-muted)',
          padding: 0,
          display: 'flex',
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
