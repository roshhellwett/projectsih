# SETU — Visual Elevation Pass

Goal: keep the approved Institutional Precision direction, but raise the craft so the first glance reads as a modern, confident government digital service — polished enough to impress citizens, credible enough for officials.

Nothing about how the site works changes: same pages, same logins, same reports, votes, proposals, maps and exports.

## What will visibly change

1. **First screen (home)**
   - A stronger opening band: official emblem lockup, a clear one-line promise, and the three primary actions sitting immediately under it — report an issue, track a report, sign in by role.
   - A custom 3D illustration as the hero visual: a civic scene (village-to-city landscape with roads, water, school, solar, people) rendered in the Civic Forest palette so it feels made for this portal, not stock.
   - A live statistics strip (reports, resolved, institutions, districts) presented as crisp data tiles rather than plain text.
   - Service cards get real visual identity: a small 3D icon per service category (water, roads, health, education, agriculture, environment), quiet category tinting, clear supporting line, and a calm hover/press response.
   - A short "how it works" progression and a trust band (Government of Jharkhand, departments, audit trail) before the footer.

2. **3D illustrations and imagery**
   - A consistent set generated for this project: hero civic scene, six service icons, one illustration each for the four role sign-in paths, plus friendly empty-state art.
   - Single style across all of them: soft clay/isometric 3D, Civic Forest colours, matte finish, gentle shadows — warm but official, never cartoonish.
   - **All image files are saved inside the project repository** (`public/illustrations/`), committed with the code and synced to GitHub. Nothing is stored in external hosting or Lovable Cloud.

3. **Animations**
   - Hero: layered entrance — heading, subline, actions and illustration arriving in sequence, with a slow parallax drift on the illustration as the page scrolls.
   - Sections: reveal on scroll with a short rise-and-fade; statistics count up when they enter view.
   - Cards and buttons: lift, border-glow and press feedback; service icons give a small tilt on hover.
   - Navigation and dialogs: smooth mobile sheet transitions, animated bottom-nav active indicator, skeleton shimmer while data loads.
   - All motion is short, purposeful and fully disabled under "reduce motion"; nothing blocks reading or tapping, and nothing is heavy enough to slow a mid-range phone.

4. **Sign-in and registration**
   - Cleaner two-part layout: an institutional panel carrying the role illustration and reassurance points, and a focused, generously spaced form. Better role selection, clearer errors, visible progress while submitting.

5. **Role workspaces (citizen, university, industry/CSR, government)**
   - Consistent page headers with title, context line and primary action.
   - Upgraded metric tiles, status chips, filter bars and list rows so dense data reads quickly on a phone.
   - Proper empty, loading (skeleton) and error states everywhere, using the new illustration set instead of blank space.
   - Report detail sheet reworked: clear header, status timeline, and actions pinned within reach on mobile.

6. **Mobile first**
   - Every screen tuned at 360 and 390 px wide first: comfortable tap targets, bottom navigation with active state, sticky primary actions, no sideways scrolling, safe-area respected. Illustrations scale down or drop out where they would crowd the content.

7. **Consistency cleanup**
   - Remove the leftover styling from the previous "Malachite Night" system still living in the stylesheet so one single visual language governs the whole site.

## Technical notes

- Images generated to `public/illustrations/` (project-local, git-tracked); referenced by plain paths, `next/image` with width/height set, lazy-loaded below the fold. No external CDN, no cloud storage bucket.
- `app/globals.css`: prune obsolete glass/night rules below the token block; consolidate a single elevation, radius, spacing and state scale; add scroll-reveal, count-up, parallax, shimmer and tilt utilities, all guarded by `prefers-reduced-motion`.
- Animation approach: CSS transitions/keyframes plus IntersectionObserver for reveal and count-up — no new heavy animation dependency, keeping the bundle small for mobile.
- Shared components (`components/ui/*`): refine `card`, `button`, `badge`, `input`, `modal`, `shell`, `problem-row`, `stepper`, `toast`; add small `PageHeader`, `StatTile`, `Skeleton`, `EmptyState`, `Reveal` primitives so pages stop re-implementing them.
- Pages touched: `app/page.jsx`, `components/landing.jsx`, `app/login/page.jsx`, the four files in `components/portal/`, `components/GovHeaderFooter.jsx`.
- No changes to API routes, Supabase queries, auth, roles or URLs.
- Verification: Playwright passes over `/`, `/login`, and each portal at 360×800, 390×844, 768×1024 and 1280×800 with screenshots; contrast and keyboard focus checks; reduced-motion check; `bun test` must stay green.

## Out of scope

New features, new pages, data model changes, or a different colour/type direction.
