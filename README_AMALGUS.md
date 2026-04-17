# AmalGus — Glass & Allied Products Marketplace

A complete Next.js 14 + TypeScript + Tailwind CSS web application for India's first B2B2C glass marketplace, featuring glassmorphism design and AI-powered glass matching using Claude.

## 🎯 Overview

AmalGus connects manufacturers, fabricators, suppliers, architects, builders, and homeowners in the glass industry. Built with modern web technologies and featuring a sophisticated AI matching engine, it brings standardization, transparency, and intelligent discovery to a $150–190B global glass construction market.

## ✨ Features

- **Products Catalog** — Browse 20+ glass products with detailed specs, pricing, and allied product recommendations
- **Smart AI Matching** — Describe your glass requirement in natural language; AI recommends the perfect product
- **Instant Estimates** — Calculate real-time glass pricing with options for edge finish, processing, and cutouts
- **Daily Rates Dashboard** — Track real-time market rates for 8 glass types with 7-day price history
- **Role-Based Experience** — Customize recommendations for Homeowner, Architect, Builder, or Dealer roles
- **Glassmorphism Design** — Stunning frosted glass UI with gradient backgrounds and smooth animations
- **Verified Suppliers** — Partner with real Indian glass manufacturers: AIS, Saint-Gobain, Sejal Glass, and more

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom CSS with glassmorphism tokens
- **Icons**: lucide-react
- **AI**: @anthropic-ai/sdk (Claude Opus 4.6)
- **Fonts**: Space Grotesk (headings), DM Sans (body)
- **Fonts**: Space Grotesk (headings), DM Sans (body)
- **State**: React Context (Role selection)

### File Structure
```
/app
  layout.tsx              — Root layout with fonts, gradient bg, RoleProvider
  globals.css             — Glassmorphism tokens, animations, base styles
  page.tsx                — Products catalog
  /smart-match/page.tsx   — AI glass matching
  /estimate/page.tsx      — Quote calculator
  /daily-rates/page.tsx   — Rate dashboard
  /api/match/route.ts     — Anthropic SDK integration

/components
  GlassCard, ProductCard, FilterBar, ProductModal,
  SearchCard, MatchResultCard, EstimateForm, EstimateResult,
  RateCard, RateTicker, Sparkline, Navbar, RoleSelector, etc.

/context
  RoleContext.tsx         — Role state management

/lib
  types.ts                — TypeScript interfaces
  products.ts             — Product filtering & sorting
  estimate.ts             — Price calculation
  matching.ts             — Query parsing & pre-filtering

/data
  products.json           — 20 products (14 glass + 6 allied)
  dailyRates.json         — 8 glass types with price history
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key (get it from https://console.anthropic.com)

### Installation

1. Clone the repository
   ```bash
   cd amalgus
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your ANTHROPIC_API_KEY
   ```

4. Run development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

### 1. Browse Products (`/`)
- Filter by glass type, thickness, application, and price range
- Search for specific products or suppliers
- Click "View Details" to see full specs and compatible allied products
- Recommendations automatically sort by role (Homeowner → popularity, Architect → certification, etc.)

### 2. Smart Match (`/smart-match`)
- Describe your project: "I need glass for my bathroom shower enclosure"
- AI analyzes your requirements and recommends top 5 matches
- Each match shows score (90+ cyan, 75+ blue, 60+ amber), specs, and explanation
- Click "Get Estimate →" to jump to pricing

### 3. Instant Estimate (`/estimate`)
- Select a glass product
- Enter width/height in millimeters (auto-converts to sq.ft)
- Choose quantity and options (edge finish, processing, cutouts)
- View line-item breakdown with GST calculation
- Share estimate to clipboard or start new

### 4. Daily Rates (`/daily-rates`)
- Scrolling ticker of 8 glass types
- Rate cards with change indicators and 7-day sparkline charts
- Track market trends and bulk pricing

### Role Selector (Top Right)
- Switch between Homeowner, Architect, Builder, Dealer
- Affects Smart Match explanation language and product sort order
- Homeowner → simple language, Architect → technical specs, Builder → bulk pricing focus

## 🤖 AI Matching Engine

The Smart Match feature leverages Claude Opus 4.6 via @anthropic-ai/sdk:

1. **Query Parsing** — Extracts thickness hints, application keywords, and feature flags from natural language
2. **Hard Filtering** — Pre-filters products by thickness, application, safety, soundproofing, energy efficiency
3. **LLM Ranking** — Calls Claude with full product catalog and buyer query
4. **Response Parsing** — Extracts JSON, validates product_ids, clamps scores 0–100
5. **Top 5 Return** — Returns highest-scoring matches with role-adjusted explanations

### System Prompt
The LLM uses a detailed system prompt that understands:
- Glass types: float, toughened, laminated, IGU/DGU, Low-E, reflective, frosted, acoustic, back-painted
- Indian certifications: IS 2553, IS 14900, IS 2835, BIS
- Applications: facades, shower enclosures, railings, partitions, skylights, windows
- Real-world use cases and safety considerations

## 🎨 Glassmorphism Design System

### Color Palette
- **Primary Accent**: #06B6D4 (cyan, glass/water feel)
- **Secondary Accent**: #8B5CF6 (violet)
- **Text Primary**: #FFFFFF
- **Text Body**: rgba(255, 255, 255, 0.85)
- **Text Muted**: rgba(255, 255, 255, 0.5)
- **Success**: #10B981, **Warning**: #F59E0B, **Error**: #EF4444

### Glass Card Pattern
Every card, button, and container uses:
```css
background: rgba(255, 255, 255, 0.07);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.15);
border-radius: 20px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

