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
- [ ] Validate mobile + desktop rendering
- [x] Confirm no 404 assets in network tab (path audit script: no missing image refs)
- [ ] Confirm fallback behavior works

Definition of done:
- [ ] New video/poster appears correctly on all target routes

---

### 2) Change Headline (45-60 min)
- [x] Update primary headline copy in relevant versioned components (`/twin`)
- [ ] Keep one control headline unchanged for baseline
- [x] Validate line breaks and readability (`/twin`, iterative updates shipped)
- [ ] Validate mobile + desktop rendering

Definition of done:
- [ ] Intended headline appears on each target route without regressions

---

### 3) Update Sections (90-120 min)
- [ ] Apply section-level copy/layout updates (Problem, Offer, Outcomes, Trust, CTA)
- [ ] Confirm spacing and visual hierarchy
- [ ] Confirm CTA consistency
- [ ] Confirm no widows/orphans where possible (`text-balance` or `&nbsp;`)
- [ ] Validate mobile + desktop rendering

Definition of done:
- [ ] All updated sections pass visual QA

---

### 4) Split Testing Features — Rotate Headlines (120 min)
- [ ] Implement deterministic variant assignment (cookie/localStorage + query override)
- [ ] Define variant IDs (e.g. `A`, `B`, `C`)
- [ ] Log exposure event with variant metadata
- [ ] Log CTA click + checkout start with variant metadata
- [ ] Add safe fallback to control variant if unknown
- [ ] Manual QA using query overrides

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
- [ ] Checkpoint 2: After Step 3
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
