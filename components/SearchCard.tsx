'use client'

import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { NmCard } from './neumorphic/NmCard'
import { NmButton } from './neumorphic/NmButton'
import { NmTextarea } from './neumorphic/NmInput'
import { ExampleChips } from './ExampleChips'
import { MAX_QUERY_LEN, MIN_QUERY_LEN } from '@/lib/constants'

interface Props {
  onSubmit: (query: string) => void
  loading?: boolean
  initialValue?: string
}

export function SearchCard({ onSubmit, loading = false, initialValue = '' }: Props) {
  const [query, setQuery] = useState(initialValue)
  const [shake, setShake] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialValue) setQuery(initialValue)
  }, [initialValue])

  const trimmed = query.trim()
  const canSubmit = trimmed.length >= MIN_QUERY_LEN && trimmed.length <= MAX_QUERY_LEN && !loading

  const handleSubmit = () => {
    if (trimmed.length === 0) {
      triggerShake('Please describe your glass requirement')
      return
    }
    if (trimmed.length < MIN_QUERY_LEN) {
      triggerShake(`Query must be at least ${MIN_QUERY_LEN} characters`)
      return
    }
    setError(null)
    onSubmit(trimmed)
  }

  const triggerShake = (msg: string) => {
    setError(msg)
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleExample = (ex: string) => {
    setQuery(ex)
    setError(null)
    onSubmit(ex)
  }

  const charColor =
    query.length > MAX_QUERY_LEN
      ? 'var(--nm-error)'
      : query.length > MAX_QUERY_LEN * 0.8
      ? 'var(--nm-warning)'
      : 'var(--nm-text-muted)'

  return (
    <NmCard
      variant="raised"
      size="md"
      className={shake ? 'animate-shake' : ''}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <label
          htmlFor="smart-match-query"
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--nm-text)',
          }}
        >
          What glass do you need?
        </label>
        <NmTextarea
          id="smart-match-query"
          fullWidth
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.slice(0, MAX_QUERY_LEN + 50))
            if (error) setError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          placeholder="e.g. 'I need glass for my bathroom shower enclosure with safety features and a clean look'"
          error={!!error}
          disabled={loading}
          style={{ minHeight: '100px' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
          }}
        >
          <span style={{ color: error ? 'var(--nm-error)' : 'var(--nm-text-muted)' }}>
            {error || 'Tip: press ⌘+Enter to submit'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', color: charColor }}>
            {query.length}/{MAX_QUERY_LEN}
          </span>
        </div>

        <NmButton
          variant="accent"
          size="lg"
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={loading}
          style={{ width: '100%' }}
        >
          {!loading && <Send size={16} />}
          {loading ? 'Matching…' : 'Find matching glass'}
        </NmButton>

        <ExampleChips onSelect={handleExample} />
      </div>
    </NmCard>
  )
}