### Background
- Gradient: #0f0c29 → #302b63 → #24243e
- 3 animated gradient blobs (teal, purple, blue) with 20–25s drift animations
- Scrollbar styled to match theme

## 📊 Data Layer

### Products (20 total)
**14 Glass Types:**
1. Clear Float 5mm — ₹45–60/sqft
2. Clear Float 4mm — ₹35–45/sqft
3. Toughened 8mm — ₹120–160/sqft
4. Toughened 10mm — ₹140–180/sqft
5. Toughened 12mm — ₹180–240/sqft
6. Laminated 10mm (5+5 PVB) — ₹180–250/sqft
7. Laminated 12mm (6+6 PVB) — ₹220–300/sqft
8. DGU/IGU 6+12+6mm — ₹350–500/sqft
9. DGU/IGU 5+12+5mm — ₹300–420/sqft
10. Frosted 6mm — ₹85–110/sqft
11. Reflective 6mm — ₹100–140/sqft
12. Low-E 6mm — ₹200–300/sqft
13. Back-Painted 8mm — ₹150–220/sqft
14. Acoustic Laminated 12mm — ₹250–350/sqft

**6 Allied Products:**
1. Patch Fitting (Floor Spring) — ₹2,800/unit
2. Glass Door Handle — ₹650/unit
3. Spider Fitting (4-arm) — ₹1,200/unit
4. Structural Silicone Sealant — ₹850/tube
5. Weather Sealant — ₹320/tube
6. Aluminium Channel Profile — ₹180/rft

### Daily Rates (8 types)
- 7-day price history for sparkline charts
- Real-time change indicators (up/down/flat)
- Realistic ₹2–5 daily fluctuations

## 💰 Pricing & Estimation

### Base Calculation
- **Area Conversion**: width_mm × height_mm ÷ 92903 = area in sq.ft
- **Glass Cost**: area × quantity × rate_per_sqft
- **Edge Finish**: ₹8/sqft (polished), ₹15/sqft (beveled)
- **Processing**: ₹40/sqft (tempered), ₹60/sqft (laminated)
- **Holes/Cutouts**: ₹200 per panel
- **GST**: 18% on subtotal

### Example
1200mm × 900mm pane, quantity 1, Toughened 8mm @ ₹140/sqft:
- Area: 1.08 sq.ft
- Glass: 1.08 × 1 × 140 = ₹151
- GST (18%): ₹27
- **Total: ₹178**

## 🔒 Environment & Deployment

### Required Environment Variables
```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### Vercel Deployment
```bash
npm run build
vercel deploy
```

- No database required (all data in `/data`)
- No authentication needed (client-side role selection)
- Node.js runtime for `/api/match` endpoint
- Supports streaming and prompt caching for AI calls

## 📱 Responsive Design

- **Mobile**: 1-column product grid, stacked filters
- **Tablet**: 2-column grid, horizontal filter chips
- **Desktop**: 3-column grid, full filter bar

All components tested on 375px–1440px viewports.

## 🎯 Feature Highlights

### 1. Intelligent Filtering
- Multi-select chips for glass types and applications
- Price range slider (₹0–500)
- Thickness dropdown
- Full-text search across name, description, supplier

### 2. Role-Based Sorting
- **Homeowner** → Sort by application popularity
- **Architect** → Sort by certification count
- **Builder** → Sort by price (low-to-high)
- **Dealer** → Sort by margin (high-to-low)

### 3. AI-Powered Recommendations
- Natural language understanding of glass requirements
- Industry-aware terminology (tempered vs. toughened, DGU/IGU, PVB interlayer)
- Safety & compliance context (IS 2553, BIS)
- Role-aware explanations

### 4. Product Cross-Sell
- Automatic allied product suggestions based on glass type
- Modal shows compatible hardware, sealants, frames
- One-click ordering into estimate

### 5. Real-Time Pricing
- Market-driven daily updates
- 7-day trend visualization
- Change indicators (up/down)
- Bulk discount context for Dealers

## 🧪 Testing Checklist

- [ ] Navigate products page, apply filters, open product modal
- [ ] Submit AI query ("bathroom shower"), verify top 5 results
- [ ] Calculate estimate: 1200×900mm, 1x Toughened 8mm, tempered + polished edge
- [ ] Check daily rates ticker scrolls and rate cards show change
- [ ] Switch roles, verify Smart Match explanations differ
- [ ] Share estimate, paste into text editor
- [ ] Verify glassmorphism blur on all cards
- [ ] Test on mobile (iPhone 12), tablet (iPad), desktop (Chrome)

## 📚 Key Libraries

- **next/font/google** — Space Grotesk, DM Sans with font-display: swap
- **@anthropic-ai/sdk** — Claude Opus 4.6 for AI matching
- **lucide-react** — Icons (TrendingUp, Send, ChevronRight, etc.)
- **Tailwind CSS** — Utility-first styling with custom glass tokens

## 🚧 Future Enhancements

- User authentication & saved estimates
- Multi-supplier comparison & bulk RFQ
- Certification validator (IS 2553, BIS checker)
- Real supplier integration via APIs
- Order management dashboard
- Mobile native app (React Native)
- Video product guides
- Live chat support

## 📄 License

Open source for educational and commercial use. Attribution appreciated.

## 👥 Support

For questions or issues:
1. Check the code comments (minimal, focused on non-obvious parts)
2. Review the type definitions in `/lib/types.ts`
3. Verify `.env.local` has `ANTHROPIC_API_KEY` set

---


