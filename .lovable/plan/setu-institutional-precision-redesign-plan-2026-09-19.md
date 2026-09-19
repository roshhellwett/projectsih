# SETU Institutional Precision Redesign Plan

## Design mandate

Redesign SETU as a **mobile-first public-service gateway** that feels credible, calm, fast, and distinctly Jharkhand—not like a generic SaaS dashboard.

Locked direction:
- **Visual language:** Institutional Precision
- **Palette:** Civic Forest — `#123C31`, `#F7F8F3`, `#E39B2D`, `#177B71`, `#C9473D`
- **Typography:** Libre Baskerville for civic/editorial headings; IBM Plex Sans for interface text and data
- **Structure:** Service Gateway—primary tasks and current status first, supporting information second
- **Character:** compact information architecture, crisp borders, restrained elevation, meaningful status colour, minimal decoration

## What stays unchanged

- Existing authentication, data, AI assistance, voting, proposal, CSR, status, export, map, and real-time behavior
- Existing citizen, university, industry, and government role boundaries
- English/Hindi public identity and Jharkhand-specific content
- Existing URLs and core workflows

## Phase 1 — Foundation and reliability

1. Rebuild the visual token system around the locked palette, with accessible foreground, surface, border, status, focus, shadow, and dark/high-contrast values.
2. Replace the current display/body type system with Libre Baskerville and IBM Plex Sans while preserving Devanagari support.
3. Standardize spacing, section widths, icon sizing, controls, forms, badges, tables, alerts, empty states, skeletons, and focus states.
4. Reduce excessive rounded cards and nested containers; use clear page bands, data rows, and purposeful panels.
5. Resolve the current hydration mismatch and add the missing preview build command so visual work can be validated reliably.
6. Establish mobile rules: 44px minimum touch targets, safe-area spacing, no horizontal clipping, readable 16px inputs, and bottom-reachable primary actions.

## Phase 2 — Shared application architecture

### Public government header and identity
- Create a tighter official strip and compact SETU identity bar.
- Keep language, contrast, text-size, skip navigation, sign-in, and portal access easy to reach.
- On mobile, prioritize logo, language, and the main action; move secondary navigation into a clear menu.

### Portal shell
- Redesign the shared shell once, then apply it to all four role experiences.
- Desktop: restrained left navigation, compact page header, visible role identity, and dense but legible content area.
- Mobile: concise top bar plus thumb-friendly bottom navigation for the most-used destinations; secondary options in a sheet.
- Add consistent page titles, counts, live status, notifications, account access, and sign-out treatment.

### Reusable information patterns
- One grievance row system with mobile summary, desktop detail, priority, status, district, votes, owner, and clear next action.
- One detail surface for lifecycle, evidence, proposals, funding, and administrative transitions.
- Shared metric blocks, filter bars, timeline, form sections, confirmation states, modals, and empty/error/loading states.
- Role accents remain subtle; status meaning never depends on colour alone.

## Phase 3 — Public home gateway

Recompose the home page around immediate service access rather than a long marketing sequence.

1. **First screen:** government identity, SETU purpose, Report a Grievance, Track Status, role selector, and concise trust signals.
2. **Public service dashboard:** honest live metrics, active districts, resolution context, and a compact grievance feed.
3. **Role gateways:** Citizen, University, Industry/CSR, and Government, each showing its actual primary task and destination.
4. **How SETU works:** a concise five-stage case journey optimized as a vertical mobile timeline and horizontal desktop flow.
5. **District reach:** useful district status and filters, not repetitive decorative cards.
6. **Trust and architecture:** simplify technical claims into verifiable security, accessibility, privacy, and deployment information.
7. **Footer:** official ownership, accessibility, policies, contact/help, update timestamp, and essential links.

The first mobile viewport must expose the main citizen action and hint at the next service area.

## Phase 4 — Sign-in and registration

1. Make role selection the organizing principle rather than a secondary registration detail.
2. Mobile first: identity, role, sign-in/register tabs, fields, submit action, help, and demo access in a single calm flow.
3. Desktop: retain institutional context as a compact trust column without forcing the form below the fold.
4. Improve field hierarchy, password visibility, validation, required-state communication, busy states, and failure recovery.
5. Separate environment/setup notices from citizen-facing authentication errors.
6. Keep demo role access visually secondary but easy for evaluation.

