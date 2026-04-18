# AmalGus — Glass Marketplace Prototype

Working prototype for AmalGus, a B2B2C marketplace for glass and allied products in India. Four features: product catalog with filters, AI-powered smart matching, instant estimate calculator, and a daily rates dashboard.

Not a generic e-commerce demo. Every product, price, supplier name, and certification in here is based on how the Indian glass industry actually works.

## Stack

- Next.js 14, TypeScript, Tailwind
- Groq (Llama 3.3 70B) for the matching engine
- Client-side estimate calculator (no API needed for pricing math)
- Neumorphism UI — single surface color, depth from shadow pairs only
- Inline SVG illustrations per glass type (no external image dependencies)
- Deploys to Vercel

## Architecture

Four pages, one API route, everything else is client-side.

```
Browser
  │
  ├── /              Product catalog. Filters run client-side against
  │                   products.json. No API call. Role selector changes
  │                   sort order (homeowner sees by application,
  │                   architect by certification, builder by price).
  │
  ├── /smart-match   AI matching page. Textarea + example chips.
  │   │              Submits to POST /api/match.
  │   │
  │   └── /api/match
  │         ├─ Stage 1: Hard filters (category, price, thickness)
  │         ├─ Stage 2: Regex pre-parse (extract "8mm", "5+12+5",
  │         │           "2m x 1.2m", budget keywords from raw query)
  │         ├─ Stage 3: Groq Llama 3.3 70B — one call, JSON mode,
  │         │           glass-industry system prompt, returns top 5
  │         │           with scores + explanations
  │         └─ Stage 4: Validate — drop bad IDs, clamp scores,
  │                     deduplicate, sort, return
  │
  ├── /estimate      Quote calculator. All client-side math.
  │                   User picks glass type + enters dimensions in mm +
  │                   quantity + options (edge finish, processing, cutouts).
  │                   Calculates area in sq.ft, applies rate midpoint,
  │                   adds GST 18%, shows line-item breakdown.
  │                   Suggests compatible allied products (hardware,
  │                   sealants) based on glass type.
  │
  └── /daily-rates   Mock daily rate dashboard. Ticker strip at top,
                      rate cards with sparklines showing 7-day trend.
                      All from static JSON — no API.
```

## Matching engine — how it works and why

The matching pipeline is intentionally hybrid. Deterministic filters handle what they're good at (budget is a hard constraint, not a vibe). The LLM handles what it's good at (is 12mm laminated actually the right call for a 15th-floor balcony railing, and can you explain why in two sentences a homeowner will trust).

**Stage 1 — Hard filters.** Category, max price, thickness range applied before the LLM sees anything. If filters return nothing, we fall back to the full catalog — better to show loosely-matched results than an empty page. The LLM will score them low and say why.

**Stage 2 — Regex pre-parse.** Simple pattern extraction: thickness (`/(\d+)\s*mm/`), IGU configs (`/(\d+)\+(\d+)\+(\d+)/`), dimensions, and budget keywords. These get passed as structured hints alongside the raw query. Costs nothing. Prevents the LLM from misreading "6mm" as "6 meters".

**Stage 3 — Groq (Llama 3.3 70B).** Single API call with `response_format: { type: "json_object" }`. System prompt has a scoring rubric (90+ = near-perfect, 75+ = strong, 60+ = decent) and forces explanations to cite specific attributes in glass-industry language. Temperature 0.2 for consistency. Groq runs inference at ~400ms for this payload — fast enough that loading skeletons barely show.

