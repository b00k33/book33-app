# Book33 — design rules (read before ANY UI change)
Also read ABOUT-ME.md before any work — build to this user's preferences.
Book33 is a single-file mobile web app (index.html). It must always look clean,
symmetrical, aligned and organized. Follow every rule, then re-check your work.
## Fit the screen
- Design for a phone ~360px wide. Nothing wider than the screen or overflowing.
- Any popup/dropdown/panel/menu MUST fit the visible screen; if taller, it
  scrolls inside itself and is NEVER cut off or off-screen. Respect safe areas
  (env(safe-area-inset-top/bottom)).
## Spacing & size (one scale, no random numbers)
- Only 4/8/12/16/24/32px for margins/padding/gaps. No 5/6/7/9/10/11/14/18/20px etc.
  (a 2026-08-13 audit found off-scale values outnumbering on-scale ones almost 60/40
  across the file — treat any literal px outside the scale as a bug to fix on sight,
  not just in new code).
- One corner radius for cards, one for pills. One type scale (title/body/label) —
  see Component reference below for the actual values.
- Minimum tap target 44px.
### Approved exception — mobile Day view (2026-08-16)
- Linh supplied an approved target stylesheet for the MOBILE DAY VIEW in a design
  session and asked for it verbatim ("it's the approved design"). It uses values off
  both scales on purpose: spacing/sizes 3/5/6/7/9/10/14/24/26/32/34/50px and type at
  9/9.5/10/11/11.5/12/12.5/14px including half-pixels. **Her approved values win** —
  a recent decision of hers supersedes an older rule. Do NOT round them back.
- Scope of the exception, and nothing beyond it: the `MOBILE DAY VIEW — LINH'S APPROVED
  DESIGN (2026-08-16)` block in index.html (one `@media (max-width: 1023px)` block plus
  the small `@media (max-width: 640px)` header block right after it). Everything it
  touches is listed in its own header comment: the mobile header row, the day-context
  chips, the command bar, the merged day-nav row, the two meters, the sleep note, the
  hour grid and the calendar blocks. The scale still governs every other page and every
  other width, including desktop.
- Two consequences of her sheet that ARE deliberate and should not be "fixed": chips are
  7px-cornered (not 999px) and the meter bars are 4px-cornered (not 999px) on that view.
- Known gap, measured, left as-is: her single-line block threshold is 28px but her
  two-line block needs ~33px at `--hour-h: 46px`. A 41–47 minute block therefore renders
  two lines in a slightly-too-short box. The NAME is protected (`flex: none` on
  `.tl-title`, so it never squeezes); the time line is what runs into the bottom padding.
  Raising the threshold from 28 to 33 in `renderTimeline()` closes it if she asks.

### Approved exception — mobile Body page (2026-08-16)
- Linh supplied `mobile-body-reference.html` (a side-by-side "now vs compact"
  mockup) and asked for the compact column verbatim as the approved design. Like
  her Day-view sheet, its class names (`.kpis`/`.kpi`/`.wchart`/`.legend1`/`.stack`)
  are LABELS for "what each part is", not selectors — every value is applied to this
  app's own real ids/classes.
- It uses type off the 38/20/13/11 scale on purpose: 7.5/8.5/9.5/10.5/12/14/16px.
  **Her approved values win** — a recent decision of hers supersedes an older rule.
  Do NOT round them back.
- Scope, and nothing beyond it: the `MOBILE BODY PAGE — LINH'S APPROVED COMPACT
  DESIGN (2026-08-16)` block in index.html (one `@media (max-width: 640px)` block),
  plus the `.zone-key-mini` default-hidden rule just above it. Every rule inside is
  scoped to `#healthPage` or its own ids **deliberately** — this page is built almost
  entirely from classes shared with Medical, Growth, Cycle, Work-manual, Fridge, Day
  and Today (`.h-card`, `.h-current`, `.section-head`, `.ideal-row`, `.chart-wrap`,
  `.zone-key`, `.h-add`, `.log-row`, `.h-empty`, and all of `.fast-*`). Never
  un-scope a rule in that block to a bare class.
