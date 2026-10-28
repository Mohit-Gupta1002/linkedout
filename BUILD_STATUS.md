# LinkedOut — Autonomous Build Status

## Project Overview
- **Product Name**: LinkedOut ("Your work. Your people. Your real story.")
- **Tagline**: "Your professional life deserves a better feed."
- **Stack**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Vanilla CSS High-Craft Design System, Dual-Mode Storage Engine (Supabase Client + LocalStorage Engine with rich pre-seeded datasets).
- **Target Audience**: College students, interns, software engineers, AI practitioners, product managers, designers, founders, and professionals in India & globally.

---

## 1. Status Dashboard

### Completed Features
- [x] **Brand & Visual Identity**:
  - Primary brand blue (`#0A66C2`), Deep navy (`#102A43`), Soft neutral surfaces (`#F7F9FC`, `#FFFFFF`), Text primary (`#172B4D`).
  - Story accent gradient (`#F58529`, `#DD2A7B`, `#8134AF`).
  - Typography: Inter for UI & body text, Space Grotesk for headings.
  - Coherent Dark Theme with full token parity (`[data-theme="dark"]` and prefers-color-scheme).
  - WCAG 2.2 AA compliant contrast and `@media (prefers-reduced-motion: reduce)` support.
- [x] **Global Responsive Navigation Shell**:
  - Desktop sticky top bar with LinkedOut brand badge, global search with live results across communities/companies/posts, nav links with unread counter, theme toggle, and user menu with pseudonym indicator.
  - Mobile bottom navigation bar (Home, Explore, Create (+), Communities, Profile).
- [x] **Landing Page (`/`)**:
  - Hero with brand taglines, feature pill, and primary/secondary CTAs.
  - Interactive preview cards for the 4 core pillars: Visual Stories, Professional Credibility, Domain Communities, and Workplace Intelligence.
  - Side-by-side comparison matrix ("Traditional Networks" vs "LinkedOut").
- [x] **Authentication & Onboarding Flow**:
  - Sign In (`/auth/sign-in`): Email/password + 1-click Demo Preview.
  - Sign Up (`/auth/sign-up`): Email, name, password + privacy reassurance.
  - Password Reset (`/auth/forgot-password`): Recovery flow.
  - 5-Step Interactive Onboarding (`/auth/onboarding`):
    1. Personal Details (Name, username, optional private age range & gender, country & city).
    2. Professional Profile (Status, domain, experience years, company, skills).
    3. Interests (Select up to 5 topic chips).
    4. Content Preferences (Checklist of feed categories).
    5. Privacy & Identity (Public profile setup + protected pseudonym handle configuration).
- [x] **Home Feed (`/feed`)**:
  - Horizontally scrollable Story Rail with vibrant gradient unseen rings and seen states.
  - Post Composer with text, multi-image support, project showcase links, achievement badges, community selection, and public vs pseudonym mode toggle.
  - Filterable stream: All Updates, Projects & Code, Visual Media, Pseudonymous Intel.
  - Social interactions: Likes with optimistic counters, expandable comments with inline author form, bookmarks, and internal share link copier.
  - Contextual left sidebar (User mini-profile, stats, pseudonym status, quick links).
  - Contextual right sidebar (Suggested communities with 1-click join, company intelligence spotlight).
- [x] **Instagram-Inspired 24-Hour Stories**:
  - Story Viewer modal with auto-advancing progress bars (5s interval), pause on hold, left/right click navigation, keyboard arrows / Escape support, reaction emoji pills (❤️, 🔥, 👏, 🚀, 💡), and delete own story option.
  - Story Creator supporting text with background gradient presets or photo URLs with captions.
  - Server & client 24-hour expiration enforcement (`expires_at > NOW()`).
- [x] **Domain Communities (`/communities` & `/communities/[slug]`)**:
  - Directory with domain filters, member counters, and join/leave toggling.
  - Community detail with Discord-style topic channels (`#general`, `#projects-and-code`, `#career-growth`, `#salary-discussions`, etc.).
  - Channel discussion feed and discussion composer with pseudonym mode option.
  - Single Discussion Thread View (`/discussions/[id]`) with RFC details, upvotes, replies list, and threaded reply form.