**Stage 4 — Validation.** Strip markdown fences (JSON mode isn't bulletproof). Drop any product_id the model invented. Clamp scores to 0–100. Deduplicate. Sort. Take top 5. If everything fails, return an empty array — never crash.

Fallback: if the primary model errors out, we retry with `llama-3.1-8b-instant` before giving up.

### Why not embeddings / vector DB?

~40 products. They all fit in one LLM context window with room to spare. Embeddings would add a dependency, lose the ability to generate explanations, and produce worse results at this scale. When the catalog grows to thousands, you'd add a retrieval layer (pgvector or BM25) to narrow candidates before the LLM call. Not worth it here.

### Why not function calling / tool use?

JSON mode on Llama 3.3 70B is reliable enough for this prompt. Tool calling would add plumbing without improving output quality. The structured output is simple — five objects with four fields each.

## Estimate calculator

All math runs client-side. No API involved.

- Area: `(width_mm × height_mm) / 92903` → sq.ft. Also shown in sq.m for reference.
- Base rate: midpoint of the product's `rateMin` and `rateMax` per sq.ft.
- Edge finish surcharge: Plain ₹0, Polished +₹8/sqft, Beveled +₹15/sqft.
- Processing: Tempered +₹40/sqft, Laminated +₹60/sqft.
- Cutouts: flat ₹200 per panel.
- GST: 18% on subtotal.
- All prices formatted with `Intl.NumberFormat('en-IN')`.
- Guards against NaN, Infinity, negative values, zero dimensions.

This is an indicative estimate. Real pricing depends on order volume, location, daily rate fluctuations, and the supplier's quote. The disclaimer says so.

## Edge cases handled

Not an exhaustive list, but the ones that matter:

- Empty / too-short / too-long queries → client-side validation, never hits API
- API timeout → AbortController at 10s, shows retry
- Groq returns garbage → JSON parse wrapped in try/catch, error card with retry
- Hallucinated product IDs → silently dropped
- Scores outside 0–100 → clamped
- Duplicate results → deduplicated (highest score wins)
- Double-click on submit → button disabled during flight
- Filters return zero products → "No products match" + clear filters CTA
- Estimate with zero/negative dimensions → disabled submit + validation message
- Extreme dimensions (> 10m) → warning but allowed (some facade panels are genuinely that large)
- Quantity over 1000 → bulk contact message
- Special characters in query → sanitized before API call
- Mobile → all grids collapse, filter bar wraps, touch targets ≥ 44px

## Data

40+ mock products in `data/products.json`. Glass catalog covers Float, Toughened, Laminated, DGU/IGU, Low-E, Frosted, Reflective, Tinted, Mirror, Back-Painted, Acoustic, Ceramic Printed, Switchable Smart, and Bulletproof. Allied products cover hardware (patch fittings, spider fittings, hinges, handles, locks, spigots, point fittings), sealants (structural silicone, weather sealant, UV adhesive, glazing tape), and frames (aluminium profiles, shower channels, handrails). Suppliers are real Indian companies (Saint-Gobain India, AIS, Gold Plus, Sejal, Modiguard, Hindustan National Glass, Dorma, Ozone, Jindal). Certifications are real (IS 2553, IS 14900, EN 12150, EN 14449). Pricing is realistic for 2026 Indian market rates per sq.ft.

Daily rates in `data/dailyRates.json` — 10 glass types with 7-day history and ±₹1–5 daily fluctuations. All mock, but shaped like real factory rate movements.

## UI decisions

**Neumorphism.** One surface color (#E6E9EF) everywhere. Cards, buttons, and containers are raised (dual outward shadow). Inputs, sliders, and active states are pressed (inset shadow). No borders. No white cards. No gradients on containers. Depth comes entirely from light/dark shadow pairs.

Accessibility caveat: neumorphism has low decorative contrast by definition. All *informational* text (product names, specs, prices, scores, explanations) is high-contrast (#2D3748 on #E6E9EF, ~7:1 ratio). Neumorphism applies to containers, not to content. The one intentional high-contrast element per card is the match score puck in teal.

**Inline SVGs instead of product photos.** Each glass type has a distinct line illustration — tempered gets corner tick marks, laminated shows a PVB sandwich, IGUs show two panes with a spacer gap. They load instantly, never break, and look deliberately designed rather than "we forgot to add images."

**Role selector.** Four roles: Homeowner, Architect, Builder, Dealer. Affects sort order on the catalog page and gets passed to the LLM so explanations match the buyer's expertise level. A homeowner doesn't care about EN 14449 — they care that the glass won't cut them if it breaks.

# What I built

What I built by hand: product data (researched real suppliers, certifications, pricing), the glass-industry system prompt and scoring rubric, the 4-stage matching pipeline, the regex pre-parser, the estimate calculation logic, the SVG illustrations, and all the edge case handling.

## What I'd do with more time

- **Vector retrieval layer.** Once the catalog hits 500+ products, you can't send them all to the LLM. Add pgvector or a lightweight BM25 index to narrow to 20–30 candidates first.
- **Query caching.** Normalize queries and cache LLM responses in Vercel KV. Same query shouldn't cost another inference call.
- **Real daily rates API.** Connect to actual factory pricing feeds instead of mock JSON. The UI is ready for it — just swap the data source.
- **Multi-vendor comparison.** The data model supports it (multiple suppliers per glass type). Would need a comparison view and price-history charts.
- **Enquiry flow.** After the estimate, let the buyer submit an enquiry to the supplier. Email integration, maybe WhatsApp deep links (that's how this industry actually works).
- **Search analytics.** Log queries to understand what buyers are actually looking for. Feed that back into product recommendations.
