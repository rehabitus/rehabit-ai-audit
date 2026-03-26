# Daily Plan — March 26, 2026

## Objective
Ship conversion-focused updates safely in this order:
1. Change video/poster
2. Change headline
3. Update sections
4. Add split-testing headline rotation
5. Test attribution + lead flow + capture automation

## Execution Checklist

### 1) Change Video / Poster Image (60-90 min)
- [ ] Replace video source asset(s)
- [x] Replace poster image asset(s) (`/twin` and shared video player components)
- [ ] Verify on `/`, `/fast`, `/sprint`, `/apply`, `/twin` (as needed)
- [x] Validate mobile + desktop rendering (`/twin`, iterative visual QA)
- [x] Confirm no 404 assets in network tab (path audit script: no missing image refs)
- [ ] Confirm fallback behavior works

Definition of done:
- [x] New video/poster appears correctly on `/twin`

---

### 2) Change Headline (45-60 min)
- [x] Update primary headline copy in relevant versioned components (`/twin`)
- [ ] Keep one control headline unchanged for baseline
- [x] Validate line breaks and readability (`/twin`, iterative updates shipped)
- [x] Validate mobile + desktop rendering (`/twin`)

Definition of done:
- [x] Intended headline appears on `/twin` without regressions

---

### 3) Update Sections (90-120 min)
- [x] Apply section-level copy/layout updates (`/twin` use-case stack + pricing/guarantee/tech strip)
- [x] Confirm spacing and visual hierarchy (`/twin`, iterative visual QA)
- [x] Confirm CTA consistency (use-case CTAs now use shared `CTAButton`)
- [ ] Confirm no widows/orphans where possible (`text-balance` or `&nbsp;`)
- [x] Validate mobile + desktop rendering (`/twin`)

Definition of done:
- [x] Updated `/twin` sections pass visual QA

---

### 4) Split Testing Features — Rotate Headlines (120 min)
- [ ] Implement deterministic variant assignment (cookie/localStorage + query override) *(temporarily switched to random-per-refresh for testing)*
- [x] Define variant IDs (query variants `?hh=1..10`)
- [ ] Log exposure event with variant metadata
- [ ] Log CTA click + checkout start with variant metadata
- [x] Add safe fallback to random variant if unknown
- [x] Manual QA using query overrides

Definition of done:
- [ ] Variant can be forced via URL and all key events carry variant ID

---

### 5) Test Attribution, Lead-Flow, Automation Capture (120 min)
- [ ] Verify UTM persistence from landing to checkout
- [ ] Verify UTM + variant data in lead capture payload
- [ ] Verify lead destination write succeeds (DB/Notion/etc.)
- [ ] Verify automation triggers for:
  - [ ] New lead
  - [ ] Purchase
- [ ] Run 2-3 end-to-end test journeys and capture evidence

Definition of done:
- [ ] Attribution and automation are confirmed end-to-end

---

## Commit Rhythm (recommended)
- [x] Checkpoint 1: After Steps 1-2
- [x] Checkpoint 2: After Step 3
- [ ] Checkpoint 3: After Step 4
- [ ] Checkpoint 4: After Step 5

Suggested command sequence per checkpoint:
```bash
git pull --rebase origin main
git status --short
git add -A
git commit -m "clear message"
git push origin main
```

## Notes / Decisions
- [x] Keep this section updated as we make implementation decisions.
- Scope for this working session is `/twin` first; checklist items are marked done only where changes were implemented and pushed.
- Headline rotation is currently random on each refresh for testing; deterministic persistence will be restored before final go-live.
- Vercel preview deployed successfully after fixing `/twin` query parsing build issue (removed `useSearchParams` requirement).
