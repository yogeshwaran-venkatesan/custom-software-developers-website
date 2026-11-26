# PROJECT_GUIDE — Custom Software Developers website (Angular)

## What it is
The marketing site for **Custom Software Developers**: custom websites, AI apps and voice agents, iOS/Android apps, ERP/billing web apps and SaaS. The goal is enquiries via the contact page, email (customsoftwaredevlopers@gmail.com) and WhatsApp.

## Stack
- Angular 22: standalone components, OnPush, signals, zoneless, lazy-loaded routes.
- Static site: every route is **prerendered** at build time (`outputMode: static`, `RenderMode.Prerender` in `app.routes.server.ts`), hosted on Cloudflare Pages. 404 = prerendered `/404` page saved as `404.html`.
- SCSS. Fonts are self-hosted via @fontsource: Plus Jakarta Sans (display), Inter (body), JetBrains Mono (receipt, code, labels), Instrument Serif italic (the "dream" line).
- Design brief: `D:\New Folder\claude.md` (CLAUDE.md). Owner changes to it: accent is WARM AMBER (#F2A33A) instead of Laser Crimson; hero keeps the existing
  heading "You dream it. We engineer it."; the hero right side is the "live build" tab panel instead of a voice-wave sculpture; hero keeps a toned-down background photo.
- gsap 3 + ScrollTrigger and lenis, loaded lazily via MotionService.

## Structure
```
src/styles.scss                    design tokens (:root), base, .btn (--accent/--ghost/--wa/--sm), .card-dark, .section, .h-sec
src/app/core/site.config.ts        brand, email, WhatsApp number, MAIN_NAV, PRODUCT_LINK (Seettu Pro, footer only), services, legal links
src/app/core/seo.service.ts        description, canonical, OG, robots per route (from route data)
src/app/core/services.data.ts      the 5 services (letter, name, short, path, headline, summary, connects, deliverables, stack)
src/app/core/motion.service.ts     lazy GSAP + ScrollTrigger + Lenis (browser only); reduced motion (OS setting only) = no Lenis
src/app/app.routes.ts              all routes + title + SEO data (14 prerendered)
src/app/app.ts                     shell: skip link, header, <main>, footer, mobile bar
src/app/shared/brand-logo/         {/C} mark (public/img/logo-mark.svg: espresso tile, silver brace, amber slash, white C) + wordmark with W A M E S in the accent
src/app/shared/signature-line/     "CUSTOM SOFTWARE DEVELOPERS" (solid, or [hollow]=true for outlined), only W A M E S in the accent, font fitted to full width.
                                   Accent letters carry data-sig + data-sig-scope (hero|footer) so the services arc can lift them out
src/app/layout/site-header/        transparent over the home hero, glass after 24px scroll; nav in a floating pill; "Get a quote"; burger < 1024px
src/app/layout/mobile-bar/         sticky bottom bar < 768px: WhatsApp (only when number set) + Get quote
src/app/layout/site-footer/        sitemap (incl. Seettu Pro), contact, legal, full-width HOLLOW signature line (W A M E S solid amber)
src/app/pages/home/                hero: toned-down photo bg, kicker pill, "You dream it. We engineer it.", tag, sub, CTAs
                                   ("Bring Your Idea to Light" -> #scope, "Explore Live Demos" -> #preview), trust row, hero panel,
                                   HOLLOW signature line (scope hero; W A M E S solid amber overlay), fixed right-edge scroll rail (top / services / live demos / scope)
  hero-panel/      W A M E S tab panel: per tab a short config "code" file + a floating result card (website, AI call, app tracking,
                   invoice, SaaS dashboard) + "Build passed" / "Source code handed over" badges. Auto-cycles every 5.2s until a tab is
                   picked (pauses on hover/hidden tab; no auto-cycle with reduced motion). Sample content, no client names.
  sections/services-arc/   "Five core strengths. No limit to what we build." 5 cards on a shallow arc (middle highest, via margin-top --y).
                   Desktop + motion: scrubbed ScrollTrigger; the hero's accent letters fly into the card letters on a curved path
                   (x/y on different eases, rotation -8..+8 settling to 0), cards rise in, hero accent letters fade to 0.18
                   (source = transparent base letters [data-sig]; the visible solid overlay letters share data-sig-scope=hero).
                   Positions use offsetLeft/Top (layout, transform-free). Mobile: stacked cards with staggered reveal.
                   Selecting a card (click/arrows) shows "How it connects" + deliverables + link to the service page.
  sections/three-acts/     01 Workflow Discovery & Blueprint -> 02 Custom Engineering & AI Integration -> 03 Live Deployment,
                   Code Handover & AMC. Oversized numerals light up (accent) as each act scrolls in.
  sections/live-preview/   tabs: Barcode Billing & Inventory ERP (scan adds items, stock levels), AI Voice & Due-Date Reminder Agent
                   (waveform, transcript, call log with statuses), Mobile & Web App Portals (tap-through phone on paper surface). Sample data.
  sections/work-preview/   case cards: Business challenge / Custom architecture / Outcome. Two live demos (Surabhi Modules, Alan Global
                   Safety; concept builds, browser-frame visual) + one typical project. Replace typical items with real case studies.
  sections/scope-receipt/  capability ticker (marquee) + Live Project Scope Receipt: module + timeline toggles, optional name/notes;
                   #F5F2EB paper receipt updates live (indicative weeks per module, estimate = longest + 30% of the rest,
                   warning when tighter than the target, 100% SOURCE CODE OWNERSHIP: INCLUDED). Export: WhatsApp (if number set) / email.
                   Also used on /contact (ticker hidden). Module week ranges in MODULES: owner to confirm.
  sections/process-strip/  pinned 4-step scrollytelling, now used on /process only.
  sections/products/       Seettu Pro showcase, used on /products/seettu-pro only.
  (unused now: hero-scene/ (Three.js), quote-builder/, shared/hollow-name/ — safe to delete)
src/app/shared/page-hero/, cta-band/, faq/  inner-page building blocks (dark theme)
src/app/pages/...                  services, service-detail (W A M E S + saas), work, seettu, process, about, contact, legal, not-found
public/img/                        photos, Seettu Pro images, logo files
```

## Commands
Project folder: D:\New Folder\csd-web (run npm install on Windows; node_modules is not committed)
```
npm install
npx ng serve            # dev, http://localhost:4200
npm run build           # static output in dist/csd-web/browser (ng build + scripts/postbuild.mjs)
npx serve dist/csd-web/browser       # preview the static build locally (clean URLs + 404.html)
```

## Motion notes
- MotionService.isReduced() follows the OS setting only (prefers-reduced-motion, e.g. Windows "Animation effects").
  The footer "Animations on/off" switch and the hint were removed (26 Nov 2026). html.motion-on disables the global reduced-motion CSS kill-switch.
- Pinned section: process-strip (on /process). The home services arc is scrubbed, not pinned.

## Hero heading
- H1: "You focus on growth. We handle the code." (changed 26 Nov 2026 from "You dream it. We engineer it."). Plain h1 text, split into word spans (home.ts `lineA`/`lineB`); "growth." has the amber gradient.
- Load effect: each word rises out of its own mask (CSS `word-in`, 75 ms stagger). No word swapping. Static with prefers-reduced-motion.
- Zero layout shift: both lines are `white-space: nowrap` with font sizes capped by the h1 width (12.4cqi serif line, 10.3cqi bold line).
- Terminal line under the heading (replaced "Trust the blueprint. Own the future."): `// studio.mission — live_compile.ts` tag, then quotes typed in JetBrains Mono, starting empty about 1.6 s after load (once the heading words land). Quotes (home.ts `quotes`): Your vision is safe in our hands. / We bring your idea to life. We build what lasts. / Your trust is our responsibility. Type 45–75 ms, backspace 18 ms, hold 2.8 s, amber block cursor; pauses while the tab is hidden; reduced motion shows the first quote statically. All quotes are in an sr-only p; ghost copies reserve the height of the longest quote. Logic in `typewriter()` in home.ts.

## Slogans
- Header: "Build now. Grow forever." (SITE.slogan) under the wordmark via `<app-brand-logo [slogan]>`; small mono caps, hidden at 480px and below.
- Footer: "If you can imagine it, we can build it." (SITE.footerSlogan; written in site-footer.html with "we can build it." in amber, kept on one line).

## Hosting and domain
- Domain: customsoftwaredevelopers.in (bought at Spaceship, 26 Nov 2026). Nameservers dayana/earl.ns.cloudflare.com (Cloudflare free plan) for DNS and HTTPS. LIVE since 26 Nov 2026.
- Cloudflare DNS: apex = Worker custom domain; `www` AAAA 100:: (proxied) + Redirect Rule www → apex (301, query string kept); Always Use HTTPS on; TXT `v=spf1 -all` and `_dmarc` `v=DMARC1; p=reject;` (no email on this domain yet; change these if business email is added).
- Host: Cloudflare Workers (static assets, free), connected to GitHub repo yogeshwaran-venkatesan/custom-software-developers-website (branch main). Every push to main redeploys.
- Static output: angular.json `outputMode: "static"`; all routes prerendered (app.routes.server.ts `RenderMode.Prerender`). src/server.ts is no longer used.
- `npm run build` = `ng build` + scripts/postbuild.mjs, which turns `route/index.html` into `route.html` (Cloudflare serves it at `/route`, matching canonical URLs) and keeps the prerendered `/404` page as `404.html` (real 404 status).
- Cloudflare Workers build settings: build command `npm run build`, deploy command `npx wrangler deploy`, build variable `NODE_VERSION` = 22. wrangler.jsonc points assets at `dist/csd-web/browser`, uses 404.html for unknown URLs and serves `about.html` at `/about`.
- public/_headers: security headers + 1-year cache for hashed JS/CSS/media (Cloudflare; also read by Workers static assets).
- vercel.json: same setup for the Vercel test deployment (custom-software-developers-website.vercel.app): framework preset off (static), cleanUrls so `about.html` serves at `/about`, 404.html for unknown URLs, same headers. Vercel Hobby is non-commercial, so it is for testing only; production goes on Cloudflare Pages.

## SEO
- Share image public/img/og-image.jpg (1200x630) regenerated 26 Nov 2026 with the new heading; og:image:alt matches. Google Business Profile logo (720x720) and cover (1080x608) are in D:\New Folder\Claude outputs\business-profile (not part of the site).
- Google Search Console: Domain property customsoftwaredevelopers.in verified (26 Nov 2026) via Cloudflare auto TXT record `google-site-verification=...` (never delete it). Sitemap https://customsoftwaredevelopers.in/sitemap.xml submitted: Success, 13 pages.
- SeoService: per-route title/description, canonical, robots, Open Graph + Twitter card (og-image.jpg 1200x630), og:locale en_IN.
- JSON-LD: ProfessionalService + WebSite (site-wide); FAQPage (shared faq component); Service + BreadcrumbList (service detail). Page-level blocks are cleared on NavigationStart.
- index.html: lang en-IN, theme-color, SVG + ico favicons. sitemap.xml / robots.txt use SITE.siteUrl (customsoftwaredevelopers.in — confirm domain before launch).

## Performance
- Incremental hydration (`provideClientHydration(withIncrementalHydration())`). Home: hero panel and services arc `hydrate on idle`; three-acts, live preview, work, scope receipt `hydrate on viewport`.
- Hero text intro is transform-only CSS (no opacity fade) so LCP text paints at once.
- MotionService loads GSAP/ScrollTrigger/Lenis on the first scroll, wheel, touch, click or key press.
- PageSpeed Insights on the live site (https://customsoftwaredevelopers.in, 26 Nov 2026): mobile 100 / 100 / 100 / 100, desktop 96 / 100 / 100 / 100. Agentic Browsing: mobile 2/2, desktop 1/2 (to check).

## Design tokens
Canvas #0D0C0B (60%), cards #141312 with 1px #262422 hairlines, radius 24px. Paper #F5F2EB with ink #121110 (receipt, phone screen) (30%).
Accent warm amber #F2A33A, hover #FFB54F, text on amber #1A1205 (10%). Text #FFFFFF, secondary #CDCBCA, tertiary #8F8B86.
Legacy token names (--c-char, --c-alab, --c-ink, --c-line…) map to the dark theme so older components still work.
Logo: new {/C} mark in the site palette (26 Nov 2026): public/img/logo-mark.svg, also favicon.ico, apple-touch-icon.png, img/logo-mark-96.png. Owner decided (26 Nov 2026) to keep the mark as {/C (no closing brace). The old neon logo-mark.png / logo-full.jpg are unused leftovers; the share image is public/img/og-image.jpg.

## Milestones
1. ✅ Scaffold, fonts, tokens, header, mobile bar, footer, routes, SEO, sitemap/robots, approved static hero.
2. ✅ Hero motion + GSAP ScrollTrigger letter-drop (W A M E S) into the circular service arc (gsap.matchMedia: full on ≥1024px, card reveal on mobile), Lenis.
3. ✅ Live capability previews, work, process, guarantees + quote builder (WhatsApp/email).
5. ✅ CLAUDE.md redesign (26 Nov 2026): dark espresso theme + warm amber, hero panel, letter-extraction arc cards, 3 acts,
   live switcher update, work as challenge/architecture/outcome with live demos, ticker + Live Project Scope Receipt (home + contact).
4. ✅ Dedicated sub-pages (services overview + 5 service pages incl. new /services/saas, work, Seettu Pro, process, about, contact, privacy, terms), sitemap updated. 14 routes prerendered.

## Hidden for now (owner request, 26 Nov 2026)
- Client work: `FLAGS.showWork = false` in core/site.config.ts hides the home "Selected work" section, the Work link in the header
  and footer, and the case cards on /work (the /work page still exists but is unlinked and removed from sitemap.xml).
  To bring it back: set showWork to true and re-add /work to public/sitemap.xml.
- "See our work" button on the service pages is commented out in pages/service-detail/service-detail.ts.

## Open items
- Confirm the receipt's indicative week ranges (scope-receipt.ts MODULES).
- Delete unused components (hero-scene, quote-builder, hollow-name) and, if Three.js is no longer used, remove `three` from package.json.
- WhatsApp number: owner is getting a new business SIM; then set `SITE.whatsappNumber` (digits with country code, e.g. 91XXXXXXXXXX) and update the Google Business Profile phone too. Buttons stay hidden until set.
- Final domain: `SITE.siteUrl`, robots.txt, sitemap.xml (currently customsoftwaredevelopers.in as an assumption).
- Real projects for the Work section.
- Legal pages: plain-language drafts dated 25 Nov 2026; get them reviewed.
- "5+ years" claim in the home hero kicker: confirm it is accurate.
