'use client'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  trend?: 'up' | 'down' | 'flat'
}

export function Sparkline({ data, width = 120, height = 48, trend }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padding = 4

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return `${x},${y}`
  })

  const areaPoints = `${padding},${height} ${points.join(' ')} ${width - padding},${height}`

  const strokeColor =
    trend === 'up'
      ? 'var(--nm-success)'
      : trend === 'down'
      ? 'var(--nm-error)'
      : 'var(--nm-accent)'

  return (
    <div
      style={{
        backgroundColor: 'var(--nm-bg)',
        boxShadow: 'var(--nm-pressed-sm)',
        borderRadius: '10px',
        padding: '6px',
        display: 'inline-block',
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polygon points={areaPoints} fill={strokeColor} opacity="0.15" />
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
