# Light Version CRO Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an isolated light-theme sales page at `/light` for CRO split-testing against the dark main page at `/`, with zero risk of breaking the production page.

**Architecture:** Clone the `/fast` version's component set into `src/components/versions/light/`, restyle all Tailwind classes from dark to a clean white/slate palette, add light-mode CSS background classes, and wire up `src/app/light/page.tsx`. No shared state or logic is added to any existing component — pure isolation.

**Tech Stack:** Next.js App Router, Tailwind CSS (brand tokens already in tailwind.config.ts), Framer Motion, globals.css custom background classes.

---

## Context & Audit Findings

The codebase already uses clone isolation for CRO variants:
- `/fast` → `src/components/versions/fast/`
- `/sprint` → `src/components/versions/sprint/`
- `/apply` → `src/components/versions/apply/`

**No dark/light theme contamination was found** in the current main page or globals.css. The previous agent did not leave behind broken theme state — the codebase is clean.

**Base for clone:** Use `/fast` version (most recent, includes VideoPlayer, FastHeroSection).

**Light palette mapping:**
| Dark (current) | Light (new) |
|---|---|
| `bg-brand-dark` (#0F172A) | `bg-white` or `bg-slate-50` |
| `bg-brand-navy` (#1E293B) | `bg-slate-100` |
| `text-white` | `text-slate-900` |
| `text-slate-300` | `text-slate-600` |
| `text-slate-400` | `text-slate-500` |
| `border-white/5` | `border-slate-200` |
| `bg-brand-dark/80` (nav) | `bg-white/80` |

Accents (`text-brand-green`, `text-brand-orange`, `text-brand-gold`, `text-brand-red`) read well on light — keep them as-is.

**Known CSS gotcha:** `body` has `background: var(--background)` = dark in globals.css. The light `<main>` uses `bg-white` which overrides this visually. Scroll overscroll edges may briefly show the dark body — acceptable for a CRO test.

---

## File Map

**Create (new files):**
- `src/components/versions/light/sections/` — 12 section files (cloned + restyled from fast)
- `src/components/versions/light/ui/` — 13 UI files (cloned + restyled from fast)
- `src/components/versions/light/ui/modal/` — modal screens (cloned from fast if present)
- `src/app/light/page.tsx` — route, imports only from `versions/light/`

**Modify (existing files):**
- `src/app/globals.css` — add light-mode background CSS classes (`.hero-gradient-light`, `.dot-grid-bg-light`, `.mesh-gradient-bg-light`, `.noise-vignette-bg-light`, etc.)

**Do not touch:**
- `src/app/page.tsx` — main page, untouched
- `src/components/sections/` — main components, untouched
- `src/components/versions/fast/` — fast version, untouched
- `src/lib/constants.ts`, `src/lib/pricing.ts` — shared, read-only from both versions

---

## Task 1: Clone fast sections into versions/light/sections/

**Files:**
- Create: `src/components/versions/light/sections/` (12 files)

- [ ] **Step 1: Copy all fast sections**

```bash
cp -r src/components/versions/fast/sections src/components/versions/light/sections
```

- [ ] **Step 2: Rename the hero file**

```bash
mv src/components/versions/light/sections/FastHeroSection.tsx src/components/versions/light/sections/LightHeroSection.tsx
```

- [ ] **Step 3: Rewire all internal imports (sections → light)**

In every file inside `src/components/versions/light/sections/`, replace:
```
@/components/versions/fast/
```
with:
```
@/components/versions/light/
```

Run this to do it in one pass:
```bash
find src/components/versions/light/sections -name "*.tsx" -exec sed -i '' 's|@/components/versions/fast/|@/components/versions/light/|g' {} +
```

- [ ] **Step 4: Verify no fast imports remain**

```bash
grep -r "versions/fast" src/components/versions/light/
```
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/components/versions/light/
git commit -m "feat: scaffold light version sections (clone of fast, imports rewired)"
```

---

## Task 2: Clone fast UI into versions/light/ui/

**Files:**
- Create: `src/components/versions/light/ui/` (13 files + modal/ subfolder)

- [ ] **Step 1: Copy all fast UI**

```bash
cp -r src/components/versions/fast/ui src/components/versions/light/ui
```

- [ ] **Step 2: Rewire all internal imports**

```bash
find src/components/versions/light/ui -name "*.tsx" -exec sed -i '' 's|@/components/versions/fast/|@/components/versions/light/|g' {} +
```

- [ ] **Step 3: Verify no fast imports remain**

```bash
grep -r "versions/fast" src/components/versions/light/ui/
```
Expected: no output.

- [ ] **Step 4: Build check** — catch any broken imports before styling

```bash
npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors related to `versions/light`.

- [ ] **Step 5: Commit**

```bash
git add src/components/versions/light/ui/
git commit -m "feat: scaffold light version UI components (clone of fast, imports rewired)"
```

---

## Task 3: Create src/app/light/page.tsx

**Files:**
- Create: `src/app/light/page.tsx`

- [ ] **Step 1: Create the route file**

Copy `src/app/fast/page.tsx` to `src/app/light/page.tsx` and make these changes:
1. Replace all `versions/fast` imports with `versions/light`
2. Replace `FastHeroSection` → `LightHeroSection`
3. Change the function name `Fast` → `Light`
4. Change `<main className="overflow-x-hidden"` → `<main className="overflow-x-hidden bg-white"`

Full file:
```tsx
"use client";

import { LightHeroSection } from "@/components/versions/light/sections/LightHeroSection";
import { NavCheckoutButton } from "@/components/versions/light/ui/NavCheckoutButton";
import { NavTrustBar } from "@/components/versions/light/ui/NavTrustBar";
import { ProblemSection } from "@/components/versions/light/sections/ProblemSection";
import { BridgeSection } from "@/components/versions/light/sections/BridgeSection";
import { OfferSection } from "@/components/versions/light/sections/OfferSection";
import { OutcomesSection } from "@/components/versions/light/sections/OutcomesSection";
import { ProcessSection } from "@/components/versions/light/sections/ProcessSection";
import { TrustSection } from "@/components/versions/light/sections/TrustSection";
import { PricingSection } from "@/components/versions/light/sections/PricingSection";
import { FAQSection } from "@/components/versions/light/sections/FAQSection";
import { FinalCTASection } from "@/components/versions/light/sections/FinalCTASection";
import { DeliverablesSection } from "@/components/versions/light/sections/DeliverablesSection";
import { TrustpilotWidget } from "@/components/versions/light/ui/TrustpilotWidget";
import { ExitIntentModal } from "@/components/versions/light/ui/ExitIntentModal";
import { CTAButton } from "@/components/versions/light/ui/CTAButton";
import { useScrollDepth } from "@/hooks/useScrollDepth";
import { useSectionView } from "@/hooks/useSectionView";
import { useConversionTracking } from "@/hooks/useConversionTracking";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/versions/light/ui/LanguageSwitcher";

const SECTION_IDS = ["hero", "problem", "why-now", "offer", "outcomes", "deliverables", "process", "trust", "pricing", "faq", "reserve"];

export default function Light() {
  useScrollDepth();
  useSectionView(SECTION_IDS);
  useConversionTracking();
  const { t } = useLanguage();

  return (
    <main className="overflow-x-hidden bg-white" id="main-content">
      {/* ── SKIP TO CONTENT ── */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-brand-green focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t("common.skip_to_content")}
      </a>

      {/* ── STICKY NAV BAR ── */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <span className="font-logo text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            rehabit<span className="text-brand-green">.ai</span>
          </span>
          <div className="hidden md:flex items-center">
            <NavTrustBar />
          </div>
          <NavCheckoutButton />
        </div>
      </nav>

      {/* ── SECTIONS ── */}
      <LightHeroSection />
      <div className="section-divider-blue" />
      <ProblemSection />
      <div className="section-divider-blue" />
      <BridgeSection />
      <div className="section-divider-green" />
      <OfferSection />
      <div className="section-divider-blue" />
      <OutcomesSection />
      <div className="section-divider-green" />
      <DeliverablesSection />

      <section className="bg-slate-50 px-6 py-10 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-green">{t("midCta.eyebrow")}</p>
          <p className="mb-6 text-xl font-bold text-slate-900 text-balance">
            {t("midCta.body")}
          </p>
          <CTAButton>{t("midCta.cta")}</CTAButton>
        </div>
      </section>

      <div className="section-divider-blue" />
      <ProcessSection />
      <div className="section-divider-blue" />
      <TrustSection />
      <div className="section-divider-green" />
      <PricingSection />
      <div className="section-divider-blue" />
      <FAQSection />
      <div className="section-divider-green" />
      <FinalCTASection />

      <TrustpilotWidget />

      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <LanguageSwitcher />
          <span>{t("footer.copyright", { year: new Date().getFullYear() })}</span>
        </div>
      </footer>

      <ExitIntentModal />
    </main>
  );
}
```

- [ ] **Step 2: Build check**

```bash
npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/light/
git commit -m "feat: add /light route wired to versions/light components"
```

---

## Task 4: Add light-mode background CSS classes to globals.css

The dark versions of these classes (`.hero-gradient`, `.dot-grid-bg`, etc.) are dark-specific. The light sections will use new `.hero-gradient-light`, `.dot-grid-bg-light`, etc. classes with softer, light-appropriate radial gradients.

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append light-mode background classes**

Add to the bottom of `src/app/globals.css`:

```css
/* ─── LIGHT THEME BACKGROUNDS ─── */

.hero-gradient-light {
  position: relative;
  overflow: hidden;
}

.hero-gradient-light::before {
  content: "";
  position: absolute;
  inset: -50%;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 60% at 20% 40%, rgba(16, 185, 129, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 70% 50% at 80% 60%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 50% 20%, rgba(249, 115, 22, 0.06) 0%, transparent 50%);
  background-size: 200% 200%;
  animation: gradient-shift 12s ease-in-out infinite;
}

.dot-grid-bg-light {
  position: relative;
  overflow: hidden;
}

.dot-grid-bg-light::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 60% 50% at 70% 60%, rgba(16, 185, 129, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 30% 30%, rgba(59, 130, 246, 0.04) 0%, transparent 50%);
}

.mesh-gradient-bg-light {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
}

.noise-vignette-bg-light {
  position: relative;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.problem-glow-bg-light {
  position: relative;
  overflow: hidden;
  background: #f8fafc;
}

.problem-glow-bg-light::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(239, 68, 68, 0.06) 0%, transparent 60%);
}

.trust-glow-bg-light {
  position: relative;
  overflow: hidden;
  background: #f8fafc;
}

.faq-glow-bg-light {
  position: relative;
  background: #f1f5f9;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add light-mode background CSS classes to globals.css"
```

---

## Task 5: Restyle light sections — dark → light palette

This is the most time-consuming task. Go through each section file and swap dark Tailwind classes for light ones.

**Priority order** (hero and pricing are highest-impact for CRO):
1. `LightHeroSection.tsx`
2. `PricingSection.tsx`
3. `ProblemSection.tsx`
4. `FinalCTASection.tsx`
5. All remaining sections

**Files:**
- Modify: All 12 files in `src/components/versions/light/sections/`
- Modify: Key UI files: `CTAButton.tsx`, `NavCheckoutButton.tsx`, `NavTrustBar.tsx`

**Find/replace reference for each file:**

| Find | Replace |
|------|---------|
| `bg-brand-dark` | `bg-white` or `bg-slate-50` (vary per section for rhythm) |
| `bg-brand-navy` | `bg-slate-100` |
| `text-white` | `text-slate-900` |
| `text-slate-300` | `text-slate-600` |
| `text-slate-400` | `text-slate-500` |
| `text-slate-500` | `text-slate-400` |
| `border-white/5` | `border-slate-200` |
| `border-white/10` | `border-slate-200` |
| `border-white/20` | `border-slate-300` |
| `bg-white/5` | `bg-slate-900/5` |
| `bg-white/10` | `bg-slate-900/10` |
| `hero-gradient` | `hero-gradient-light` |
| `dot-grid-bg` | `dot-grid-bg-light` |
| `mesh-gradient-bg` | `mesh-gradient-bg-light` |
| `noise-vignette-bg` | `noise-vignette-bg-light` |
| `problem-glow-bg` | `problem-glow-bg-light` |
| `trust-glow-bg` | `trust-glow-bg-light` |
| `faq-glow-bg` | `faq-glow-bg-light` |

- [ ] **Step 1: Restyle LightHeroSection.tsx**

Open `src/components/versions/light/sections/LightHeroSection.tsx` and apply the mapping above. Also:
- Change `className="hero-gradient bg-brand-dark ..."` → `className="hero-gradient-light bg-white ..."`
- Export name: rename `FastHeroSection` → `LightHeroSection`

- [ ] **Step 2: Run dev server and visually verify hero at http://localhost:3001/light**

```bash
npm run dev
```
Expected: white/light hero with green accent, no dark backgrounds bleeding through the hero.

- [ ] **Step 3: Restyle PricingSection.tsx**

Apply the same mapping. Pay special attention to card backgrounds — `bg-brand-dark` → `bg-white`, card borders → `border-slate-200`, "most popular" highlight → keep `border-brand-green` or `bg-brand-green/10`.

- [ ] **Step 4: Restyle ProblemSection.tsx**

Change section background class and all text colors. Pain-point icons (`text-brand-red`) stay red — that's intentional contrast.

- [ ] **Step 5: Restyle FinalCTASection.tsx**

This often has a dark/dramatic background. For light version: use `bg-slate-100` or a subtle green tint `bg-brand-green/5`.

- [ ] **Step 6: Restyle all remaining sections**

`BridgeSection`, `OfferSection`, `OutcomesSection`, `DeliverablesSection`, `ProcessSection`, `TrustSection`, `FAQSection`, `ApplyHeroSection`

- [ ] **Step 7: Restyle NavTrustBar.tsx**

Stars and text — swap `text-white` → `text-slate-700`, any dark pill backgrounds → `bg-slate-100 border-slate-200`.

- [ ] **Step 8: Commit after all sections done**

```bash
git add src/components/versions/light/
git commit -m "feat: apply light theme palette to all /light version sections and UI"
```

---

## Task 6: Visual verification pass

- [ ] **Step 1: Load each section at http://localhost:3001/light**

Scroll through the full page and check:
- No dark backgrounds bleeding through (no `bg-brand-dark` or `bg-brand-navy` left)
- Text is legible (dark on light — `text-slate-900` on `bg-white`)
- CTAButton green is visible (green on white is fine)
- Brand-red pain points visible
- Pricing card hierarchy is clear

- [ ] **Step 2: Mobile check**

In browser devtools, switch to 375px width. Confirm WebGL backgrounds don't render (light version inherits the same mobile WebGL disable logic) and CSS fallbacks are light-colored.

- [ ] **Step 3: Verify main page at http://localhost:3001 is untouched**

Load `/` — confirm it's still fully dark, no changes.

- [ ] **Step 4: Final commit and push**

```bash
git add -A
git commit -m "feat: complete /light CRO variant — isolated light theme sales page"
git push origin main
```

---

## Cleanup Notes (when test is over)

To delete the losing variant cleanly:
```bash
rm -rf src/components/versions/light/
rm -rf src/app/light/
# Remove light-mode classes from globals.css (clearly marked block)
```
Zero impact on main page or any other variant.
