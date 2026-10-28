# LinkedOut — Professional Social Network + Visual Stories + Workplace Intelligence

> **"Your work. Your people. Your real story."**  
> *Your professional life deserves a better feed.*

LinkedOut is a modern full-stack professional social network combining:
1. **Professional Credibility**: Technical RFC design discussions, project architecture showcases, and verified achievements without empty hustle-culture platitudes.
2. **Visual Storytelling**: Instagram-inspired 24-hour ephemeral stories, gradient micro-updates, and multi-image project carousels.
3. **Domain Communities**: Discord-inspired channel-based technical spaces (AI & ML, Software Engineering, Design & UX, Startups, Workplace Culture).
4. **Workplace Intelligence**: Employee-submitted company insights across psychological safety, management style, work-life balance, compensation, and on-call intensity.
5. **Protected Pseudonymous Identity**: Zero-leak pseudonym tokens that enable candid participation in sensitive workplace discussions without compromising public professional profiles.

---

## 🌟 Key Product Features

### 1. Home Feed & Visual Stories (`/feed`)
- **Horizontally Scrollable Story Rail**: Vibrant unseen gradient rings (`#F58529`, `#DD2A7B`, `#8134AF`) that transition to seen state once viewed.
- **24-Hour Ephemeral Stories**: Built-in Story Creator supporting rich text gradients or photo updates with server/query enforced 24-hour expiration.
- **Story Viewer**: Instagram-style viewer with auto-advancing progress timers, click navigation, pause on hold, keyboard controls (Arrow keys / Esc), and quick reaction pills.
- **Interactive Post Composer**: Text posts, multi-image carousels, project showcases with live repository links, and milestone celebration badges.
- **Social Graph Interactions**: Likes with persistent counters, bookmarking, internal sharing with instant link copying, and nested comment replies.

### 2. Dual Identity Architecture (Public + Protected Pseudonym)
- **Public Professional Mode**: Linked to your verified username (`@aarav_sharma`) for sharing career milestones, technical RFCs, and portfolio items.
- **Protected Pseudonym Mode**: Post with an isolated pseudonym token (`@binary_monk`) in salary discussions or workplace feedback. Private demographic details (age and gender) are strictly private by default and never influence professional visibility or credibility scoring.

### 3. Domain Communities (`/communities` & `/communities/[slug]`)
- Channel-based architecture:
  - `#general`
  - `#projects-and-code`
  - `#career-growth`
  - `#salary-discussions`
  - `#work-life-balance`
- Join/Leave spaces with real-time member counters.
- Channel discussion threads with upvotes, threaded replies, and pseudonymous contribution support (`/discussions/[id]`).

### 4. Workplace Intelligence Directory (`/companies` & `/companies/[slug]`)
- Comprehensive scorecards across 8 key workplace dimensions:
  - Psychological Safety
  - Work-Life Balance
  - Compensation & Equity
  - Management & Leadership
  - Career Growth
  - Culture & Values
  - Continuous Learning
  - Workload & On-call Intensity
- Verified positive themes and reported reasons for leaving.
- Sample sizes and date ranges disclosed on every profile to prevent single-review bias.
- **Anonymous Experience Flow** (`/share-experience`): Collects structured ratings and pros/cons with explicit community guidelines preventing personal attacks or proprietary trade secrets.

### 5. Universal Discovery & Explore (`/explore`)
- Search across professionals, companies, communities, and trending engineering RFCs.
- Instant 1-click follow/unfollow integration.

### 6. Notifications Center (`/notifications`)
- Unread badge counters, category filters, mark single as read, and mark all as read.

---

## 🏗️ Technical Architecture

- **Framework**: Next.js 16 (App Router, Turbopack, Partial Prerendering)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Vanilla CSS Design System with CSS variables, light/dark mode tokens, and WCAG 2.2 AA compliant contrast.
- **Icons**: Lucide React
- **Data Layer**: Dual-mode engine:
  - Works with Supabase PostgreSQL (`@supabase/supabase-js`, `@supabase/ssr`) with Row Level Security (RLS) migrations.
  - Automatically activates an offline-resilient reactive local storage engine with pre-seeded data when Supabase credentials are not configured.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24.15.0)
- npm 9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Mohit-Gupta1002/linkedout.git
cd linkedout
npm install
```

### 2. Environment Variables (Optional for Supabase)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
*(If omitted, LinkedOut seamlessly activates its offline-ready resilient mock database engine with full interactivity).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
```bash
npm test
```
Runs the automated test suite testing demographic privacy isolation, pseudonym token decoupling, story 24-hour expiration queries, post likes/bookmarks toggling, and company score validity.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🗄️ Database & Security Architecture

PostgreSQL migrations with Row Level Security (RLS) policies are located in `supabase/migrations/20261028_linkedout_schema.sql`.

Key Tables:
- `profiles`: Public identity, headline, bio, domain, skills, portfolio links.
- `private_user_preferences`: Strictly protected demographic fields (age range, gender) accessible only by the owning user.
- `private_identity_mappings`: Pseudonym tokens strictly isolated from client-facing queries.
- `stories`: 24-hour expiration indexed by timestamp.
- `companies` & `company_submissions`: Evidence-based company ratings and pros/cons.
- `communities`, `community_channels`, `discussions`, `discussion_replies`.
- `posts`, `follows`, `reactions`, `bookmarks`, `comments`, `notifications`.

---

## 📄 License
MIT License. Built autonomously with modern web craft.
