import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { preParseQuery, hardFilterProducts, sanitizeQuery, validateQuery } from '@/lib/matching'
import { getGlassProducts } from '@/lib/products'
import { MatchResult } from '@/lib/types'
import {
  API_TIMEOUT_MS,
  API_PRIMARY_MODEL,
  API_FALLBACK_MODEL,
} from '@/lib/constants'

export const runtime = 'nodejs'

const GLASS_MATCHING_SYSTEM_PROMPT = `You are an expert glass industry product matching engine for AmalGus, India's first B2B2C glass marketplace. You understand all glass types (float, toughened/tempered, laminated with PVB interlayer, insulated IGU/DGU, Low-E, reflective, frosted, acoustic, back-painted), processing methods, Indian certifications (IS 2553, IS 14900, IS 2835, BIS), and real-world applications (facades, shower enclosures, railings, partitions, skylights, windows, kitchen backsplash).

The buyer has a role: Homeowner, Architect, Builder, or Dealer. Adjust your explanation accordingly — homeowners need simple language, architects need technical specs, builders need bulk/pricing context, dealers need trade terms.

Given a buyer's natural language requirement and candidate products, return the TOP 5 best matches.

Scoring rubric for match_score (0–100):
- 90–100: Near-perfect fit — glass type, thickness, process, application all align
- 75–89: Strong — minor mismatch on one dimension
- 60–74: Decent — right category but notable gap on 1–2 specs
- 40–59: Weak partial match
- Below 40: don't include

For each match return:
- product_id (must be an integer from the candidates list)
- match_score (integer 0–100)
- explanation: 1–2 sentences citing SPECIFIC glass attributes. Use industry terms. Mention safety/certification when relevant. If buyer is homeowner keep it simple. If architect use technical language.
- matched_attributes: 2–4 spec names that drove the match (from: glass_type, thickness, process, application, coating, certification, safety, price_fit, acoustic, thermal)
- why_this_glass: one short sentence for a non-expert explaining why this glass type suits their need (e.g. 'Tempered glass shatters into small safe pieces instead of dangerous shards')

Respond ONLY with valid JSON, no markdown fences: { "matches": [{ "product_id", "match_score", "explanation", "matched_attributes", "why_this_glass" }] }`

interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

async function callGroqWithTimeout(
  groq: Groq,
  model: string,
  messages: GroqChatMessage[],
  signal: AbortSignal
): Promise<string> {
  const response = await groq.chat.completions.create(
    {
      model,
      max_tokens: 2000,
      temperature: 0.2,
      messages,
    },
    { signal }
  )
  return response.choices[0]?.message?.content || ''
}

function extractJSON(text: string): any {
  const stripped = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim()
  const jsonMatch = stripped.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('LLM response did not contain JSON')
  }
  return JSON.parse(jsonMatch[0])
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Server misconfigured: GROQ_API_KEY not set' },
        { status: 500 }
      )
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const query = sanitizeQuery(body?.query)
    const role = typeof body?.role === 'string' ? body.role : 'Homeowner'

    const validation = validateQuery(query)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const hints = preParseQuery(query)

    let candidates = getGlassProducts()
    const filtered = hardFilterProducts(candidates, hints)
    if (filtered.length > 0) candidates = filtered

    const userMessage = `Buyer query: ${query}
Buyer role: ${role}
Parsed hints: ${JSON.stringify(hints)}
Candidate products (use the integer id in your response): ${JSON.stringify(
      candidates.slice(0, 15).map((p) => ({
        id: p.id,
        name: p.name,
        glassType: p.glassType,
        thickness: p.thickness,
        process: p.process,
        application: p.application,
        coating: p.coating,
        cert: p.cert,
        rateMin: p.rateMin,
        rateMax: p.rateMax,
      }))
    )}`

    const messages: GroqChatMessage[] = [
      { role: 'system', content: GLASS_MATCHING_SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ]

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

    let responseText = ''
    let modelUsed = API_PRIMARY_MODEL

    try {
      responseText = await callGroqWithTimeout(groq, API_PRIMARY_MODEL, messages, controller.signal)
    } catch (primaryErr: any) {
      clearTimeout(timeout)
      console.warn('Primary model failed, trying fallback:', primaryErr?.message)

      const fallbackController = new AbortController()
      const fallbackTimeout = setTimeout(
        () => fallbackController.abort(),
        API_TIMEOUT_MS
      )
      try {
        responseText = await callGroqWithTimeout(
          groq,
          API_FALLBACK_MODEL,
          messages,
          fallbackController.signal
        )
        modelUsed = API_FALLBACK_MODEL
      } finally {
        clearTimeout(fallbackTimeout)
      }
    } finally {
      clearTimeout(timeout)
    }

    if (!responseText) {
      return NextResponse.json(
        { error: 'AI service returned empty response' },
        { status: 502 }
      )
    }

    let parsed: any
    try {
      parsed = extractJSON(responseText)
    } catch (err: any) {
      console.error('JSON parse failed:', err?.message, responseText.slice(0, 200))
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 502 }
      )
    }

    const seen = new Set<number>()
    const matches: MatchResult[] = (parsed.matches || [])
      .map((m: any) => {
        const id = typeof m.product_id === 'number' ? m.product_id : parseInt(m.product_id, 10)
        const score = typeof m.match_score === 'number' ? m.match_score : parseInt(m.match_score, 10)
        return {
          product_id: id,
          match_score: Math.max(0, Math.min(100, isFinite(score) ? score : 0)),
          explanation: typeof m.explanation === 'string' ? m.explanation : '',
          matched_attributes: Array.isArray(m.matched_attributes) ? m.matched_attributes : [],
          why_this_glass: typeof m.why_this_glass === 'string' ? m.why_this_glass : '',
        }
      })
      .filter((m: MatchResult) => {
        if (!isFinite(m.product_id)) return false
        if (m.match_score < 40) return false
        if (!candidates.some((p) => p.id === m.product_id)) return false
        if (seen.has(m.product_id)) return false
        seen.add(m.product_id)
        return true
      })
      .sort((a: MatchResult, b: MatchResult) => b.match_score - a.match_score)
      .slice(0, 5)

    return NextResponse.json(
      {
        results: matches,
        meta: {
          latency_ms: Date.now() - startTime,
          candidate_count: candidates.length,
          model: modelUsed,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    const msg =
      error?.name === 'AbortError'
        ? 'AI service timed out'
        : error?.message || 'Internal server error'
    console.error('API Error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
