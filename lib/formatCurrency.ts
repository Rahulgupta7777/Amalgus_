const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatINR(value: number): string {
  return formatter.format(value)
}

export function formatINRShort(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`
  }
  return `₹${value}`
}