- Deliberate, do not "fix": fasting goal chips stay at the 44px tap-target minimum
  even though her sheet draws them smaller — tap target beats visual density on a
  control she uses one-handed. The weight chart also keeps its natural SVG aspect
  (~100px tall, not her 64px): the chart is one `viewBox`-driven SVG, so forcing 64px
  would need `preserveAspectRatio="none"`, which squashes its dots into ellipses and
  distorts the axis text.

## Alignment & symmetry
- Equal left/right padding, balanced top/bottom. Items share one left edge and
  consistent columns. Label/value pairs aligned. Group related items evenly.
## Colours — Ink & Brass, one source of truth
- Use ONLY Ink & Brass variables (--ink*, --*-seed, --*-ink, --tl-*-bg,
  --accent-seed). Never hardcode a hex in a component. Works in dark AND light.
  Track colours come only from --*-seed. A hardcoded hex outside the :root block is
  always a bug, even one that "matches" a token's current value by coincidence —
  it silently breaks the moment that token changes or the theme switches.
## Component reference (concrete tokens — every page must match these)
Written 2026-08-13 from an audit of what the codebase already does BEST, not
invented fresh — most of these values already exist as the majority pattern
somewhere in the file. The point is picking ONE and applying it everywhere.
- **Card / box / panel radius**: `var(--radius-md)` (16px) — the standard for any
  card, row, or tappable container (an existing comment on the calendar-block CSS
  calls this "card language as every other tappable row in the app," which is
  exactly right — make it literally true everywhere). `var(--radius-sm)` (10px) is
  for things NESTED inside a card — inputs, small inline buttons, sub-rows.
  `var(--radius-lg)` (22px) is reserved for the outermost app shell / full-screen
  sheet only. Never a literal px value for a radius.
- **Pills, chips, tags, the primary "+ Add" button**: `border-radius: 999px` (fully
  round) — already the majority pattern (`.add-btn`, duration pills, category dots).
- **Card padding**: 16px all sides as the default recipe. Deviate only for a row
  short enough to need less (use 12px, never an odd value like 13/14/15px).
- **Type scale** (four sizes, nothing between):
  - Page title (`.bd-head h1`): 38px, `var(--font-display)`, weight 400.
  - Section header (`.section-head h2`): 20px, `var(--font-display)`, weight 400.
  - Body text: 13px, regular weight.
  - Label / caption / meta: 11px, `--ink-soft` or `--ink-faint`.
  - No half-pixel sizes (10.5/11.5/12.5px etc.) and no near-duplicate in-between
    sizes (10/12/14/15px) used as one-off tuning — round to the nearest scale step.
- **Buttons**:
  - `.btn-save` (primary Save inside an editor): 8px 20px padding, 13px font — this
    exact size everywhere. Don't shrink it per-page.
  - `.add-btn` ("+ Add X"): always the `+` glyph, never `✎` — a pencil means "edit
    an existing thing," not "create a new one." Reuse the shared class; never
    copy-paste its CSS into a page-scoped rule.
  - `.del` (delete icon button): one shared rule, not redeclared per container. If a
    page needs its own delete button, match `.del`'s own padding/size
    (`padding: 2px 5px; font-size: 15px`), not a fresh guess.
- **Section headers**: `.section-head` (h2 + gold rule) on every page,
  `margin-bottom: 16px` — not 6/8/10px depending on which page wrote it.
- **Empty states**: icon or short phrase + one line of `var(--ink-faint)` italic
  text at 13px, optionally a CTA if there's one obvious action to take — not six
  different sizes across a dozen near-identical page-scoped classes.
## Components
- Reuse the same button/pill/card/row styles everywhere; no one-offs — see the
  Component reference above for the actual shared values.
- Every editor for an event, task, routine, recipe, goal, person, family task,
  work-manual section, or shopping item MUST have a Save button in its TOP-RIGHT
  corner (reuse .addform-head-save), so it can be saved without scrolling to the
  bottom. Keep the bottom Save/Cancel bar too. (True for Events/Routines/Meal-log
  only as of 2026-08-13 — Recipe, Goal, Person, Family task, Work-manual section,
  and Shopping item editors were still missing it.)
## Before finishing
- Confirm every rule is met; check dark AND light; check nothing is cut off or
  overlapping at 360px.
