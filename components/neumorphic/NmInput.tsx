'use client'

import { InputHTMLAttributes, CSSProperties, TextareaHTMLAttributes, forwardRef } from 'react'

interface NmInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  fullWidth?: boolean
}

export const NmInput = forwardRef<HTMLInputElement, NmInputProps>(function NmInput(
  { error = false, fullWidth = false, style, className = '', ...rest },
  ref
) {
  const baseStyle: CSSProperties = {
    backgroundColor: 'var(--nm-bg)',
    color: 'var(--nm-text)',
    boxShadow: 'var(--nm-pressed-sm)',
    borderRadius: '12px',
    padding: '12px 16px',
    border: error ? '1.5px solid var(--nm-error)' : '1.5px solid transparent',
    fontFamily: 'var(--font-dm-sans), sans-serif',
    fontSize: '1rem',
    outline: 'none',
    width: fullWidth ? '100%' : undefined,
    transition: 'border-color 120ms ease-out, box-shadow 120ms ease-out',
    ...style,
  }

  return <input ref={ref} className={className} style={baseStyle} {...rest} />
})

interface NmTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  fullWidth?: boolean
}

export const NmTextarea = forwardRef<HTMLTextAreaElement, NmTextareaProps>(function NmTextarea(
  { error = false, fullWidth = false, style, className = '', ...rest },
  ref
) {
  const baseStyle: CSSProperties = {
    backgroundColor: 'var(--nm-bg)',
    color: 'var(--nm-text)',
    boxShadow: 'var(--nm-pressed-sm)',
    borderRadius: '12px',
    padding: '14px 18px',
    border: error ? '1.5px solid var(--nm-error)' : '1.5px solid transparent',
    fontFamily: 'var(--font-dm-sans), sans-serif',
    fontSize: '1rem',
    outline: 'none',
    width: fullWidth ? '100%' : undefined,
    resize: 'vertical',
    minHeight: '120px',
    transition: 'border-color 120ms ease-out, box-shadow 120ms ease-out',
    ...style,
  }

  return <textarea ref={ref} className={className} style={baseStyle} {...rest} />
})