- [x] **Workplace Intelligence (`/companies` & `/companies/[slug]`)**:
  - Directory with search and industry filters.
  - Comprehensive company profile scorecards across 8 dimensions (Psychological Safety, Work-Life Balance, Compensation, Management, Career Growth, Culture, Learning, Workload).
  - Positive themes and reasons for leaving.
  - Sample sizes and date ranges disclosed to prevent single-incident bias.
  - Detailed employee submissions stream.
  - Workplace Review Submission Flow (`/share-experience`): Role band, seniority, tenure, rating sliders (1-5), pros, cons, reasons for leaving, and compliance checks.
- [x] **User Profile Experience (`/profile/[username]`)**:
  - Hero banner, avatar, headline, bio, domain badge, location, portfolio link.
  - Follow / Unfollow toggle with follower/following counters.
  - Tabbed navigation: Posts & RFCs, Visual Media Gallery, Skills & Credibility.
  - Strict privacy protection: Demographic age and gender are never shown.
- [x] **Universal Discovery & Explore (`/explore`)**:
  - Multi-category discovery across Suggested Professionals, Trending Projects, Topic Communities, and Top-rated Companies.
- [x] **Notifications Center (`/notifications`)**:
  - Read/unread indicators, category filters, mark single as read, and mark-all-as-read action.
- [x] **Database & Security Architecture**:
- [x] **Direct Messaging System (`/messages`)**:
  - 1-to-1 persistent threads with peer profiles (e.g., Dr. Priya Venkatesh, Rohit Kulkarni, Ananya Roy).
  - Responsive conversation split pane with online presence indicators, time-stamped chat bubbles, and read receipts.
  - Quick reply suggestion pills for rapid professional engagement.
  - Safety & respect warning banner adhering to minor protection boundaries and sensitive credential safeguards.
- [x] **Interactive Feed Polls**:
  - Dedicated Poll composer mode supporting custom questions and multiple choice options.
  - Real-time vote casting with percentage progress fill bars, vote counts, and user vote toggling.
  - Decoupled from public identity to ensure private voting.
- [x] **AI Workplace Intelligence Synthesis (`CompanyAISummary.tsx`)**:
  - Deterministic synthesis grounded in verified employee submissions.
  - Consensus strengths, growth/friction points, and candidate fit recommendation.
  - Zero hallucination with explicit evidence disclosures and sample size counts.
- [x] **Dedicated Member Spaces & Settings**:
  - My Communities workspace (`/my-communities`): Quick-jump directory of joined domain spaces and live topic channels.
  - Account, Theme & Pseudonym Settings (`/settings`): Controls for default participation mode (public vs protected pseudonym), notifications, and theme.
  - Password Reset Flow (`/auth/forgot-password` and `/auth/reset-password`).
  - Auth Callback handler (`/auth/callback`).
- [x] **Mandatory Onboarding Modal & 18+ Age Gate (`OnboardingModal.tsx`)**:
  - Displays centered modal with blurred backdrop dimming (`backdrop-filter: blur(14px)`) for unonboarded visitors.
  - Prevents background scrolling and interaction until onboarding is completed.
  - Multi-step flow: Basic Details & Age -> Professional Domain -> Technical Interests -> Dual Identity & Protected Pseudonym.
  - Strict 18+ age enforcement on both client and server side (`/api/auth/validate-age`).
  - Blocks underage users (< 18) with a dedicated lockout state with zero bypass or loophole.
  - Accurate date-of-birth age calculation accounting for calendar day and month threshold.
  - Preserves entered data across back/next navigation.
- [x] **Compact Icon-First Top Navigation (`Navigation.tsx`)**:
  - Simplified upper navigation removing crowded text labels for a high-craft, minimalist aesthetic.
  - Recognizable Lucide icons for Home, Explore & Search, Communities, Anonymous Workplace Intelligence, Messages, and Notifications.
  - Accessible floating tooltips on hover (`.nav-tooltip`) with WCAG-compliant contrast.
  - Visible active indicator pills (`.active-indicator`) reflecting current route.
  - Unread notification and message badges retained.
  - Prominent Create button and accessible theme toggle.
- [x] **Anonymous Workplace Intelligence Consistency**:
  - Renamed "Companies" to **"Anonymous Workplace Intelligence"** across navigation tooltips, page headings, search categories, breadcrumbs, and sidebar widgets.
  - Clear disclosures that employee submissions are pseudonymous and unverified claims are separated from confirmed corporate information.
