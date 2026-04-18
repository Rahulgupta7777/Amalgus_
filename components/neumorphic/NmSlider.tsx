'use client'

import { ChangeEvent } from 'react'

interface NmSliderProps {
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  label?: string
  unit?: string
}

export function NmSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  unit = '',
}: NmSliderProps) {
  const percent = ((value - min) / (max - min)) * 100

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '0.85rem',
            color: 'var(--nm-text-muted)',
          }}
        >
          <span>{label}</span>
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'var(--nm-accent)',
              fontWeight: 600,
            }}
          >
            {value}
            {unit}
          </span>
        </div>
      )}
      <div
        style={{
          position: 'relative',
          height: '8px',
          borderRadius: '999px',
          backgroundColor: 'var(--nm-bg)',
          boxShadow: 'var(--nm-pressed-sm)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${percent}%`,
            borderRadius: '999px',
            background: 'var(--nm-accent)',
            opacity: 0.6,
            transition: 'width 120ms ease-out',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          aria-label={label}
          style={{
            position: 'absolute',
            top: '-8px',
            left: 0,
            width: '100%',
            height: '24px',
            background: 'transparent',
            appearance: 'none',
            WebkitAppearance: 'none',
            outline: 'none',
            cursor: 'pointer',
            margin: 0,
            padding: 0,
            boxShadow: 'none',
            border: 'none',
            borderRadius: 0,
          }}
        />
        <style jsx>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: var(--nm-bg);
            box-shadow: var(--nm-raised-sm);
            cursor: grab;
          }
          input[type='range']::-moz-range-thumb {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: var(--nm-bg);
            box-shadow: var(--nm-raised-sm);
            cursor: grab;
            border: none;
          }
        `}</style>
      </div>
    </div>
  )
}