## Phase 5 — Citizen experience

Design goal: **report and understand a grievance with minimal effort.**

- Dashboard: current cases, next expected action, nearby issues, and one dominant “Report issue” action.
- Reporting: break the form into short, comprehensible sections; improve photo, GPS, Hindi/English guidance, AI drafting, validation, and submission confirmation.
- Tracking: prioritize lifecycle stage, elapsed/SLA context, responsible institution, evidence, and updates.
- Civic map: use a list-first fallback and accessible filters on smaller screens; map remains an enhancement.
- Voting/support: clarify effect, pressed state, and community count without visual noise.

## Phase 6 — University experience

Design goal: **turn routed civic problems into credible, fundable research work.**

- Inbox: match quality, category, urgency, district, expected outcome, and eligibility visible before opening a case.
- Proposal workspace: structured problem brief, team, methodology, milestones, budget, AI drafting, review, and submission hierarchy.
- Submitted work: funding state, sponsor interest, next milestone, and administrative status at a glance.
- Statewide exploration: filters and scannable comparison without copying the citizen queue presentation.

## Phase 7 — Industry and CSR experience

Design goal: **evaluate impact and commit support with confidence.**

- Marketplace: comparison-oriented proposals with funding need, district, SDG alignment, university team, readiness, and impact.
- Commitment flow: transparent support type, scope, message, confirmation, and project status.
- Portfolio: committed amount, milestones, verification, institution contact, and outcome progress.
- Impact reporting: restrained evidence-led metrics suitable for CSR review; remove decorative or estimated values that can be mistaken for verified facts.

## Phase 8 — Government command experience

Design goal: **high-density oversight without sacrificing scan speed.**

- Master queue: sticky search/filter tools, active-filter summary, compact rows, clear SLA/priority markers, bulk-safe spacing, and reliable mobile filter sheets.
- Command dashboard: resolution, backlog, category, district, routing, proposal, and funding views arranged by decision priority.
- Audit trail: structured event rows with actor/channel/time/status, readable on mobile and export-friendly.
- Detail view: administrative status transitions made explicit, consequential actions separated, and full history preserved.
- Keep CSV export discoverable but subordinate to daily queue operations.

## Phase 9 — Cross-device precision and accessibility

Validate at minimum:
- 360×800 and 390×844 mobile
- 768×1024 tablet portrait
- 1024×768 tablet landscape
- 1280×800 laptop
- 1440×900 and wide desktop

Quality gates:
- No overlap, clipped labels, tiny controls, accidental horizontal scrolling, or content hidden behind navigation.
- Keyboard-complete navigation, visible focus, logical tab order, correct dialog focus, landmarks, labels, and announcements.
- WCAG AA contrast, reduced-motion support, high-contrast compatibility, and zoom up to 200%.
- Hindi and long English strings tested in headers, buttons, filters, cards, and forms.
- Empty, loading, error, offline/degraded, success, permission-denied, and large-data states are deliberately designed.

## Implementation sequence

1. Reliability fixes and design tokens
2. Shared controls, status language, and responsive shell
3. Public home gateway
4. Sign-in and registration
5. Citizen portal and grievance detail
6. University portal and proposal builder
7. Industry marketplace and commitment views
8. Government queue, dashboard, and audit trail
9. Footer, policy/trust surfaces, and final consistency pass
10. Automated checks plus screenshot-based mobile, tablet, and desktop review

Each page is completed and reviewed at all target widths before moving to the next role, while shared patterns are corrected globally rather than patched page by page.

## Completion criteria

- Every page has a distinct purpose and role-specific hierarchy while unmistakably belonging to one SETU system.
- A first-time mobile user can identify the main task within five seconds and complete it without desktop assumptions.
- All existing workflows remain functional.
- The hydration error and preview build failure are cleared.
- Final screenshots show consistent typography, spacing, controls, status patterns, and navigation across public, authentication, and all four role experiences.
