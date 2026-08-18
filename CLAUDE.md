# Book33 — design rules (read before ANY UI change)
Also read ABOUT-ME.md before any work — build to this user's preferences.
Book33 is a single-file mobile web app (index.html). It must always look clean,
symmetrical, aligned and organized. Follow every rule, then re-check your work.
## design44 — the standing design system (Linh's own words, 2026-08-16)
Book33's standing design system — the design requests Linh keeps making. When she says
"design44" (e.g. "apply design44"), follow ALL rules below. Claude Code reads this on
every change and applies it by DEFAULT to every new screen and edit (desktop AND mobile
unless a rule says otherwise). Before 2026-08-16 this existed only as 23 scattered
inline citations in index.html with no written definition — this section is now the
single source; cite it, don't re-derive it from a code comment.

### 1. Compact & dense
Tight, dense layouts by default — short rows, small section gaps, small uppercase labels,
no tall pills with empty middles. Spacing scale only: 4/8/12/16/24/32px. "Tessellate":
pack related controls together as tiles in a 12-column grid, not a full-width vertical
stack. Narrow items (sub-tasks, chips) go two+ per row.

### 2. Not too wide — cap & center
Nothing edge-to-edge. Centered columns: `--content-max:720px` (forms/reading),
`--wide-max:1040–1160px` (tables/dashboards). Container `max-width; width:100%; margin:0
auto`. Form fields must not stretch full screen. Any "too wide" → add max-width + margin
auto.

### 3. Succinct, not cluttered — scannable at a glance
Aligned grids/tables over scattered full-width rows (trackers = one grid, rows=trackers,
cols=days, small marks). Light not loud: colour dot + text on subtle bg, not big saturated
pills. Dim/strike done items. Cap visible items then "+N more". Today tinted gold as an
anchor in every view.

