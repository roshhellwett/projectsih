# Indian Government Web Portal UI/UX Reference Document
## For SETU — Civic Grievance Portal, Smart India Hackathon

**Last Updated:** September 2026
**Context:** Next.js 14 + Supabase + Tailwind CSS portal for Jharkhand civic grievance management
**Goal:** Production-grade government portal UI — indistinguishable from real gov websites

---

## Table of Contents

1. [GIGW 3.0 Compliance Requirements](#1-gigw-30-compliance-requirements)
2. [UX4G Design System — Official Gov Component Library](#2-ux4g-design-system)
3. [Reference Portal Analysis](#3-reference-portal-analysis)
4. [Mobile-First UX for Indian Users](#4-mobile-first-ux-for-indian-users)
5. [Trust Signals & Government Branding](#5-trust-signals--government-branding)
6. [Grievance Portal UX Patterns](#6-grievance-portal-ux-patterns)
7. [Implementation Checklist for SETU](#7-implementation-checklist-for-setu)

---

## 1. GIGW 3.0 Compliance Requirements

**Source:** [guidelines.india.gov.in](https://guidelines.india.gov.in/gigw3) — formulated by NIC, MeitY

GIGW 3.0 is structured into four pillars: **Quality**, **Accessibility**, **Cybersecurity**, and **Lifecycle Management**. Each guideline has a Statement, Benefits, and required actions for government orgs, developers, and evaluators.

### 1.1 Quality Guidelines (Mandatory)

| # | Requirement | SETU Implementation |
|---|-------------|---------------------|
| Q1 | **National/State Emblem** displayed prominently on homepage in proper ratio and color | Jharkhand State Emblem in header, left-aligned, with proper alt text |
| Q2 | **Ownership information** on homepage and all entry pages — each page is standalone for ownership, navigation, context | Footer: "Content Owned by [Dept Name], Govt. of Jharkhand" on every page |
| Q3 | **Source attribution** for reproduced documents | Cite source for any external government documents |
| Q4 | **Copyright compliance** for third-party content | Copyright policy page linked from footer |
| Q5 | **Last updated/reviewed date** on homepage | Display "Last Updated: DD MMM YYYY" in footer or header |
| Q6 | **Downloadable material** must show title, size, format, usage instructions | All PDFs/downloads show: title, format icon, file size, instructions |
| Q7 | **Complete metadata** for circulars, notifications, schemes: title, language, purpose, validity | Structured display for all government orders/notifications |
| Q8 | **Archive outdated content** — no stale tenders, expired notices | Auto-archive mechanism for time-sensitive content |
| Q9 | **About Us section** with complete organizational information | Complete About page with department hierarchy |
| Q10 | **Contact Us page** with functionary details, linked from homepage | Directory with phone, email, postal address, office hours |
| Q11 | **Feedback mechanism** via online forms with timely response | Structured feedback form + response commitment |
| Q12 | **National Portal link** prominently on homepage; opens in new window | Link to india.gov.in in header utility bar or footer |
| Q13 | **Cross-browser testing** including Hindi/regional fonts | Test on Chrome, Firefox, Edge, Safari; verify Devanagari rendering |
| Q14 | **Help section** linked from all pages | Persistent Help link in header/footer |
| Q15 | **CSS-based layouts** with responsive design | Tailwind CSS responsive utilities; no table-based layouts |
| Q16 | **Readable without stylesheets** | Semantic HTML; content accessible when CSS disabled |
| Q17 | **Page titles + lang attribute + meta keywords/description** | Unique `<title>`, `lang="en"` / `lang="hi"`, meta tags per page |
| Q18 | **Minimum homepage content** as prescribed (see §1.3 below) | Full mandatory element checklist |
| Q19 | **Data tables with proper markup** | `<table>`, `<th>`, `<caption>`, `scope` attributes |
| Q20 | **Printable on A4** | Print stylesheet; `@media print` rules |
| Q21 | **Domain: .gov.in or .nic.in** | For hackathon: note in docs; production would use .gov.in |
| Q22 | **API integration** with India Portal, DigiLocker, Aadhaar SSO, MyGov, MyScheme | DigiLocker integration for document verification; Aadhaar-based auth |
| Q23 | **Consistent UX and visual identity** across all org websites/apps | Unified design system across web + potential mobile |
| Q24 | **Social media integration** | Share buttons; embedded feeds from official handles |
| Q25 | **Error-free language** — no spelling/grammar errors | Content review process; spell-check |

### 1.2 Accessibility Guidelines (WCAG 2.1 Level AA — 50 Criteria)

GIGW 3.0 upgraded from WCAG 2.0 to **WCAG 2.1 Level AA**, adding **17 new success criteria** for:
- Users with cognitive/learning disabilities
- Users with low vision
- Users with disabilities on mobile devices

**Critical accessibility requirements for SETU:**

| Category | Requirements |
|----------|-------------|
| **Text Alternatives** | Alt text for all images (1.1.1); captions for audio/video (1.2.1-1.2.5) |
| **Adaptable** | Programmatically determinable structure (1.3.1); meaningful sequence (1.3.2); no orientation lock (1.3.4 — NEW in 2.1); identify input purpose (1.3.5 — NEW) |
| **Distinguishable** | Color not sole means of info (1.4.1); **contrast ratio ≥ 4.5:1** for normal text, ≥ 3:1 for large text (1.4.3); text resize to 200% without loss (1.4.4); no images of text (1.4.5); **reflow at 320px** (1.4.10 — NEW); **non-text contrast ≥ 3:1** for UI components (1.4.11 — NEW); **text spacing override** support (1.4.12 — NEW); content on hover/focus dismissible (1.4.13 — NEW) |
| **Keyboard** | All functionality keyboard-operable (2.1.1); no keyboard traps (2.1.2); character key shortcuts configurable (2.1.4 — NEW) |
| **Timing** | Adjustable time limits (2.2.1); pause/stop/hide for auto-updating (2.2.2) |
| **Seizures** | No content flashing >3 times/second (2.3.1) |
| **Navigation** | Skip navigation link (2.4.1); descriptive page titles (2.4.2); logical focus order (2.4.3); link purpose clear from text (2.4.4); multiple ways to find pages (2.4.5); descriptive headings/labels (2.4.6); visible focus indicator (2.4.7) |
| **Input Modalities** | Pointer gestures have alternatives (2.5.1 — NEW); pointer cancellation (2.5.2 — NEW); label in name (2.5.3 — NEW); motion actuation alternatives (2.5.4 — NEW) |
| **Readable** | Page language declared (3.1.1); language of parts declared (3.1.2) |
| **Predictable** | No auto context change on focus (3.2.1) or input (3.2.2); consistent navigation (3.2.3); consistent identification (3.2.4) |
| **Input Assistance** | Error identification (3.3.1); labels/instructions (3.3.2); error suggestions (3.3.3); error prevention for legal/financial (3.3.4) |
| **Compatible** | Valid markup (4.1.1); name/role/value programmatic (4.1.2); status messages via ARIA (4.1.3 — NEW) |

### 1.3 Mandatory Homepage/Page Content Elements

**Based on GIGW 3.0 and DBIM (Digital Brand Identity Manual):**

#### Header (Top to Bottom):

```
┌─────────────────────────────────────────────────────────────┐
│ UTILITY BAR (primary brand color background)                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Skip to Main Content]  │  A-  A  A+  │  🌓  │  🌐 EN/हिं │ │
│ └─────────────────────────────────────────────────────────┘ │
│ MAIN HEADER BAR (white background)                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [State Emblem] Portal Name  │  Nav Links  │ 🔍 Login    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Utility Bar must contain:**
1. **Skip to Main Content** link (hidden until focused)
2. **Text Size Controls** — A−, A, A+ (three steps)
3. **Theme Toggle** — Light/Dark mode (high contrast)
4. **Language Selector** — Globe icon + language name + dropdown
5. **Government of India / State badge** (optional in utility bar, or in main header)

**Main Header must contain:**
1. **State Emblem/Logo** — proper ratio, with alt text
2. **Portal name** in both Hindi and English (or toggle)
3. **Primary navigation** links
4. **Search** functionality
5. **Login/Register** buttons
6. **Screen Reader Access** link

#### Footer (Mandatory Elements):

```
┌─────────────────────────────────────────────────────────────┐
│ FOOTER                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ COLUMN 1          │ COLUMN 2        │ COLUMN 3          │ │
│ │ About Portal      │ Quick Links     │ Connect            │ │
│ │ About Us          │ Sitemap         │ Contact Us         │ │
│ │ Related Links     │ Help            │ Social Media Icons │ │
│ │                   │ FAQs            │ Feedback           │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ POLICIES ROW                                            │ │
│ │ Terms & Conditions │ Privacy Policy │ Copyright Policy   │ │
│ │ Hyperlink Policy   │ Accessibility Statement             │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ BOTTOM BAR                                              │ │
│ │ "Content Owned by [Dept], Govt. of Jharkhand"           │ │
│ │ "Developed and hosted by NIC, MeitY, GoI"               │ │
│ │ Last Updated: DD MMM YYYY    │ Visitor Count: XXXXXXX   │ │
│ │                                                         │ │
│ │ [S3WaaS logo] [NIC logo] [Digital India logo]           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Footer mandatory elements (per DBIM + GIGW):**
1. **Website Policies:** Terms & Conditions, Privacy Policy, Copyright Policy, Hyperlink Policy
2. **Accessibility Statement** — link to screen reader access page
3. **Sitemap** link
4. **Help** link
5. **Feedback** link
6. **Contact Us** link
7. **Related Links / Archives**
8. **Social Media icons** (official handles)
9. **Content ownership line** — "Content Owned by [Department Name]"
10. **Developer/host credit** — "Developed and hosted by National Informatics Centre, Ministry of Electronics & Information Technology, Government of India"
11. **Last Updated date**
12. **Visitor counter** (common but optional)
13. **Logo strip:** S3WaaS, NIC, Digital India logos (linked to respective sites)

### 1.4 Lifecycle Management Requirements

| Requirement | Description |
|-------------|-------------|
| Nominated **WIM** (Website Information Manager) | Named responsible officer for content |
| **10 Mandatory Policies** | Copyright, CMAP, CAP, CRP, Hyperlink, Privacy, Terms, Website Monitoring Plan, Contingency Plan, Security Policy |
| **Bilingual** with prominent language toggle using **Unicode** | Hindi + English at minimum; Unicode (UTF-8) encoding |
| **Simultaneous multilingual updates** | Hindi and English versions updated together |
| **No broken links** — internal or external | Automated link-checking |
| **No "under construction" pages** | Every linked page must have content |
| **Documents in HTML or accessible formats** | Not scanned image PDFs |
| **Domain: .gov.in or .nic.in** | Mandatory for government portals |

### 1.5 Cybersecurity Requirements

| Requirement | Notes |
|-------------|-------|
| **CERT-In Security Audit** clearance before production hosting | Audit by NIC, STQC, or CERT-In empaneled vendor |
| **STQC Web Quality Certification** | Standardisation Testing and Quality Certification |
| **Safe-to-Host certificate** | Required before going live |
| **SSL/TLS encryption** | HTTPS mandatory |
| **Secure hosting environment** — CIA triad | Confidentiality, Integrity, Availability |
| **DPDPA 2023 compliance** | Digital Personal Data Protection Act for citizen records |

---

## 2. UX4G Design System

**Source:** [ux4g.gov.in](https://ux4g.gov.in/) — Official MeitY/Digital India design system for government

UX4G is the Government of India's official design system with **65 components**, WCAG 2.1 AA compliance, and Tailwind CSS equivalents.

### 2.1 Official Color Palette

#### Brand Colors (Primary Palette)

```
PRIMARY (Brand Violet — headers, primary actions, focus):
  50: #f2efff   100: #dcd4ff   200: #c0b3ff   300: #a391ff
  400: #8670ff  500: #6a4eff   600: #4a2bc2   700: #3d239f
  800: #301c7d  900: #24145c   950: #1a0e3d

SECONDARY (Warm Amber/Saffron — secondary accents):
  50: #fff5ea   100: #ffebd6   200: #ffd9af   300: #ffbe6f
  400: #e89c30  500: #c47d00   600: #a46800   700: #764a00
  800: #4b2d00  900: #281600   950: #110700

TERTIARY (Soft Purple — supporting accent):
  50: #f6effb   100: #e9daf3   200: #d9bfea   300: #c8a3e0
  400: #b686d6  500: #a66acc   600: #8e55b3   700: #75419a
  800: #5d2f80  900: #462166   950: #32174a
```

#### Semantic Colors

```
GREEN (Success):  500: #1aa64a   700: #006c35
RED (Error):      500: #f55e57   700: #b3251e
ORANGE (Warning): 500: #ffab27   700: #d46b08
CYAN (Info):      500: #59d8ce   600: #13c2c2
BLUE (Links):     500: #4e8ff8   700: #1157ce
```

#### Neutral Scale
```
White: #ffffff   50: #fafafa   100: #f5f5f5   200: #e5e5e5
300: #d9d9d9   400: #a1a1a1   500: #737373   600: #525252
700: #404040   800: #262626   900: #171717   Black: #000000
```

#### Color Accessibility Rules
- ✅ **DO:** Use Purple (#4a2bc2) on white for body text — 16.75:1 ratio
- ✅ **DO:** Ensure 4.5:1 minimum for normal text, 3:1 for large text
- ✅ **DO:** Use semantic tokens instead of raw hex values
- ✅ **DO:** Test with color blindness simulators
- ❌ **DON'T:** Use color alone to convey meaning
- ❌ **DON'T:** Use Saffron for body text (insufficient contrast)
- ❌ **DON'T:** Use light gray text on white backgrounds

### 2.2 Key Government-Specific Components (UX4G-only)

These components exist **only** in UX4G, not in Bootstrap or Material Design:

| Component | Purpose | Use in SETU |
|-----------|---------|-------------|
| **Accessibility Bar** | Font size, contrast, screen reader controls | Top utility bar |
| **Navbar (2-tier)** | Government utility bar + main navigation | Every page header |
| **Footer** | Government-mandated footer with policies | Every page footer |
| **Draft Status** | Show document/application status | Grievance status |
| **Feedback** | NPS/rating collection widget | Post-resolution feedback |
| **Input — Aadhaar** | Aadhaar number formatted input with validation | Citizen auth |
| **Input — OTP** | OTP entry with auto-advance | Mobile verification |
| **Input — PAN Card** | PAN formatted input | (If needed for CSR/Industry) |
| **Journey Timeline** | Multi-step process visualization | Grievance lifecycle |
| **Mega Menu** | Large dropdown for complex navigation | Department navigation |
| **Progress SLA Indicator** | SLA compliance timeline | Grievance resolution timeline |
| **Status Pipeline** | Multi-stage status visualization | Complaint routing pipeline |
| **Result List** | Structured search results | Search grievances/schemes |
| **Empty State** | Contextual empty content messaging | No results, first-time user |
| **Stepper** | Multi-step form wizard | Grievance filing flow |

### 2.3 UX4G Header Structure (Two-Tier)

```
TIER 1: UTILITY BAR
├── Height: 41px
├── Background: #613af5 (primary) — or state's brand color
├── Content width: max 1440px
├── Elements:
│   ├── Skip to Main Content (hidden until focused)
│   ├── NavbarTextSize (A−, A, A+) — shares store with Accessibility Widget
│   ├── NavbarThemeToggle (light/dark)
│   └── NavbarLanguage (globe + current lang + dropdown)
│       └── Languages: [{code: 'en', label: 'English'}, {code: 'hi', label: 'हिन्दी'}]

TIER 2: MAIN BAR
├── Height: 72px
├── Background: #ffffff (white)
├── Content width: max 1440px
├── Elements:
│   ├── NavbarBrand (logo + portal name)
│   ├── NavbarNav (primary navigation links)
│   │   └── NavbarLink (with active state + aria-current, optional hasMenu chevron)
│   └── NavbarActions
│       ├── Search button
│       ├── Login button (outlined)
│       ├── Signup button (filled)
│       └── NavbarToggle (hamburger, visible < lg breakpoint)
```

**Responsive:** Below `lg` breakpoint, navigation collapses behind hamburger, opens as stacked panel (not overlay — no focus trapping).

**Tricolour Badge:** `NavbarGovBadge` draws the Indian flag from a CSS theme token (no image asset needed). Saffron, white, green are **NOT retinted in dark mode** — flag colors are fixed.

### 2.4 Tailwind CSS Mapping

UX4G provides 1:1 Tailwind CSS equivalents for all 1,812 utility classes. For SETU on Tailwind:
- Use UX4G's color tokens as Tailwind `extend` values in `tailwind.config.ts`
- Map UX4G components to shadcn/ui equivalents where possible
- Reference: [indiacn.in](https://indiacn.in) — the shadcn-style component registry for UX4G + Tailwind

---

## 3. Reference Portal Analysis

### 3.1 DigiLocker (digilocker.gov.in)

**What it does well:**
- **Aadhaar-based SSO** — single identity, no separate registration
- **Document pull architecture** — citizens don't upload; issuers push verified docs
- **Clean card-based UI** — each document is a card with issuer logo, doc type, action buttons
- **Progressive disclosure** — dashboard shows summary counts, drill into categories
- **Mobile-first** — primary usage is mobile app (100M+ downloads)

**UI Patterns to adopt:**
- Card-based document/grievance listing
- Aadhaar OTP verification flow
- "Issued Documents" vs "Uploaded Documents" separation model → adapt as "Filed by Me" vs "Assigned to Me"
- Simple status badges (Verified ✓, Pending ⏳)

### 3.2 UMANG (umang.gov.in)

**What it does well:**
- **Service discovery** — 2,000+ services from 100+ departments organized by life event and category
- **Unified search** across all services
- **Category tiles** with icons on homepage
- **Service detail pages** with step-by-step how-to
- **Multi-language** support with runtime translation

**UI Patterns to adopt:**
- Service category tiles with icons (for SETU: "Report Issue," "Track Status," "View Dashboard," "CSR Opportunities")
- Search-first landing for returning users
- Scheme/service detail pages with eligibility + process steps

### 3.3 MyGov (mygov.in)

**What it does well:**
- **Citizen engagement** — tasks, discussions, polls, surveys
- **Gamification** — points, badges, leaderboards for participation
- **Campaign integration** — links to active government campaigns
- **Content-rich** — discussions, blog posts, media, live events

**UI Patterns to adopt:**
- Engagement counters ("XX,XX,XXX Submissions in XXXX Tasks" style)
- Discussion/forum features for community engagement around issues
- Campaign banners for awareness drives

### 3.4 Jal Jeevan Mission Dashboard (ejalshakti.gov.in)

**What it does well:**
- **Real-time data visualization** — national → state → district → village drill-down
- **Progress bars** — coverage percentage per state with color coding
- **Map-based visualization** — India map with state-wise coloring
- **KPI cards** — large numbers for households covered, connections provided
- **Data tables** with sorting and filtering
- **National Emblem** prominent in header

**UI Patterns to adopt for SETU admin dashboard:**
- Drill-down hierarchy: State → District → Block → Ward
- KPI cards: Total Grievances, Pending, Resolved, Average Resolution Time
- Map visualization of Jharkhand with complaint density
- Progress indicators for SLA compliance
- Color-coded status: Green (resolved), Amber (in progress), Red (overdue)

### 3.5 PM-KISAN Portal (pmkisan.gov.in)

**What it does well:**
- **Beneficiary status check** — single query field (Aadhaar/Mobile/Account)
- **Installment tracking** — clear timeline of payments with dates and amounts
- **Minimal form fields** — just enough to identify and serve
- **Multilingual** content and helpline numbers
- **Mobile app** (separate) with wireframe-simple screens

**UI Patterns to adopt:**
- Status check by single identifier (Complaint ID, Mobile Number)
- Timeline visualization for grievance stages
- SMS notification integration

### 3.6 e-Shram (eshram.gov.in)

**What it does well:**
- **Simple registration flow** — Aadhaar + Mobile OTP, minimal additional fields
- **UAN generation** — immediate unique identifier after registration
- **FAQ-heavy** — extensive help to reduce support burden
- **CSC integration** — Common Service Centres for assisted registration
- **Bulk registration** tools for organizations

**UI Patterns to adopt:**
- Aadhaar-first, minimal-field registration
- Immediate reference number generation after complaint filing
- FAQ sections to reduce repeat queries
- Assisted filing support (for CSC/ward office use)

### 3.7 CPGRAMS (pgportal.gov.in) — Primary Reference

**What CPGRAMS currently does:**
- National grievance system: 90+ ministries, 20 lakh grievances/year, 93% disposed
- 15-field form requiring citizen to identify correct ministry + category
- IGMS 2.0 (IIT Kanpur): AI-driven spam detection, semantic analysis, sentiment detection, auto-routing
- 74,000+ registered government users
- Tracks entire lifecycle with statutory timelines

**Problems CPGRAMS had (that SETU must avoid):**
- **60% abandonment rate** on the filing form
- Required citizens to know which of 90+ ministries owned their problem
- Required English or Hindi literacy
- Desktop-first form that broke on mobile
- Session timeout lost work in progress
- No conversational or guided filing

**CPGRAMS AI Chatbot redesign (cpgramsaichatbot.com) — key lessons:**
- **Infer the ministry** — never ask citizens to classify their own complaint
- **Detect language** instead of offering a language list
- **Speech-first** — accept voice input, reducing literacy barrier
- **One question at a time** — progressive disclosure over single-page forms
- **Show interpretation before filing** — "You're reporting: [summary]. Is this correct?"
- **Review card** before final submission
- Filing went from requiring 5 qualifications (literacy, ministry knowledge, categorization, desktop, speed) to **2** (speaking + confirming)
- Used **saffron as primary accent** — "the state's own colour" — a grievance tool that invented its own would look like it belonged to nobody
- **Left rail: history + new chat** — for returning users and session recovery on 2G
- **Samadhan Didi** mascot for guided onboarding

---

## 4. Mobile-First UX for Indian Users

### 4.1 Indian Mobile Context

| Factor | Data Point | Implication |
|--------|------------|-------------|
| **Mobile traffic share** | 78% of website traffic in India from mobile (StatCounter 2025) | Mobile-first, not responsive-afterthought |
| **Average connection** | Many users on 4G but with inconsistent speeds; 2G still exists in rural areas | Optimize for 3G baseline speed |
| **Screen sizes** | Dominant: 5.5"–6.7" Android phones; many budget devices | Target 360px width minimum |
| **Literacy** | Hindi-medium majority in Jharkhand; many not comfortable in English | Hindi-first UI with English option |
| **Digital literacy** | WhatsApp fluent but may not understand web form conventions | Conversational flows over complex forms |
| **Data costs** | Price-sensitive; data packs measured | Minimize payload; lazy load everything |

### 4.2 Low-Bandwidth Optimization

```
PERFORMANCE TARGETS (GIGW 3.0 implied):
├── First Contentful Paint: < 2s on 3G
├── Largest Contentful Paint: < 3s
├── Total page weight: < 500KB initial load
├── Images: WebP/AVIF with lazy loading
├── Fonts: System fonts + single Hindi web font (Noto Sans Devanagari)
└── JS bundle: < 200KB gzipped
```

**Tactics:**
- **Next.js ISR/SSG** for static pages (policies, FAQ, about)
- **Dynamic imports** for heavy components (maps, charts — admin-only)
- **Image optimization** via Next.js `<Image>` with responsive `sizes`
- **Service Worker** for offline capability on repeat visits
- **Skeleton screens** over spinners — show layout immediately
- **Prefetch** critical paths (filing form, status check)
- **CDN** with Indian edge nodes (Cloudflare, or NIC CDN for gov)

### 4.3 Hindi/English Bilingual Implementation

**Architecture:**
```
/locales
  /en
    common.json     // UI strings
    grievance.json  // Grievance-specific terms
    dashboard.json  // Dashboard labels
  /hi
    common.json
    grievance.json
    dashboard.json
```

**Implementation Rules:**
1. **Language toggle** — prominent in utility bar, globe icon + language name
2. **URL structure** — `/en/file-complaint` and `/hi/shikayat-darj-kare` (or query param `?lang=hi`)
3. **Bilingual content updates** must be **simultaneous** (GIGW mandate)
4. **Unicode (UTF-8)** encoding mandatory — `<meta charset="UTF-8">`
5. **HTML lang attribute** — `<html lang="en">` or `<html lang="hi">`, change dynamically
6. **Font stack** — `'Noto Sans Devanagari', 'Noto Sans', system-ui, sans-serif`
7. **RTL not needed** for Hindi (it's LTR), but text may be longer — allow flexible containers
8. **Hindi numerals** — use standard Arabic numerals (१२३ vs 123 — standard practice is Arabic)
9. **Machine translation fallback** — for user-generated content, show original + translation
10. **Placeholder text** in forms — bilingual: "अपना मोबाइल नंबर दर्ज करें / Enter your mobile number"

**Key Hindi UI term mappings for SETU:**

| English | Hindi | Transliteration |
|---------|-------|-----------------|
| File a Complaint | शिकायत दर्ज करें | Shikayat Darj Karein |
| Track Status | स्थिति देखें | Sthiti Dekhein |
| Dashboard | डैशबोर्ड | Dashboard |
| My Complaints | मेरी शिकायतें | Meri Shikayatein |
| Pending | लंबित | Lambit |
| Resolved | समाधान हुआ | Samadhan Hua |
| In Progress | प्रगति पर | Pragati Par |
| Submit | जमा करें | Jama Karein |
| Upload Photo | फोटो अपलोड करें | Photo Upload Karein |
| Location | स्थान | Sthan |
| Category | श्रेणी | Shreni |
| Ward | वार्ड | Ward |
| District | जिला | Jila |
| Block | प्रखंड | Prakhand |

### 4.4 Touch-First Design

- **Tap targets:** Minimum 44×44px (WCAG) — ideally 48×48px
- **Thumb zone:** Primary actions (File Complaint, Submit) in bottom-center reachable zone
- **Bottom navigation** on mobile for primary flows
- **Swipe gestures** only as enhancement, never sole interaction
- **No hover-dependent UI** — tooltips triggered by tap, not hover
- **Form inputs:** Large, full-width on mobile; native `type="tel"` for phone numbers, `inputmode="numeric"` for OTP

---

## 5. Trust Signals & Government Branding

### 5.1 National/State Emblem Requirements

**State Emblem of India (Ashoka Pillar Lion Capital):**
- Governed by **State Emblem of India (Prohibition of Improper Use) Act, 2005** and **Regulation of Use Rules, 2007**
- Central Government websites: **must display** on homepage
- State Government websites: should display **State Emblem**
- Must be in **proper ratio and colour** — never distorted, recoloured, or cropped
- Must have **alt text** for screen readers
- **Cannot be used as a clickable link** to external non-government sites
- Must be accompanied by portal name in English + Hindi

**For SETU (Jharkhand):**
- Display **Jharkhand State Emblem** in header
- Include "**झारखंड सरकार / Government of Jharkhand**" text next to emblem
- Below or beside: portal name "**SETU — सेतु**" with tagline
- National Emblem can appear in footer alongside NIC/government logos

### 5.2 Mandatory Government Branding Slots

Indian government portals typically include icons/logos for flagship programs. For SETU, relevant ones:

| Program | Logo Placement | Relevance to SETU |
|---------|---------------|-------------------|
| **Digital India** | Footer logo strip | Technology-driven governance |
| **Swachh Bharat** | Footer or sidebar | Civic cleanliness complaints |
| **Smart Cities Mission** | Contextual | Urban infrastructure |
| **Atal Mission for Rejuvenation (AMRUT)** | Contextual | Urban water/sewerage |
| **Jharkhand State logos** | Header | State identity |
| **NIC** | Footer | "Developed by NIC" credit |

### 5.3 Mandatory Policy Pages

Each of these must exist as a separate page, linked from footer:

1. **Accessibility Statement** — "This website conforms to WCAG 2.1 Level AA" + features list + screen reader compatibility table
2. **Screen Reader Access** page — table of supported screen readers (JAWS, NVDA, VoiceOver) with download links
3. **Terms & Conditions** — usage terms, disclaimer
4. **Privacy Policy** — data collection, storage, sharing, DPDPA compliance
5. **Copyright Policy** — content ownership, reproduction rules
6. **Hyperlink Policy** — external link disclaimers, criteria for linking
7. **Help** page — how to use the portal, FAQs, contact info
8. **Sitemap** — complete site structure as linked page

### 5.4 Visual Trust Indicators

```
TRUST SIGNAL CHECKLIST:
├── ✅ State Emblem in header (proper ratio + color)
├── ✅ "Government of Jharkhand" text in header
├── ✅ .gov.in domain (for production)
├── ✅ HTTPS padlock
├── ✅ "Last Updated" date visible
├── ✅ "Content Owned by [Department]" in footer
├── ✅ "Developed by NIC" credit (or relevant organization)
├── ✅ Digital India / state program logos in footer
├── ✅ Accessibility controls in utility bar (A-/A/A+, contrast, language)
├── ✅ Visitor counter (common on gov sites)
├── ✅ Official social media handles with verification
├── ✅ Published policies (Privacy, T&C, Copyright)
├── ✅ Helpline number (toll-free) prominently displayed
├── ✅ Physical address of relevant department
└── ✅ RTI information and Grievance Officer details
```

---

## 6. Grievance Portal UX Patterns

### 6.1 What Makes Citizens Trust a Grievance System

**Based on CPGRAMS analysis, DARPG research, and GRM best practices:**

1. **Immediate acknowledgement** — Reference number generated instantly upon filing
2. **SMS/WhatsApp notification** at every stage change
3. **Transparent timeline** — show SLA deadlines ("Must be resolved by: DD/MM/YYYY")
4. **No black box** — show which office/person is handling the complaint
5. **Status visibility** — real-time tracking like a delivery package
6. **Escalation path** — visible option to escalate if SLA is breached
7. **Response quality** — show the actual response from the officer, not just "Disposed"
8. **Satisfaction feedback** — allow citizens to rate the resolution
9. **Reopen mechanism** — if unsatisfied, allow re-filing with context preserved
10. **History preservation** — all interactions logged and visible to the citizen

### 6.2 Grievance Filing Flow (Optimal UX)

```
FILING FLOW (Progressive Disclosure — One Question at a Time):

STEP 1: WHAT HAPPENED?
├── Text input: "Describe the problem in your own words"
├── Voice input button (microphone icon)
├── Photo upload (camera icon — direct capture or gallery)
└── AI processes: extracts category, department, urgency

STEP 2: WHERE IS IT?
├── Auto-detect location (GPS)
├── Or: Pin on map
├── Or: Type address / landmark
├── Ward/Block auto-populated from location
└── Show location confirmation: "Is this correct?" with map preview

STEP 3: CONFIRM UNDERSTANDING
├── System shows: "You're reporting: [AI-generated summary]"
├── Category shown: "Broken Road → Public Works Department"
├── Priority: "Medium — Expected resolution: 7 working days"
├── User confirms or corrects
└── "This is correct" → proceed / "Let me clarify" → back to step 1

STEP 4: YOUR DETAILS
├── Mobile number (pre-filled if logged in)
├── OTP verification (if not logged in)
├── Name (pre-filled from Aadhaar if linked)
├── Optional: Email for detailed updates
└── Anonymous filing option (with limitations explained)

STEP 5: REVIEW & SUBMIT
├── Full complaint summary card
├── Photo thumbnails
├── Location on map
├── Category + department
├── Edit buttons for each section
├── "Submit Complaint" button (prominent, primary color)
└── Terms acknowledgement checkbox

STEP 6: CONFIRMATION
├── "Complaint Registered Successfully!" ✓
├── Reference Number: SETU-2026-XXXXX (large, prominent, copy button)
├── "You will receive updates on [mobile number]"
├── SLA: "Expected resolution by: [date]"
├── Track link: "Track status of your complaint"
├── Share on WhatsApp button (for awareness/forwarding)
└── "File Another Complaint" option
```

### 6.3 Grievance Tracking UX

```
STATUS TRACKING PAGE:

SEARCH BAR:
├── "Enter Complaint ID or Mobile Number"
├── Search button
└── OTP verification for mobile-based lookup

COMPLAINT CARD:
├── ID: SETU-2026-12345
├── Filed: 15 Sep 2026
├── Category: Broken Road
├── Location: Ward 12, Ranchi
├── Status Badge: [IN PROGRESS] (amber)
├── Currently With: Public Works Dept, Ranchi
├── SLA: 3 of 7 days elapsed [===>      ] 43%
└── Expand for full timeline

TIMELINE (Journey Timeline component):
├── ● Filed — 15 Sep 2026, 10:30 AM
│   └── "Complaint registered. Reference: SETU-2026-12345"
├── ● Classified — 15 Sep 2026, 10:31 AM
│   └── "AI classified as: Road Infrastructure → Pothole/Damage"
├── ● Assigned — 15 Sep 2026, 11:00 AM
│   └── "Assigned to: XYZ University, Dept. of Civil Engineering"
├── ● Acknowledged — 16 Sep 2026, 9:15 AM
│   └── "University has acknowledged the assignment"
├── ○ Site Survey — [Pending]
│   └── "Expected: 18 Sep 2026"
├── ○ Solution Proposed — [Pending]
├── ○ Funding Approved — [Pending]
├── ○ Work Started — [Pending]
├── ○ Resolved — [Pending]
│   └── "SLA Deadline: 22 Sep 2026"
└── [ESCALATE] button (appears after SLA breach)
```

### 6.4 Multi-Role Dashboard Patterns

#### Citizen Dashboard
```
┌────────────────────────────────────────────┐
│ Welcome, [Name]               [File New +] │
├────────────────────────────────────────────┤
│ MY COMPLAINTS                               │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │  3   │ │  1   │ │  5   │ │  12  │       │
│ │Active│ │Overdue│ │Resolved │ │Total│       │
│ └──────┘ └──────┘ └──────┘ └──────┘       │
│                                             │
│ [Recent Complaints List — card format]      │
│ [Track by ID — search bar]                  │
└────────────────────────────────────────────┘
```

#### University Dashboard
```
┌────────────────────────────────────────────┐
│ [University Name]          [Department ▼]   │
├────────────────────────────────────────────┤
│ ASSIGNED TASKS                              │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │  5   │ │  2   │ │  8   │ │ 87%  │       │
│ │ New  │ │Active│ │Completed│ │ SLA  │       │
│ └──────┘ └──────┘ └──────┘ └──────┘       │
│                                             │
│ [Task queue with priority sorting]          │
│ [SLA countdown timers]                      │
│ [Upload progress report]                    │
└────────────────────────────────────────────┘
```

#### Industry/CSR Dashboard
```
┌────────────────────────────────────────────┐
│ [Company Name]           [CSR Budget: ₹XX] │
├────────────────────────────────────────────┤
│ FUNDING OPPORTUNITIES                       │
│ [Browse verified projects needing funding]  │
│ [Impact metrics — lives impacted, ₹ spent]  │
│ [CSR compliance certificate download]       │
└────────────────────────────────────────────┘
```

#### Government Admin Dashboard
```
┌────────────────────────────────────────────┐
│ ADMIN OVERVIEW              [District ▼]    │
├────────────────────────────────────────────┤
│ KPI CARDS                                   │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │ 234  │ │  56  │ │ 89%  │ │ 4.2d │       │
│ │Today │ │Overdue│ │ SLA% │ │ Avg  │       │
│ └──────┘ └──────┘ └──────┘ └──────┘       │
│                                             │
│ [Jharkhand Map — complaint heat map]        │
│ [Category breakdown — bar/pie chart]        │
│ [Trend line — complaints over time]         │
│ [Officer performance table]                 │
│ [SLA breach alerts]                         │
└────────────────────────────────────────────┘
```

### 6.5 Notification Strategy

| Event | SMS | WhatsApp | Email | In-App |
|-------|-----|----------|-------|--------|
| Complaint Filed | ✅ Reference # | ✅ With track link | Optional | ✅ |
| Status Changed | ✅ | ✅ With details | Optional | ✅ |
| Assigned to University | ✅ | ✅ | Optional | ✅ |
| Resolution Proposed | ✅ | ✅ | Optional | ✅ |
| SLA Warning (1 day) | — | — | — | ✅ (admin) |
| SLA Breached | ✅ Citizen | ✅ Escalation | ✅ Admin | ✅ All |
| Resolved | ✅ + Feedback link | ✅ + Rate | Optional | ✅ |

---

## 7. Implementation Checklist for SETU

### 7.1 Phase 1 — Core Structure (Must Have)

- [ ] **Two-tier header** — utility bar (a11y controls + lang toggle) + main nav bar
- [ ] **State Emblem** in header with proper alt text
- [ ] **Government footer** with all mandatory elements (10 policy links, ownership, NIC credit, logos)
- [ ] **Skip to main content** link
- [ ] **Bilingual** — Hindi/English toggle with simultaneous content
- [ ] **Accessibility widget** — font size (A-/A/A+), high contrast toggle
- [ ] **Semantic HTML** — proper heading hierarchy, landmarks, ARIA
- [ ] **Responsive** — mobile-first, works at 320px
- [ ] **HTTPS** with proper SSL
- [ ] **Unique page titles** + meta tags + lang attributes
- [ ] **Breadcrumbs** on all pages
- [ ] **Contact Us** page
- [ ] **About Us** page
- [ ] **Help/FAQ** section

### 7.2 Phase 2 — Grievance System UX

- [ ] **Progressive filing form** — guided, one-step-at-a-time
- [ ] **AI classification** — infer category, never ask citizen to classify
- [ ] **Location capture** — GPS auto-detect + map pin + manual entry
- [ ] **Photo upload** — camera capture + gallery, compressed for low bandwidth
- [ ] **Instant reference number** generation
- [ ] **SMS notification** on filing
- [ ] **Status tracking** — by complaint ID or mobile number
- [ ] **Journey Timeline** — visual progress through stages
- [ ] **SLA Indicator** — visible countdown/deadline
- [ ] **Escalation mechanism** — visible, accessible after SLA breach
- [ ] **Satisfaction feedback** — post-resolution rating
- [ ] **Reopen mechanism** — if unsatisfied

### 7.3 Phase 3 — Multi-Role Dashboards

- [ ] **Citizen dashboard** — my complaints, stats, quick file
- [ ] **University dashboard** — task queue, SLA timers, progress reports
- [ ] **Industry/CSR dashboard** — funding opportunities, impact metrics
- [ ] **Admin dashboard** — KPIs, maps, charts, alerts, officer performance
- [ ] **Role-based access control** — Supabase RLS policies
- [ ] **Data export** — CSV/PDF for admin reports

### 7.4 Phase 4 — Trust & Polish

- [ ] **All 8 mandatory policy pages** created and linked
- [ ] **Screen Reader Access** page with compatibility table
- [ ] **Sitemap** page (HTML sitemap, plus XML for SEO)
- [ ] **Print stylesheet** — A4 printing support
- [ ] **Visitor counter** in footer
- [ ] **Last Updated** date on all pages
- [ ] **Social media integration** — share buttons + official handles
- [ ] **Error pages** — custom 404, 500 with government branding
- [ ] **Loading states** — skeleton screens, not spinners
- [ ] **Empty states** — contextual messaging with actions
- [ ] **Form validation** — inline errors with suggestions (WCAG 3.3.x)
- [ ] **Cross-browser testing** — Chrome, Firefox, Edge, Safari; Hindi font verification

### 7.5 Color System for SETU (Recommended)

Using UX4G as base, adapted for Jharkhand state identity:

```css
/* tailwind.config.ts extend */
colors: {
  /* Primary — State identity blue (Jharkhand uses deep blue) */
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',    /* Primary actions */
    800: '#1e40af',
    900: '#1e3a8a',
  },
  /* Saffron accent — for government identity */
  saffron: {
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
  },
  /* India Green — success states + national identity */
  green: {
    500: '#138808',    /* India flag green */
    600: '#166534',
    700: '#15803d',
  },
  /* Semantic */
  danger: '#dc2626',
  warning: '#f59e0b',
  info: '#0ea5e9',
  success: '#16a34a',
  /* Neutrals */
  surface: '#ffffff',
  background: '#f8fafc',
  muted: '#f1f5f9',
  border: '#e2e8f0',
}
```

### 7.6 Typography for SETU

```css
/* English + Hindi dual font stack */
fontFamily: {
  sans: [
    'Noto Sans',           /* English primary */
    'Noto Sans Devanagari', /* Hindi primary */
    'system-ui',
    '-apple-system',
    'sans-serif'
  ],
  heading: [
    'Noto Sans',
    'Noto Sans Devanagari',
    'sans-serif'
  ],
}

/* Type scale */
fontSize: {
  'xs':   ['0.75rem',  { lineHeight: '1rem' }],    /* 12px */
  'sm':   ['0.875rem', { lineHeight: '1.25rem' }],  /* 14px */
  'base': ['1rem',     { lineHeight: '1.75rem' }],  /* 16px — minimum body */
  'lg':   ['1.125rem', { lineHeight: '1.75rem' }],  /* 18px */
  'xl':   ['1.25rem',  { lineHeight: '1.75rem' }],  /* 20px */
  '2xl':  ['1.5rem',   { lineHeight: '2rem' }],     /* 24px */
  '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],  /* 30px */
  '4xl':  ['2.25rem',  { lineHeight: '2.5rem' }],   /* 36px */
}
```

**Note:** Minimum body text size is **16px** — prevents iOS zoom on input focus and ensures readability on mobile.

---

## Appendix A: Key Reference URLs

| Resource | URL |
|----------|-----|
| GIGW 3.0 Guidelines | https://guidelines.india.gov.in/gigw3 |
| GIGW 3.0 Manual (PDF) | https://cdnbbsr.s3waas.gov.in/s3c92a10324374fac681719d63979d00fe/uploads/2026/07/2026072438.pdf |
| GIGW Conformity Matrix | https://guidelines.india.gov.in/annexure-ii-matrix-to-check-conformity |
| GIGW Quick Tips | https://guidelines.india.gov.in/quick-tips |
| UX4G Design System | https://ux4g.gov.in |
| UX4G Developer Docs | https://docux4g.dl6.in |
| UX4G Tailwind Components | https://indiacn.in |
| UX4G Migration Guide | https://ux4g.gov.in/get-started/migration |
| DBIM (Digital Brand Identity Manual) | https://dbimtoolkit.digifootprint.gov.in |
| UXDT (NIC Design Guidelines) | https://uxdt.nic.in |
| CPGRAMS Portal | https://pgportal.gov.in |
| CPGRAMS AI Chatbot Case Study | https://aayushvisuals.com/work/cpgrams |
| CPGRAMS + IGMS 2.0 Analysis | https://socialprotectionai.org/use-case/IND-004 |
| DigiLocker | https://digilocker.gov.in |
| UMANG | https://umang.gov.in |
| MyGov | https://mygov.in |
| JJM Dashboard | https://ejalshakti.gov.in/jjmreport/JJMIndia.aspx |
| PM-KISAN | https://pmkisan.gov.in |
| e-Shram | https://eshram.gov.in |
| S3WaaS (Gov Website Platform) | https://s3waas.gov.in |
| WCAG 2.1 | https://www.w3.org/WAI/WCAG21/ |

## Appendix B: Government Font Resources

| Font | Use | Source |
|------|-----|--------|
| Noto Sans Devanagari | Hindi body text | Google Fonts (free, excellent coverage) |
| Noto Sans | English body text | Google Fonts |
| Mukta | Alternative Hindi font | Google Fonts |
| Tiro Devanagari Hindi | Formal Hindi documents | Google Fonts |

**Loading strategy:**
```html
<!-- Preload critical font weights only -->
<link rel="preload" href="/fonts/NotoSans-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/NotoSansDevanagari-Regular.woff2" as="font" type="font/woff2" crossorigin>
<!-- Load remaining weights async -->
```

## Appendix C: Accessibility Statement Template

```markdown
# Accessibility Statement

[Portal Name] is committed to ensuring digital accessibility for people
with disabilities. We are continually improving the user experience for
everyone and applying the relevant accessibility standards.

## Conformance Status
This website conforms to WCAG 2.1 Level AA. WCAG 2.1 Level AA
specifies requirements for web content accessibility.

## Accessibility Features
- Skip to main content link
- Consistent navigation across all pages
- Descriptive page titles and headings
- Text alternatives for all non-text content
- Sufficient color contrast (minimum 4.5:1)
- Resizable text up to 200% without loss of content
- Keyboard-accessible navigation
- Screen reader compatible
- Font size adjustment controls (A-, A, A+)
- High contrast mode toggle
- Bilingual content (Hindi and English)

## Compatible Screen Readers
| Screen Reader | Browser | Compatibility |
|---------------|---------|---------------|
| JAWS          | Chrome, Edge, Firefox | Full |
| NVDA          | Chrome, Firefox | Full |
| VoiceOver     | Safari (macOS/iOS) | Full |
| TalkBack      | Chrome (Android) | Full |

## Known Limitations
[List any known accessibility issues and remediation timeline]

## Feedback
If you encounter any accessibility barriers on this website,
please contact us:
- Email: [accessibility email]
- Phone: [toll-free number]
- Address: [physical address]

We aim to respond to accessibility feedback within 2 business days.
```

---

*This document was compiled from official GIGW 3.0 guidelines, DBIM manual, UX4G design system documentation, CPGRAMS case studies, and analysis of production Indian government portals.*
