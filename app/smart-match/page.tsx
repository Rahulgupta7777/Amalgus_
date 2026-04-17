'use client'

import { useState } from 'react'
import { SearchCard } from '@/components/SearchCard'
import { MatchResultCard } from '@/components/MatchResultCard'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorCard } from '@/components/ErrorCard'
import { EmptyState } from '@/components/EmptyState'
import { MatchAPIResponse, MatchResult } from '@/lib/types'
import { useRole } from '@/context/RoleContext'
import { Sparkles } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'empty'

export default function SmartMatchPage() {
  const { role } = useRole()
  const [status, setStatus] = useState<Status>('idle')
  const [results, setResults] = useState<MatchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<MatchAPIResponse['meta'] | null>(null)
  const [lastQuery, setLastQuery] = useState('')

  const handleSearch = async (query: string) => {
    setStatus('loading')
    setError(null)
    setResults([])
    setLastQuery(query)

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || `Request failed (${response.status})`)
      }

      const matches: MatchResult[] = data.results || []
      setMeta(data.meta)

      if (matches.length === 0) {
        setStatus('empty')
      } else {
        setResults(matches)
        setStatus('success')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setStatus('error')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section style={{ textAlign: 'center', paddingTop: '20px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--nm-bg)',
            boxShadow: 'var(--nm-pressed-sm)',
            borderRadius: '999px',
            padding: '6px 14px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--nm-accent)',
            marginBottom: '14px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <Sparkles size={12} />
          AI Matching
        </div>
        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 700,
            marginBottom: '10px',
            letterSpacing: '-0.03em',
          }}
        >
          Smart Glass Matcher
        </h1>
        <p
          style={{
            fontSize: '1.02rem',
            color: 'var(--nm-text-muted)',
            maxWidth: '640px',
            margin: '0 auto',
          }}
        >
          Describe your project in plain language. AI analyzes your requirements and recommends
          the perfect glass from verified Indian suppliers.
        </p>
      </section>

      <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
        <SearchCard
          onSubmit={handleSearch}
          loading={status === 'loading'}
          initialValue={lastQuery}
        />
      </div>

      {status === 'loading' && (
        <div style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
          <LoadingSkeleton count={3} message="Analyzing requirements and ranking matches…" />
        </div>
      )}

      {status === 'error' && (
        <ErrorCard
          message={error || 'Something went wrong'}
          onRetry={() => lastQuery && handleSearch(lastQuery)}
        />
      )}

      {status === 'empty' && (
        <EmptyState
          title="No strong matches found"
          message="Try rephrasing with more detail about thickness, application, or features."
          actionLabel="Try again"
          onAction={() => setStatus('idle')}
        />
      )}

      {status === 'success' && results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Top {results.length} matches</h2>
            {meta && (
              <span
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--nm-text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {meta.latency_ms}ms · {meta.candidate_count} candidates
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {results.map((match, i) => (
              <MatchResultCard key={match.product_id} match={match} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