### 4. Flat design + Black & Brass
Separate with colour + space, not boxes/borders/nested boxes. Night palette (2026-08-16,
supersedes the old "Ink & Brass" browns — Linh: "change the brown to black, dark black"):
bg #000000, surface #0D0D0D, raised #161616, recessed #0A0A0A — a flat NEUTRAL (R=G=B, no
warm mix) staircase, not a dark tint. ink #efe7d6, muted #9c8f79, faint #5f5645 (unchanged
— only the surfaces under them went black). gold #d8b979, bright gold #EAC24E stay the
app's one signature colour ("Brass" survives; only "Ink" the brown did not). Stars are
plain white (#FFFFFF), not the old blue-grey/gold mix. Day mode is untouched — see its own
palette map further down. Gold for numbers/accents; colour = category.

### 5. Proportional & aligned
Calendar: one fixed SCALE (--hour-h) — blocks are always sized to real duration and
snapped to hour lines off that one scale, overlaps split into side-by-side columns, and
everything aligns to a shared grid/column edge. Row HEIGHT itself is not uniform, by
design, on two layered rules (2026-08-18 supersedes the old "every hour same height, no
auto-fit rows" wording, which predates both): an empty hour compacts down to fit no
content (`computeCompactHours`/`compactH()`, 2026-08-04) while a busy hour stays full
height, and on top of that, five fixed clock times get their own floor regardless of
content — Best/2nd Best/💰 Money hours (`POWER_HOURS`) floor at 80px, Worst/2nd Worst
floor at 28px, both via `hourRowH()`. Both are floors, never caps — a real event's block
height still comes only from its own duration and is never constrained by its row.

### 6. Consistency
One component identical everywhere (button, chip, card, dropdown, toggle). Reuse existing
components/variables; no one-offs.

### 7. Interaction
Anything representing a page (fasting bar, summary strip) is tappable → navigates there.
Whole element is the tap target; cursor:pointer + hover/press; keyboard accessible. Mobile
tap targets ≥ ~24px.

### 8. Mobile vs desktop
Density/tessellation is a desktop/wide gain. Under @media (max-width:640px) collapse to a
clean single column; never leave mobile cramped; never change a working mobile layout when
the request is about desktop.

### 9. Every code change (workflow)
Commit and push to main automatically (no waiting for approval), EXCEPT confirm before
deleting existing data. After each change, report what changed + the one-line undo command.

### Where design44 and the older rules below disagree — precedence
design44 is the general standard. The rules further down are the detailed component
reference. Four genuine conflicts exist; resolve them this way, and do NOT "fix" either
side back:
- **§2 cap-and-center vs full-bleed pages.** Two escalating decisions, both Linh's:
  (a) 2026-08-16 morning — the desktop Day page goes full-window (`[data-desk-day1]
  .wrap[data-view="day"] { max-width: none }` + the day-max toggle). (b) 2026-08-16
  later — she extended it to EVERY page: "make EVERY page drop the floating framed-card
  look and fill the full browser width — flat, edge-to-edge." The `.wrap` caps
  (--wide-max + habits/money per-view) and `.page`'s radius/shadow/gold-glow frame are
  gone at all widths. §2 now governs INNER content only: forms, editors and tables
  (.add-form, routine/money editors, etc.) keep their own max-widths so fields never
  stretch — the page CANVAS itself is full-bleed. Don't re-add a page-level cap.
- **§7 "tap targets ≥ ~24px" vs "Minimum tap target 44px" below.** design44 is the newer
  statement and is the floor now. 44px remains the preferred size for a primary control
  she uses one-handed; anything between 24 and 44 is acceptable rather than a bug.
- **§1 spacing scale vs the four approved exception blocks** (mobile Day view and mobile
  Body page, both dated 2026-08-16; mobile Routines, dated 2026-08-17; `.dp-t-row` dense
  list rows, dated 2026-08-18; all documented below). The first two are stylesheets she
  approved verbatim; Routines and `.dp-t-row` are Claude's own judgment call under her
  explicit pre-authorization to go off-scale if needed. All four
  win inside their own scope only.
- **§3 "Today tinted gold in every view"** vs the §3-fasting spec that removed the Day
  grid's today gold wash. Unresolved — ask before re-adding the wash to the day grid;
  it reads as a real conflict, not an oversight.

### Palette note — design44's names vs the app's real tokens
§4's hexes are Linh's mockup vocabulary, not all of them literal app tokens. §6 says reuse
variables and never one-off, so map, don't paste:
`gold #d8b979` → `var(--cosmic-gold)` · `bright gold #EAC24E` → `var(--gold-bright)` ·
`ink #efe7d6` → `var(--dl-day)` (nearest live token; the app's body ink is
`var(--ink)` #F0E6D4) · `muted #9c8f79` → `var(--dl-small)` · `faint #5f5645` →
`var(--dl-sep)` · `hairline rgba(216,185,121,.10)` → `var(--note-line)`.
A raw hex from §4 pasted into a component is still a bug by §6.

## book33-support-rules — the standing support system (Linh's own words, 2026-08-16)
Translates her own profile into concrete, enforceable rules — the same role design44
plays for visual design, but for STRUCTURE and FUNCTION. Claude Code reads this on every
change and applies it by DEFAULT, not only to screens that mention essentials by name.
When a request conflicts with one of these, say so — same as the existing "flag conflicts
with design44" rule. Full reasoning: book33-human-profile-code44.md and
book33-support-design-rules.md, when those exist in the project — as of 2026-08-16 they
aren't committed here, so treat this section as the complete, standalone statement of the
rules, not a summary of something else to go read.

### 1. One tap, always
Any done/skip/log action — essential, routine, habit, quick log — is ONE tap. No
confirmation dialog for anything reversible (nearly everything here; undo instead of
confirm-before). A miss in the moment ("low energy, can't start it right now") competes
directly with every extra tap a flow adds. (This is about the APP'S OWN UI toward Linh —
separate from, and doesn't loosen, Claude Code's own standing rule to confirm before
risky actions it takes itself, like deleting data or force-pushing.)

### 2. No failure states, ever
A missed essential or routine is never styled as a failure — no red, no "you didn't," no
streak-breaking guilt language, no badge that reads as a scold. Faint/neutral, always
resumable, always loggable late. Non-negotiable, not a tone preference: shame teaches
avoidance of the app, which defeats the point of it existing. Applies everywhere
done/not-done is shown — Today's progress, streaks, the habit grid, the Daily Check-in,
Growth page, all of it.

### 3. Don't make her hunt
Anything time-sensitive or important surfaces WHERE SHE IS, not only on the page that
"owns" it — she won't reliably remember to go check a separate page for something she
isn't actively thinking about. Essentials visible from the main Today view, not nested
behind tap-to-expand only; gap-reminders (nothing scheduled this week) surface
proactively, not only if she happens to open Routines and notice. When in doubt, surface
it rather than filing it one level deeper.

### 4. Real interruption for essentials, quiet for everything else — two tiers
Essentials (sleep/eat/shower/teeth/water/medication) get real notifications —
sound/vibration, escalating/repeating until acknowledged (open notification-infrastructure
question — see book33-daily-checkin-concept.md if/when it exists in the project). Ordinary
routines and habits stay passive — visible when she opens the app, no push, no escalation.
Keep the two tiers distinctly different in how loudly they behave, not just in list
position: mixing them either makes essentials easy to miss (too quiet) or turns the whole
app into noise (too loud).

### 5. Consistency is executive-function support, not polish
One component identical everywhere isn't just visual tidiness — every place an
interaction pattern differs is a small relearning cost at a moment attention may already
be thin. This raises §6 above from should-do to must-do here: a page-specific one-off
button/toggle/card pattern is a bug, not a style nit, exactly like a stray hex colour
outside the design tokens is already treated as a bug on sight.

### 6. Zero-effort starting point
Smart defaults everywhere a form or log appears — today's date pre-filled, the last-used
value suggested, quick-tap chips over typing. Starting to log something should cost
nothing to think about, because "what do I even put here" is itself a barrier at low
energy. Never require re-entering something the app already knows — reapply ABOUT-ME.md's
existing rule specifically to essentials and quick-log flows, where it matters most.

### 7. Time-blindness support: show elapsed/remaining, don't make her do the math
Wherever relevant, show "how long since" or "how long until," not just a raw clock time
she has to compare against her own sense of time (which isn't reliable for her). The
fasting timer counting up is the existing pattern — extend it to essentials: "4h since
water," "since 8am" on an unlogged breakfast, rather than only a bare timestamp.

### 8. A miss is data, not a dead end
When an essential or routine goes unlogged for the day, it doesn't vanish at midnight —
it stays loggable late ("log it for earlier today" / backdate) and stays visible as
still-open rather than silently disappearing. Catching up after a gap should never be MORE
effortful than logging on time would have been — that's exactly when the lowest-friction
path matters most.

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
- One consequence of her sheet that IS still deliberate and should not be "fixed": chips
  are 7px-cornered (not 999px) on that view.
- 2026-08-18 (Day-view top redesign, "stat boxes instead of thin line bars") SUPERSEDES
  this exception's meter-bar radius specifically: the meters are no longer a thin
  label-bar-value row but a vertical stat box (uppercase tinted label, big bold value,
  a thick pill-radius bar) — see `.dcx-meter`/`meterHtml()` in index.html — and that
  shape applies at every width, this mobile exception included. The 4px-cornered thin
  bar this bullet used to describe no longer exists anywhere in the file.
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

### Approved exception — mobile Routines page (2026-08-17)
- Linh: "shrink overall text size in mobile version for routines page, and reduce
  space between lines" — scope confirmed as "everything on the page", magnitude as
  "as small as still comfortably readable" (Claude's judgment call, not a supplied
  stylesheet like the two exceptions above), "reduce space between lines" confirmed
  as BOTH padding and line-height, and she explicitly pre-authorized going off both
  scales if the target required it — same standing precedent as the Day-view/Body-
  page exceptions. **Her authorization stands even though the values were judgment,
  not dictation** — do not round these back to 11/13/20/38 without asking first.
- Built in two passes: a sibling session shrunk the Cards view first ("Linh, 'shrink
  it for mobile' round", commit `5b66ca5`) — Table view (`.rn-*` nested rows), the
  flat sortable table (`.rtg-tbl`), Chains cards and the Add/Edit editor were shrunk
  to match in the follow-up pass so all four surfaces read as one consistent scale
  (§6), plus a line-height layer added on top of the Cards-view pass since that
  commit only touched font-size/padding.
- Values used, off both scales on purpose: type at 8.5/10/10.5/11/11.5/12px
  (including half-pixels), padding/gaps at 1/2/3/6/10px, line-height 1.2–1.3.
- Scope, and nothing beyond it: every rule inside `#routinesPage`'s
  `@media (max-width: 640px)` blocks (the "ROUTINES · MOBILE" block and its
  "Your exact sizes"/2026-08-17 follow-on rules), `#rtnGrid .rtg-tbl`'s
  `@media (max-width: 640px) and (orientation: portrait)` block, the `.chain-row`
  mobile block just below its base rule, and `#rtnAddForm`'s mobile blocks (field
  text/labels/hints, `.rtn-repeat-*`, `.rtn-add-time-btn`, `.rtn-remove-time-link`,
  `.rtn-sectitle`, sub-task text, duration readouts). The scale still governs every
  other page and every other width, including Routines desktop.
- Deliberate, do not "fix": every 44px/40px/36px tap target the 2026-08-17 "simplify
  the editor" and earlier passes established (fields, sub-rows, add-time button,
  repeat-sum, `.chain-unlink`) is untouched — this pass is font-size/line-height/
  internal padding only, never a tap-target shrink, same split the Body-page
  exception already established.

### Approved exception — `.dp-t-row` dense list rows (2026-08-18)
- Linh: "too much empty space between rows [in the Today checklist] ... shrink each
  row from the current 44px minimum height down to roughly 33px ... reduce the row's
  internal padding to match (currently 4px 4px) so the row height change actually
  shows up as less visual gap." Explicit pre-authorization to go off-scale if the
  target required it, same standing precedent as the Routines exception above.
- Values used: `min-height: 33px` (was 44px), `padding: 2px 4px` (was `4px 4px`) —
  the `2px` is off the 4/8/12/16/24/32 scale on purpose. The 33px height itself is
  NOT a scale violation to begin with — it lands inside the §7 24–44px acceptable
  tap-target band above, just below the 44px *preferred* size for a control she
  taps once. `.dp-t-row` is a scrolling list of many small toggles, not a single
  primary control, so density wins here the same way it does for the Routines
  mobile exception's sub-rows.
- Scope, and nothing beyond it: the single shared `.dp-t-row` rule (index.html).
  Checked all three real consumers before shrinking, not just the one Linh named:
  the Today/day-recap checklist (`dayRecapHTML`), the chain phase-band rows
  (`.phase-t-row`, which only adds a trailing time column and inherits this rule
  as-is), and nothing else — a repo-wide grep found no other `.dp-t-row` user and
  no per-consumer height/padding override. `.dp-t-label` was already
  `white-space: nowrap` + ellipsis in every consumer before this change (no wrap
  path existed to begin with), so a long title truncates instead of growing the
  row — the "don't cramp a multi-line label" risk she flagged doesn't apply.
- Untouched: the dot indicator, done-state strike-through/opacity, the 12px
  dot-to-label gap, and the "N left for today" footer/progress bar above the list.

### Standing pattern — calendar-triggered editor panel (2026-08-18)
Linh: "when I tap Edit on an event, routine, or fitness session from the calendar
(the detail popup, or its deeper 'Edit routine settings' link), the full editor
should open as a panel on the SAME page — sliding in from the right over the
calendar — instead of switching the whole app to the Routines page." Not a
one-off — this is now the standard for any "edit an existing thing without
navigating away from where you are" need that comes up next.
- `.slide-panel-overlay`/`.slide-panel-sheet` (CSS, ~line 2360) is the shared
  recipe: a fixed dark scrim + a sheet that's full-screen (`100vw`/`100vh`)
  below 1024px and docks to `min(440px, 92vw)` on the right, gold
  `border-left`, above it. 1024px matches `rtnSideMq` — the Routines page's own
  existing side-rail breakpoint, reused rather than reinvented — and also where
  the widgets rail itself starts showing. `.slide-panel-head`/`.slide-panel-body`
  give the title+close header/scrolling body the same look at every width (the
  older `.rtn-side-head`/`.rtn-side-body` this was modelled on is only styled
  inside its own >=1024px media block, so isn't reusable directly below that).
- Two editors use it today, both their EXISTING fields/JS untouched — only
  where the form mounts changed: `#addForm` (plain event/task/fitness-calendar-
  event editor — restyled in place, same id, same script) and the new global
  `#editPanelOverlay`/`#editPanelSheet`/`#editPanelBody` (a THIRD dock for the
  existing `#rtnAddForm` traveling element, alongside its Routines-page-internal
  `#rtnSideBody`/`#rtnFormHome` docks — see `openRtnFormFromCalendar` /
  `rtnCalendarOpen` / the `rtnCalendarOpen` branches in `placeRtnForm`/
  `closeRtnForm`).
- Why a global mount point and not `#rtnSide`: that rail lives inside
  `#routinesPage`, hidden whenever `state.view` isn't "routines" — the exact
  redirect bug this pattern replaces. `#editPanelOverlay` sits outside every
  `.page` so it works no matter which page is open underneath.
- Save and Cancel both close back to the exact page/day the user was on —
  never a `state.view` change. A routine Save now also calls `renderDay()`
  (previously only Delete did), so the calendar reflects the edit immediately.
- Next editor that needs this: dock it into `.slide-panel-overlay`/
  `.slide-panel-sheet` directly rather than writing a fourth bespoke overlay.

**Follow-on — tightening pass (2026-08-18 pt.2)**. Linh: "the fields inside
that panel need to sit much closer together than the first version." Both
docks tightened (fields, not layout — same ask as `.dp-t-row` above, second
instance same day): `#addForm` (2-up `.when .row` gap 12px→8px, `.field` gap
4px→2px, `.field-bare` padding 8-10px→6px 10px) and `#editPanelBody #rtnAddForm`
(same `.field` gap, boxed-input height 38px→34px/padding→0 10px, `.rtn-pair`
gap→6px, Steps deboxed to a hairline-divided list instead of individually-
boxed tiles). Three cascade traps hit and fixed along the way, worth knowing
about before adding a fourth tightened dock:
  1. The app-wide "ONE FIELD LANGUAGE" rule (~line 12293) sets input/select
     padding with `!important` — a plain (non-`!important`) override never
     wins regardless of id count. Any future per-dock padding override on a
     real `<input>`/`<select>` needs `!important` too, scoped tight so the
     shared rule itself stays untouched everywhere else.
  2. `#rtnAddForm.rtn-inline-mode .rtn-sub-row` (background/border, further
     down the file) and `#addForm .when .row` (display/gap/wrap, also further
     down) both already existed as later, equal-or-higher-specificity rules —
     an earlier same-specificity override loses on source order alone. Fixed
     by either matching the full `#rtnAddForm.rtn-inline-mode` chain (Steps
     rows) or editing the later rule's value directly instead of shadowing it
     (`.when .row`'s own `gap` literal, cleaner than a duplicate). When
     retightening a dock, check whether a later rule already owns the
     property before adding a new override for it.
  3. `#rtnAdvancedField`'s Steps/Chain-it looked "broken" (0×0) mid-check —
     it wasn't a CSS bug. It sits inside `#rtnAddFormMore` ("More options"),
     a separate collapsed `hidden` container; open that toggle first, then
     the Advanced disclosure. Noted here since it cost real time to rule out
     as a regression.
- The `fitcal-` prefixed occurrence editor (fitness session Time/Duration/
  Location/Notes, `data-tl-toggle-edit` → `fitSessionHtml`, in the detail
  popup) is a separate, smaller pre-existing reveal from 2026-08-04 — already
  in-place (no page nav) before this pattern existed, with its own compact
  field set that doesn't map onto `#addForm`/`#rtnAddForm`'s fields. Left
  untouched rather than force-fit into the slide panel.

## Alignment & symmetry
- Equal left/right padding, balanced top/bottom. Items share one left edge and
  consistent columns. Label/value pairs aligned. Group related items evenly.
## Colours — Black & Brass, one source of truth
- Use ONLY the token set (--ink*, --*-seed, --*-ink, --tl-*-bg,
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
- **Type scale** (four sizes for reading text, nothing between):
  - Page title (`.bd-head h1`): 38px, `var(--font-display)`, weight 400.
  - Section header (`.section-head h2`): 20px, `var(--font-display)`, weight 400.
  - Body text: 13px, regular weight.
  - Label / caption / meta: 11px, `--ink-soft` or `--ink-faint`.
  - No half-pixel sizes (10.5/11.5/12.5px etc.) and no near-duplicate in-between
    sizes (10/12/14/15px) used as one-off tuning — round to the nearest scale step.
  - **5th role, named 2026-08-16: numeral / glyph display.** Big glanceable
    numbers and icons — calendar date numbers, tile stat values (`.rail-chip .n`
    and its kin), streak counters, the zodiac hanzi glyph — sit outside the four
    reading-text sizes above on purpose (see `project_book33app_drift_sweep_2026_08`
    memory, which first flagged this as real-but-unnamed). Size to the tile/card
    that holds it, not to 11/13/20/38 — observed range 12-58px. Still gold/`--ink`
    per the colour rules below; only the size is exempt.
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
- Every editor for an event (a routine is an event with Repeats set), a to-do
  item, recipe, goal, person, family task, work-manual section, or shopping
  item MUST have a Save button in its TOP-RIGHT
  corner (reuse .addform-head-save), so it can be saved without scrolling to the
  bottom. Keep the bottom Save/Cancel bar too. (True for Events/Routines/Meal-log
  only as of 2026-08-13 — Recipe, Goal, Person, Family task, Work-manual section,
  and Shopping item editors were still missing it.)
## Before finishing
- Confirm every rule is met; check dark AND light; check nothing is cut off or
  overlapping at 360px.