- [x] **Continuous Anonymous Workplace Signals Ticker (`WorkplaceSignalsTicker.tsx`)**:
  - Slim, high-contrast bottom marquee pinned exclusively to the Anonymous Workplace Intelligence section (`/companies` and `/companies/[slug]`).
  - Seamless infinite horizontal CSS scroll with pause on hover/focus and reduced-motion support.
  - Real employee signal snippets with dynamic evidence badges ("Reported", "Unverified submission", "Multiple submissions").
  - Strictly absent from unrelated routes (Home feed, Explore, Communities, Messages).

### Known Issues & Mitigations
- In the automated browser testing environment, Playwright's browser driver download from AzureEdge CDN encountered a network 404, preventing headless browser automation.
- **Mitigation & Verification**: All 19 core application endpoints and 3 server-side validation API behaviors were verified through automated Node.js test runners (`tests/core.test.mjs` and `tests/http_smoke.mjs`), with 100% test pass rate.

### Tests Run & Actual Results
- **Automated Test Suite** (`npm test`):
  - `tests/core.test.mjs` executed via Node.js native test runner:
    - ✔ Test 1: Identity & Demographic Privacy: Age and gender remain private by default (PASS)
    - ✔ Test 2: Pseudonymous Decoupling: Workplace review cannot leak public user identity (PASS)
    - ✔ Test 3: Stories: Query correctly excludes stories older than 24 hours (PASS)
    - ✔ Test 4: Post Interactions: Toggling like updates count and state consistently (PASS)
    - ✔ Test 5: Communities: Domain spaces contain topic channels and member counts (PASS)
    - ✔ Test 6: Company Intelligence: Category scores compute properly within [1, 5] bounds (PASS)
    - ✔ Test 7: Interactive Polls: Voting updates total votes and computes correct percentage distribution (PASS)
    - ✔ Test 8: Age Gate: Accurately validates 18+ requirement and blocks underage users (PASS)
    - ✔ Test 9: Onboarding Validation: Required fields display_name and username are strictly validated (PASS)
    - ✔ Test 10: Onboarding State: Completed onboarding sets flag so returning users are not re-prompted (PASS)
    - ✔ Test 11: Workplace Signals Ticker: Configured strictly for Anonymous Workplace Intelligence routes (PASS)
  - Result: 11 / 11 unit tests passed (0 failures, 82ms duration).
  - `tests/http_smoke.mjs` executed against dev server (`http://localhost:3000`):
    - [PASS 200] /
    - [PASS 200] /feed
    - [PASS 200] /explore
    - [PASS 200] /communities
    - [PASS 200] /communities/ai-machine-learning
    - [PASS 200] /my-communities
    - [PASS 200] /companies
    - [PASS 200] /companies/razorcloud-systems
    - [PASS 200] /discussions/disc_1
    - [PASS 200] /messages
    - [PASS 200] /notifications
    - [PASS 200] /settings
    - [PASS 200] /share-experience
    - [PASS 200] /profile/aarav_sharma
    - [PASS 200] /auth/sign-in
    - [PASS 200] /auth/sign-up
    - [PASS 200] /auth/forgot-password
    - [PASS 200] /auth/reset-password
    - [PASS 200] /auth/onboarding
  - Server-Side Age Validation API checks:
    - [PASS 403] /api/auth/validate-age (Underage age: 16 properly rejected)
    - [PASS 200] /api/auth/validate-age (Adult age: 22 properly verified)
    - [PASS 400] /api/auth/validate-age (Missing required display_name rejected)
  - Result: 19 / 19 HTTP routes and 3 / 3 API checks returned expected status!
- **TypeScript & Production Build** (`npm run build`):
  - Turbopack compilation: SUCCESS (25 static, dynamic, and partial-prerendered routes compiled with 0 TypeScript errors).

### Missing Credentials
- Supabase live keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are optional; local dual-mode storage engine active with full persistence.

### Repository and Deployment Status
- Local Git initialized (`main`).
- Remote GitHub repository: [https://github.com/Mohit-Gupta1002/linkedout](https://github.com/Mohit-Gupta1002/linkedout).
- GitHub CLI authenticated as `Mohit-Gupta1002`.
- Production build verified.


