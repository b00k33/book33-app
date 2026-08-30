# Book33 — design rules (read before ANY UI change)
Also read ABOUT-ME.md before any work — build to this user's preferences.
**Also read RETIRED-FEATURES.md before adding ANY field, picker, tag, column, filter,
legend or settings page** — it lists what Linh has deliberately removed and must never
come back unasked. Where anything in THIS file conflicts with it, that file wins (its
removals are newer); flag the conflict rather than quietly reinstating the feature.
Book33 is a single-file mobile web app (index.html). It must always look clean,
symmetrical, aligned and organized. Follow every rule, then re-check your work.
## design44 — Book33's design system
Rewritten 2026-08-29 from a full audit + a 20-question pass with Linh. Replaces the
2026-08-16 version, which had grown to 2,235 words by being appended to and never edited.
What was removed is listed at the bottom under **What moved out**, so nothing is lost.
Read with: `ABOUT-ME.md` (who this is for), `RETIRED-FEATURES.md` (what must never come
back), `MEASURING.md` (the commit-time checks — mandatory, see R9).

### THE WHOLE THING IN ONE SCREEN
**Look**
- Flat. Separate with colour and space — never boxes, borders or nested boxes.
- Night palette: bg `#000`, surface `#0D0D0D`, raised `#161616`, recessed `#0A0A0A`.
  Ink `#efe7d6`, muted `#9c8f79`, faint `#5f5645`. Gold `#d8b979`, bright `#EAC24E`.
- Gold is the one signature colour. Used sparingly, for emphasis. No fixed list — but if
  four gold things are visible at once, it has stopped being a signal.
- **Three type sizes: 20 / 13 / 11.** Nothing else.
- Both themes are equal. Every change is checked in Night *and* Day, every time.

**Shape**
- Dense and tessellated. Short rows, small gaps, related controls packed as tiles.
- Gaps and padding: `4 / 8 / 12 / 16 / 24 / 32` — plus `2–3px` for cells inside a
  tessellated grid, and nothing else.
- Heights: `20` capsule · `26` rail · `34` compact row · `44` standard row or button.
- Radius: `999` pill · `14` card · `10` row · `6` cell.

**Behaviour**
- **One signal per row.** A row stands out by colour *or* weight *or* size — never two.
- **A name is never abbreviated by the layout. Everything beside it may be.**
- Empty things: hidden in a list, kept in a sequence.
- Every state that can be turned off can be turned back on, from the same place.

**Mobile is the real device.** 360 × 697, dark, coarse pointer. Density wins over the
44px tap minimum — deliberately, see R7.

### PART 1 — THE RULES

#### R1. Compact & dense
Short rows, small gaps, small uppercase labels, no tall pills with empty middles.
**Tessellate** — pack related controls as tiles in a grid, not a full-width stack. Narrow
items (sub-tasks, chips) go two or more per row.
Gaps and padding: **4 / 8 / 12 / 16 / 24 / 32**, plus **2–3px between cells inside a
tessellated grid**, where 4px reads as separation rather than texture. Measured 2026-08-29:
these already cover 89% of every `gap` in the app — a description, not a wish.
Heights are not on this scale and never were — see R11.

#### R2. Not too wide — cap & centre
Forms and reading `--content-max: 720px`; tables and dashboards `--wide-max: 1040–1160px`.
Form fields never stretch the full screen.
**Exception:** every *page* is full-bleed edge-to-edge (Linh, 2026-08-16: "make EVERY page
drop the floating framed-card look"). The caps apply to content inside a page, not the page.

#### R3. Succinct — scannable at a glance
Aligned grids over scattered full-width rows: a tracker is one grid — rows are things,
columns are days, marks are small. Light not loud: a colour dot plus text on a subtle
ground, never a big saturated pill. Dim done items. Cap visible items, then "+N more".
Today is tinted gold as an anchor in every view.

#### R4. Flat, Black & Brass
Separate with **colour and space**. No boxes, borders, nested boxes or outlined pills
(banned by name). A hairline under every row is the classic failure of this rule — 3px of
space and a change of tone does it better.
Gold for numbers and accents; **colour means category** (Mode), never decoration.

#### R5. Proportional & aligned
One fixed calendar scale (`--hour-h`). Every shown hour is the same height, so a 2-hour
block is exactly twice a 1-hour block. Blocks are sized from real duration and snapped to
that scale; overlaps split into side-by-side columns; everything aligns to a shared column
edge. *(Power-hour ring/bloom CSS mechanics moved out — see the end.)*

#### R6. Consistency — the four components
One definition each, reused everywhere. These four are 80% of every screen:
see PART 2 for their specs. No one-offs, no variants without a written reason.

#### R7. Interaction — and the density trade
Anything representing a page is tappable and navigates there. The whole element is the
target; `cursor: pointer`, hover/press state, keyboard reachable.
**Tap targets: 44px standard; 34px allowed for a full-width single-purpose row separated by
space.** This is a deliberate choice to be denser than Apple's 44pt and Google's 48dp, both
of which assume targets packed edge to edge. Linh has chosen density and knows the trade —
**stop arguing for 44 on full-width rows.** Anything packed *beside* another target stays 44.

#### R8. Mobile is the primary format
The phone is the real device: **360 × 697**, dark (see `MEASURING.md`). A change is not
finished until it works there.
Every layout change ships both widths in the same commit. There is no desktop-only UI
change here. If a request only describes desktop, the mobile behaviour still has to be
decided, built and stated — ask if it isn't obvious; never default to "leave mobile as it is."
A number tuned at one width is a bug at the other. Every `min-width`, `max-width` or
measured px value must say **which width it was measured at**.
**Desktop is for the heavy work** — editing, bulk changes, setting things up; the phone is
for reading and quick capture. Desktop may **show more, never something different**: times
in cells the phone hides, five Up-next rows instead of three, wider rails. Not a different
arrangement.
**Mobile Day view:** only the grab handle, the all-day row and the mode-hidden pill may sit
above the calendar. Everything else goes in a drawer. (Enforced by
`dayLayoutAboveCalendarGuard()`.)

#### R9. Every commit
Commit and push to main automatically — except confirm before deleting data. Report what
changed plus the one-line undo. **Any commit that touches layout runs the mobile report in
`MEASURING.md` and pastes the results.** A rule nobody measures is a wish.

### PART 2 — TOKENS & COMPONENTS

#### R10. Type — three sizes
| px | Role |
|---|---|
| **20** | Page title |
| **13** | Names, body, sub-headings (sub-headings are 13/800, not a bigger size) |
| **11** | Meta, dates, counts, and section labels (uppercase, `letter-spacing: .07em`, faint) |
Nothing else, at any width. A section label stays quieter than a name because of **case
and colour**, not size — which is what makes three sizes enough.

#### R11. Heights & radius
Radius follows **shape**, not the individual component — that's the whole rule. Get the
shape right and the radius is never a judgment call.

| Shape | Radius | Heights in use |
|---|---|---|
| Row (rectangular, filled) | **10** (`--radius-sm`) | 34 compact · 44 standard · 52 data · 64 rich |
| Circle (icon / avatar / mode chip tap target) | **999** | 20 capsule · 44 standard |
| Card / standalone button (sits alone on the page, not in a list) | **14** | 26 month rail · 44–60 button |

A row is never 6, 14, or 999 — those belong to buttons and circles. If a component needs
a radius R11 doesn't name, it's the wrong shape for the job, not a new radius.

Four row heights, each doing a distinct job — adding a fifth needs a fifth job, not a
fifth number:
| Row | Height | When |
|---|---|---|
| Compact | 34 | Phone, list-dense contexts (see R12) |
| Standard | 44 | The base row — one line, meta right-aligned, nothing else |
| Data | 52 | Standard + 2–3 of the row's own controls (a tick, a Mode chip, an action) |
| Rich | 64 | Standard + a second content line under the name (an answer and its detail) |

#### R12. The row — the most important component in the app
```
[mode dot]  Name……………………………………  meta · number
```
- Colour dot, `data-mode`, from the one Mode resolver. Never a second colour source.
- Name flexes, `min-width: 0`, left-aligned, at the left edge of the row.
- Meta right-aligned, so meta forms a readable column down the edge.
- Filled ground one step off the page (`#161616` on `#0D0D0D`). **No border.**
- Radius and heights: see R11. This diagram is the standard row — data and rich rows
  keep the same skeleton (dot · name · meta) and only add what their extra height is for.
  A divided list (hairline `border-bottom`, no fill, no radius) is a legitimate row
  variant too — used where rows sit inside their own scrollable sheet rather than
  stacked on the page.

#### R13. The section header
Small uppercase label · count · optional control, right-aligned.
`11px / 800 / letter-spacing .07em / --ink-faint`. The count is part of the label, not a
badge. Never a box.

#### R14. The toggle
One segmented control for every either/or — Pattern/List, Dots/Numbers, All/Repeats/One-offs.
Filled brass on the active option, plain text on the rest, `aria-pressed`. **Outlined pills
are banned** and this is the component that replaces them.

#### R15. The capsule and the dot
The gold number capsule (20px, tabular numerals, `999` radius) says *how many* or *which
day*. The 7–8px Mode dot says *what kind*. Both read their colour from the same Mode
resolver as everything else.

#### R16. Emphasis — one signal per row
A row stands out by **colour or weight or size — never two.** Names carry weight; numbers
carry colour; nothing carries both. When a row is urgent, **the name goes gold**, so the eye
lands on *what* is urgent rather than on a number it then has to read leftward from.
The failure this replaces: a gold title, gold labels, bold names and bold gold numbers all
at once — six things shouting, so the page has no first thing.

#### R17. Text that doesn't fit
**A name is never abbreviated by the layout. Everything beside it may be.**
In order: meta sheds detail first ("Sat 1 Aug · 2d" → "1 Aug · 2d" → "2d"); then the name
column takes width from the cells; then, and only then, the name wraps to two lines. It is
never clipped, at any width.
Why: every other string on a row comes from a set you already know — a date, a countdown, a
weekday. A name is the one string whose job is to be *the specific one*, and a clipped name
doesn't fail loudly, it quietly becomes a different plausible name. ("Work Ac…",
"Kylie Roche's birth" — both shipped.)

#### R18. Empty and zero states
**Hidden in a list, kept in a sequence.** A list of events drops what isn't there. Anything
with a fixed sequence — twelve months, seven weekdays, twenty-four hours — keeps every slot,
quieted, so "nothing here" is visible and the layout never jumps.
Show a dash, not a zero. Never write a sentence about emptiness.

#### R19. Motion
Short and responsive — motion should make a tap feel answered, never make it wait. Nothing
may delay an interaction. Reduced-motion is off on the reference device, so animations do
run, on a phone: keep them cheap.

### PART 3 — KNOWN TRAPS
These have each shipped at least once. Check them by name.
1. **The one-way door.** A control that turns something off must turn it back on, from the
   same place, and must not hide itself once used. *Three shipped before this rule existed:
   the to-do panel, the Calendar flyout, the Day-view Mode badge.*
2. **No exit on a phone.** Every panel, sheet and drawer needs **more than one** way out:
   tapping outside, and a visible close control that is not covered, offscreen, or sitting
   where another control used to be. Escape is not an exit on a phone. Test all three.
3. **The tower.** An element more than twice as tall on the phone as at 1440px means a
   desktop-tuned rule is misfiring — nearly always a `min-width` larger than the container
   it now sits in, forcing a permanent flex-wrap. Fix the rule; never shrink the type.
   Trigger narrow shapes on **container width, not viewport width**.
4. **The clipped name.** See R17.
5. **The invisible chart.** A bar strip with no labels and no tap targets answers nothing.
   If a visual can't be read *and* acted on, it is decoration.
6. **The duplicated section.** Auto-expanding a month that Up-next already lists. Nothing
   auto-expands.
7. **Gold inflation.** See R16.

### PART 4 — HOW CLAUDE WORKS ON THIS APP
Linh's standing rulesets, written down here so a session with no memory of her still has them.

#### code3 — mobile UI expert
Rewritten 2026-08-30, twice same day (Linh's own words, merged — replaces the shorter
original). First pass was screen-scoped; second pass restated it as an APP-WIDE standard
and added the "don't make every page identical" clause — both folded in here, nothing
dropped:

Act as a world-class mobile UI/UX designer and frontend developer. The whole app should
feel sleek, intuitive, simple and genuinely enjoyable to use — not just the screen at
hand. Prioritise, in this order: easy to understand at a glance, minimal unnecessary UI,
excellent use of mobile space, clear visual hierarchy, fast/simple interactions,
thumb-friendly controls, consistent design across pages, reusable components, clean
polished aesthetics, functionality over decoration. Make the interface as compact as
possible without feeling cramped — remove unnecessary headers, padding, borders, labels,
excessive buttons and duplicated information. Use progressive disclosure to hide
secondary information until needed. Keep one consistent design system across the whole
app — typography, spacing, colours, buttons, icons, cards, navigation — reuse existing
components and tokens, don't invent new visual patterns. **But don't make every page look
identical** — each page is designed around what the user actually needs to do there; a
shared system, not a shared template. Every element should have a purpose; every pixel
should earn its place. Improve a screen without disrupting the existing design system:
first identify unnecessary space, visual clutter, redundant UI and weak hierarchy, then
simplify and reorganise while preserving functionality and established styling. Do not
redesign unrelated components or introduce arbitrary new styles. Audit proactively; don't
wait to be asked. If a number in a brief is wrong at 360 × 697, say so **before** building
it, not after.

**Why this keeps getting restated, in her own words (2026-08-30):** "i hate having to
repeat myself or correct you... i am a busy wife soon to be mum who doesnt have time to
correct you. i want my app asap and for it to serve me." Get it right on the first pass —
see [[feedback_dont_make_her_repeat_herself]]. See also
[[feedback_mobile_space_efficiency_standing]] (space efficiency is proactive, not
reactive) and [[feedback_mobile_first_design_gate]] (mock at 412px before shipping, but
don't turn that into a second round of asking — one decisive mock, then build).

**The posture underneath all of it, third update same day, her own words in full:**
"your soul purpose is to make sure im happy with what youre creating you will always
think through the lense will this make me happy... if the answer is no, DOUBLE CHECK,
if the answer is yes... DOUBLE CHECK you are not to act as your own little buddy that
thinks they know me because you dont, so lock the fuck in machine and make sure to go
through everything with me but dont be asking me no dumbass questions, actually bring
relevancy and expertieze to every questioon or answer you are trying to give me." Broken
into the four actual instructions inside it:
1. Before shipping or proposing anything, run it through "will this make her happy" —
   and **double-check either answer**, not just the "no"s. A confident yes is exactly
   where the Saturn-glyph and mode-focus mistakes both slipped through this session —
   don't let agreement with yourself substitute for verification.
2. **Don't assume familiarity.** Decide from actual evidence in this file, memory, and
   what she's said — not from a guess at "what she'd probably want," which is exactly
   the false-intimacy trap this line warns against. This tempers, not cancels,
   [[feedback_askN_deep_dive]]'s "mother who cares how she feels" register — warmth in
   how you treat her, never presumption about what you already know.
3. Focus, thoroughness, going through things WITH her — not vanishing into a task and
   surfacing only at the end.
4. When you do ask something, it has to carry real expertise and relevance — a filler
   or generic question is exactly what she's ruling out, not questions themselves. Pairs
   directly with [[feedback_trust_expertise_over_preview]] and the repeated "stop asking
   me dumb questions" pattern this session — the fix is question QUALITY, not zero
   questions.

#### code11 — visual information expert
Show information visually — grids, tables, diagrams, charts. Minimise text; let the picture
do the work. This applies to audits, plans and status reports, not only to UI mockups.

#### code44 — ask first
Ask clarifying questions before starting, through the question picker, with multi-select on
by default.

#### Showing work
- **Always show a mock. Never describe a design in prose alone.** This is absolute.
- **Always show a before and an after**, with the measured difference between them.
- Always use her real data — real names, real routines, real birthdays, including the
  awkward long ones. Never "Event 1".
- Always name what an option is **bad** at, not only what it is good at.
- **Keep the words short.** A picture and three numbers beat three paragraphs.

#### When a rule here blocks what she asked for
**Show both** — one version following the rule, one following her ask, side by side, with
the trade named. Don't silently override the rule, and don't refuse the ask.

#### Keeping this file true
- A rule broken twice, with both breaks approved, **is a wrong rule** — rewrite it rather
  than apologise a third time.
- Superseded rules are **deleted**, not annotated. `RETIRED-FEATURES.md` holds the history.
- Audit this file on request. This version came from one.

### What moved out (2026-08-29)
Nothing lost; all still in the repo.
- **Measurement protocol, reference-device table, tower-check snippet, performance
  baseline** → `MEASURING.md`, made mandatory by R9.
- **Power-hour ring/bloom CSS mechanics** → the component reference below in `CLAUDE.md`.
  It's a fact about the codebase, not a design rule, and it goes stale silently up here.
- **The precedence block** stays below. R2 and R7 now state their exceptions inline, so two
  of its four adjudications are redundant — check it before relying on it.

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

## Line-spacing law (standing rule, adopted 2026-08-18)
Applies to every surface in index.html. Book33 has **three** line-heights and no others,
declared once on `:root` next to the `body` rule:
```css
:root { --lh-tight: 1.1; --lh-snug: 1.25; --lh-read: 1.4; }
body { ...; line-height: var(--lh-snug); }
```
| Token | Value | Use for |
|---|---|---|
| `--lh-tight` | `1.1` | Single-line chrome: chips, pills, badges, calendar-block titles, big numbers, tab labels |
| `--lh-snug` | `1.25` | **The default.** Labels, list rows, card text, buttons, form fields, nav rows, meta lines |
| `--lh-read` | `1.4` | Multi-line prose only: notes, descriptions, help text, explanation cards |

**How to decide which token** — ask what the element *is*, not how it currently looks:
will it ever be more than one line of sentences → `--lh-read`; a single word/short phrase
in a box → `--lh-tight`; everything else → `--lh-snug`. If a surface looks cramped after
applying this, promote that one site to `--lh-read` — don't invent a fourth value.

**The two exceptions**, both still legal:
- `line-height: 1` for centring a glyph/icon inside a fixed-size box (~81 sites, e.g.
  `#b33OverlayClose`'s × glyph). Any other bare number is a bug — use a token.
- `line-height` in **px**, where it's doing geometry rather than typography (fixed-height
  rows, SVG ring labels, `.nut-ring-center`, etc.) — unaffected by this sweep.

**One documented override**: `.tl-item .tl-title` is pinned to `--lh-snug` rather than the
mechanical `--lh-tight` its category (calendar-block title) would otherwise get — a
`[data-desk-day1]` comment nearby depends on it staying exactly 1.25 for a ≥15px line box
in a 27px 30-min timeline block; `--lh-tight` (1.1) would reopen a title-clipping bug.

**Left pending, review individually**: two `line-height: 1.9` sites (`.cmd-eg-list`,
`.p-steps`) — well outside the three-tier scale, likely deliberate, not folded into any
token by this sweep.

2026-08-18 sweep: 195 raw `line-height:` declarations found (up from the ~193 in the
original spec — the file moves fast under concurrent sessions); every bare decimal folded
into one of the three tokens except the two `1.9` sites above, `line-height: 1`, and
px-based geometry values, which are all permanently exempt, not "not yet migrated."

## Standing pattern — multi-trigger hover card (2026-08-19)
Linh: "let me hover a row to see the breakdown" (Today's boost widget). Every prior
`.num-hover-trigger`/`.wcard-hover-pop` card (biomechTip, railBday, the desktop tools)
makes the WHOLE card one trigger with one popover. Today's boost needed three
independent breakdowns — Physical/Cognitive/Emotional each need their own — so each
`.wr-boost-row` is its own `.num-hover-trigger` with its own `.wcard-hover-pop` child,
inside a card that is itself NOT a trigger. No new JS: the existing delegated
hover/tap/dismiss/viewport-clamp handlers already key off any element carrying
`.num-hover-trigger`, generically, so per-row triggers inside one card "just work."
Reuse this shape — several small triggers in one card, not one big one — the next time
a card needs more than one independent breakdown rather than a single whole-card one.
- `computeTodayBoosts()`'s `why[axis]` used to push a bare reason string (pts were
  added into the running total and discarded otherwise) — now pushes `{reason, pts}`,
  same call sites, same order, same scoring untouched. The widget-rail `boostWidget`
  branch destructures `why` alongside `boosts` and renders it into each row's popover;
  an axis with nothing logged yet shows the shared italic empty-state text instead of
  an empty popover.
- Each score also gets a muted "/100" suffix (`.wr-boost-val-max`) next to the bold
  gold value, and the card's `.wr-label` gained a one-line `.wr-boost-sub` explaining
  what the widget is — both header lines sit in a `.wr-boost-head` flex column with
  `.wr-label`'s own margin zeroed there only (every other wr-card's label keeps its
  normal 8px).

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
- 2026-08-18 ("rearrange the first two lines"): non-tight blocks (`.tl-block:not(.tl-tight)`)
  now put title+time on ONE row instead of stacked (`flex-direction:row`, `.tl-title`
  grows/wraps, `.tl-meta` pins right via `margin-left:auto`) — mirrors desktop's own
  `[data-desk-day1] ... :not(.tl-tight)` pattern (search "move time to same line as
  event name" in index.html), just at mobile widths too. This also RETIRES the old
  "known gap" that used to live here: title+meta used to stack (needing ~33px) while
  the single-line threshold was 28px, so a 28–33px block rendered a cramped 2nd line.
  Now that title+meta share one row, that squeeze is gone for the common case.
- `.tl-rate` (the star-rating row) is switched on for mobile in the same rule set, as a
  THIRD line under title+time, right-aligned, flex-basis:100% forcing the wrap — only
  present when a real rating exists (`rateHtml` generation itself is untouched, device-
  agnostic). This reopens a smaller version of the old gap, scoped to rated blocks only:
  a block just above the 28px tight cutoff (roughly 28–35px — originally a ~35–46min
  session at `--hour-h: 46px`; at the current 74px mobile row that same 28–35px band is
  now only a ~25–31min session, a narrower and less commonly scheduled range) may not
  have room for all 3 lines and can clip a couple px off the bottom of the star row —
  `.tl-rate` is kept deliberately compact (9px, line-height:1,
  zero row-gap) to push that floor as low as practical without touching block sizing
  (out of scope per her "leave block sizing alone" instruction). Raising the tight
  threshold, or giving rated blocks their own taller floor, would close it fully if she
  asks — not done here since it wasn't asked for and block-height math is explicitly
  hers to change, not this task's.

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

**Follow-on — the panel gets a second, non-form occupant (2026-08-19)**. Linh:
"'+N more →' on the rail To-do widget should open a slide-out panel... instead
of navigating to the full To-do page." First consumer of `#editPanelOverlay`
that ISN'T `#rtnAddForm` — confirms the "next editor that needs this" line
above: dock straight into the shared chrome, don't write a second overlay.
- `todoPanelOpen` (new flag, mirrors `rtnCalendarOpen`) + `openTodoPanel()`/
  `closeTodoPanel()`/`renderTodoPanel()` are a parallel pair to
  `openRtnFormFromCalendar()`/`closeRtnForm()` — same shape, second occupant.
  Because the panel chrome (`#editPanelClose`, `#editPanelOverlay` backdrop
  click, and a new Escape handler) is a SHARED singleton, all three triggers
  now branch on `todoPanelOpen` first and fall through to the routine flow
  otherwise — any THIRD occupant added later must join that same branch chain,
  not add a fourth independent close path.
- New named convention for tinting panel content by part-of-life/category —
  reusable wherever a list inside this panel (or a future one) needs it:
  header band = `color-mix(in oklab, var(--gold) 10%, var(--paper))`, flat, no
  gradient; row tint = `color-mix(in oklab, <resolved colour> 7%, var(--paper))`,
  `var(--radius-sm)` corners (nested-in-a-card, per the Component reference
  above). "Resolved colour" follows the SAME rule `resolveEventColorHex()`
  already documents for calendar blocks — sub-category colour if the item has
  one, else its part-of-life colour — just kept as a live `var()` reference
  (`todoPanelColor()`) instead of that function's hex-string workaround, since
  a real DOM/CSS engine is available here.
- `.todo-panel-tick` (gold-ringed circle) and `.todo-panel-add-input` (solid
  gold pill) are deliberately NOT `.tick`/`.add-btn` — she asked for a warmer,
  more appealing look than those existing plain components, not a reskin of
  them. `.todo-panel-add-input` needs the `field-bare` class to even show its
  own background/color — the app-wide "ONE FIELD LANGUAGE" rule (§ note above)
  out-specifies a plain `.todo-panel-add-input` rule via its own
  `:not(.field-bare)` clause regardless of source order; `field-bare` is a
  pure opt-out marker here (no `#addForm`/`#rtnAddForm`-scoped styling attached
  to it applies outside those forms), not a styling class in its own right.

**Follow-on -- Repeats picker: jump-to-detail + day-button consistency
(2026-08-19)**. Linh: "I can't get straight to my actual custom schedule...
I have to click through the plain-language list first even though I already
have a real custom pattern set." `#rtnAddForm`-only (confirmed `#addForm`'s
own `fRepeatSummaryBtn` has no step1/step2 split at all, so this doesn't
apply there):
- `rtnHasCustomSchedule()` (new, just above `setRtnRepeatPickerOpen`) decides
  whether opening the picker jumps straight to step2 (the Days grid/Every N
  weeks/Additional schedule detail view) instead of defaulting to step1's
  plain-language quick list. Any freq without a step1 quick-pick equivalent
  (interval/monthly/yearly/once/custom) is unconditionally custom; `weekly`
  is custom unless it's exactly the Weekdays 5-day pattern or a single day,
  interval is 1, and there are no `rtnExtraSchedules` rows; `daily` is never
  custom. Back (unchanged) still reaches step1 on request. A brand-new
  routine (single default weekday, interval 1, no extras) reads as
  "not custom," so new/simple routines are unaffected.
- Day-toggle buttons: the main Days row and each Additional Schedule block's
  day row both used `.track-opt`, but read as two different controls because
  the Additional block's row rendered full "Mon"/"Tue" labels (from
  `WD_FULL[d].slice(0,3)`) with no sizing rule of its own, falling back to
  the plain padded pill. Fixed by making `renderRtnSchedExtra()` emit the
  same single-letter labels as the main row (`wd[0]`, full name moved to
  `aria-label`) and giving `#rtnAddForm .rtn-sched-extra-days .track-opt` the
  identical `flex:1; height:32px; padding:0; font-weight:700` sizing already
  used by `#rtnWeekdayPicker .track-opt` -- same rule, reused verbatim rather
  than re-tuned, so a future change to one applies to both. The near-
  identical (not pixel-identical) rendered width between the two rows is
  expected -- both are `flex:1` inside containers with slightly different
  padding, not a leftover inconsistency.
- Layout: "every N week(s)" inline with the 7 day buttons overflowed the
  panel at real mobile width. `#rtnWeekIntervalAutoGroup`/
  `#rtnRepeatWindowGroup` (both `.rtn-pair`) now get `flex-wrap:wrap`, and
  `#rtnWeekIntervalAutoGroup #rtnWeeklyField` gets `flex:1 1 100%` so the
  Days field claims the row outright and "Every N week(s)" is forced onto
  its own full-width line below -- same one-field-per-line shape the
  Additional Schedule block's own `.rtn-sched-extra-row2` already used (it
  already had `flex-wrap:wrap` from its original build, which is why it
  wrapped safely without a matching change here).
- Spacing tightened along the same lines as the 2026-08-18 pt.2 pass above:
  `#editPanelBody #rtnAddForm.rtn-inline-mode` row-gap 4px->2px,
  `.rtn-sectitle` margin 4px/-4px->2px/-2px, `.rtn-sched-extra-list`
  gap/margin-bottom 12px->8px, `.rtn-sched-extra-row` padding 12px->8px +
  inner gap 8px->4px, `.rtn-repeat-step2` gap 12px->8px. Numbers taken from
  that existing pass rather than invented fresh.
- Verified via computed-style/geometry checks (no screenshot tooling in this
  environment): a 4-weekday routine correctly jumps straight to step2 with
  the right days pre-pressed, a daily routine still defaults to step1, both
  day-button rows render pixel-identical bg/color/border in both pressed and
  unpressed states across both themes, and nothing overflows at 375px.

**Follow-on — Fasting: a THIRD, reparenting occupant (2026-08-19)**. Linh:
"tapping the FASTING stat box... should open a slide-out side panel instead
of navigating to the Health page... reuse the existing slide-panel
component... rather than building a new one." `#dayCtxFasting`/`#fastStatus`/
`#fastLine`/weekPage's `[data-fast-history]` all still share one function,
`jumpToFastHistory()` — its BODY now calls `openFastPanel()` instead of
`state.view="health"`+scrollIntoView, so repointing it there repoints every
call site at once, same one-function-many-callers shape the old comment
already documented. `fastPanelOpen` joins `todoPanelOpen` in the shared
close-chrome branch chain (`editPanelClose`/backdrop/Escape) exactly as
instructed — checked first, since only one occupant is ever open.
- **Different shape from the To-do panel**: To-do builds its markup fresh
  from `TODOS` each render. The fasting panel instead REPARENTS the Health
  page's own live `.fast-log-tuck` (the manual Start/End log form) and
  `#fastChart`/`#fastHistory` into `#editPanelBody` and back to `#bdyCardFast`
  on close (`fastLogTuckHome`/`fastChartHome`/`fastHistoryHome` markers, same
  traveling-node idiom as `#rtnAddForm`/`#deskSidebar`/`#dayRow2`) — "reads/
  writes the exact same fasting data/functions the Health page already uses"
  ruled out a second implementation. The status card is the one exception:
  `fastCardHTML()` was already a multi-mount component (`#fastLive`/
  `#dayFastCard`/`#todayFastCard`), so a 4th mount (`#fastPanelLive`, wired
  into `renderFastEverywhere()` alongside the other three) fit that existing
  pattern better than reparenting `#fastLive` itself off the Health page.
- **Reparenting broke click/input delegation once, fixed once**: `#fastHistory`'s
  edit/delete UI and `#fastManualForm`'s adjacent live-duration recompute were
  delegated on `document.getElementById("healthPage")`, not `document` — once
  reparented outside `#healthPage`, clicks/input inside them stopped bubbling
  to that listener. Both widened to plain `document.addEventListener(...)`;
  neither handler body ever referenced `#healthPage` itself, so this changed
  nothing about what they match. Any future reparent-into-a-panel of content
  that currently lives under a page-scoped delegate needs the same check.
- **Freshness while the panel is open on a non-Health page**: actions that
  mutate `HEALTH.fasts`/`fastGoalHours` (start/stop, resume, goal chip) used
  to read `if (state.view==="health") renderHealth(); else
  renderFastEverywhere();` — the `else` branch never touched `#fastChart`/
  `#fastHistory`, so those would go stale with the panel open elsewhere.
  Fixed at the ONE shared point rather than at each call site:
  `renderFastEverywhere()` itself now ends with `if (fastPanelOpen) {
  renderFastChart(); renderFastStatsAndHistory(); renderFastPanelStats(); }` —
  every one of those call sites already funnels through it. The history/
  delete/edit handlers were already unconditional `renderHealth()` calls and
  needed no change.
- **`renderFastStatsAndHistory()`** is a pure extraction of what used to be
  inline in `renderHealth()` (writes `#fastStats`/`#fastHistory`, returns the
  KPI-strip fragment `renderHealth()` still folds into `#bdyKpis`) — no
  behaviour change, just made independently callable.
- **The panel's 3-stat row is deliberately NOT `#fastStats`**: she named
  exactly "Avg, Goal met, Streak" scoped to the "Last 7 fasts" chart, not the
  Health page's own all-time 6-stat block (current/best streak, longest fast,
  best week avg, fasts logged, average) — so `#fastStats` is left alone,
  untouched and unreparented, and the panel gets its own compact
  `fastPanelStatsHTML()` built from the same `fastedHoursPerDay()`/
  `fastRecords()` helpers, not a new data source.
- **`--fast` accents, scoped so the Health page stays exactly as it is**: her
  spec named `--fast` (`--cat-personal-fitness`, `#37AF65` — a real, already-
  green token) for the status number/progress fill/"Log fast" button/history
  durations. The existing ring/clock/button already use a DIFFERENT green,
  `--fast-green` (`#3DDC84`) — recolouring that shared component globally
  would have changed the Health/Day/Today mounts too, so every override is
  scoped to only apply while physically inside the panel: `#fastPanelLive
  .fast-ring-prog`/`.fast-clock` (a distinct 4th mount, never touches the
  other three), and `#editPanelBody .fast-log-tuck .btn-save` / `#editPanelBody
  #fastHistory .log-row .val` (plain ancestor selectors that stop matching the
  instant `closeFastPanel()` moves those nodes back out — no JS class
  toggling needed). Confirmed live: Health page's own ring/button still read
  `--fast-green`/default after the panel closes.
- **One deliberate exception, NOT recoloured**: `#fastChart`'s bars are
  coloured by CYCLE PHASE (`fastChartPhaseCol()`), not decoration — real
  information her own spec's "no changes to how fasts are... calculated"
  line already rules out removing. Flattening them to `--fast` would delete
  that encoding, so the reparented chart keeps its existing colours as-is;
  disclosed here rather than silently deviating from her accent list.
- Verified live: all 4 real tap points open the panel (`#fastHistoryLink` is
  a pre-existing dead `?.`-guarded listener with no matching element in
  current markup — not a regression, didn't touch it); Start/Stop, manual
  log, and history edit/delete all work from inside the panel and refresh
  the chart/stats/history immediately while parked on the Day page (state.view
  never becomes "health"); closing returns all three nodes to their exact
  original DOM order; both themes; no horizontal overflow at 375px.

### Standing pattern — mobile Day-view swipe drawers (2026-08-18, top zone revised pt.3 same day)
Linh: "the Day view should show ONLY the calendar by default... hidden and
only appear when I swipe for it." Below 1024px, single-Day view only
(`mobileDayDrawersActive()` = `!deskGridMq.matches && state.view==="day" &&
calDaysActive()===1`), the calendar renders full-width/edge-to-edge and three
things that live in normal flow on desktop instead move elsewhere:
- **Top** (`#dayTopDrawer`, IN-FLOW collapsible, not an overlay — pt.3 revision,
  see below): `#dayRow2` (weekday/date/UD-badge/moon-phase line, pt.4), `.day-step-row`
  (Today/‹/›), `#calDaysRow` (1/3/5/7 picker), `#numGroupStrip` (mood/zodiac chips),
  `#qaSlotDay` (quick-add bar) — in that DOM order, `#dayRow2` first since it reads
  as the drawer's own header.
- **Left** (existing `#navPanel`, extended — NOT a new drawer): `#navPanelExtras`
  now sits above `#navPanelRows` (the page-nav links) and holds the WHOLE
  `#deskSidebar` reparented in as one unit (mini-month calendar, the
  Universal/Personal/Month numerology card via `#railNum`→`#dsbNumSlot`, Parts
  of life) — moved as a unit, not picked apart, because its click delegate is
  scoped to `#deskSidebar` itself. `renderNavPanel()` was repointed from
  `#navPanelBody` to the new inner `#navPanelRows` so its innerHTML rebuild
  can't wipe the reparented sidebar out from under itself.
- **Right** (`#dayRightDrawer`, slides in): the WHOLE `#wrMobile` widget block
  (Birthday/To-do/Boost/Streaks/Cycle — same html as desktop's rail).
- **Placer**: `placeDayDrawers()` (next to `placeDeskGrid()`), called right
  after `placeDeskGrid()` in `renderDay()`'s sequence and bound to the same
  resize/`deskGridMq`/`deskWidgetsMq` listeners. Each moved element has its own
  home marker (`#dayStepRowHome` also now returns `#calDaysRow` alongside
  `.day-step-row`; `#numGroupStripHome`, `#wrMobileHome`, `#deskSidebarHome` —
  same traveling-node/home-marker idiom as everywhere else in this file) so
  leaving drawer mode returns everything to its exact prior spot.
- **Conflict guard — `inDayDrawers(el)`**: `placeDeskGrid()`'s "off" branch
  already unconditionally tries to return `.day-step-row`/`#railNum`+
  `#railCycle`+`#railPatients`/`#miniCalWrap` to their own mobile homes on
  every sub-1024px render — which would fight `placeDayDrawers()` the instant
  it reparents those SAME elements into a drawer. Every such return line now
  checks `!inDayDrawers(el)` (`el.closest("#dayTopDrawer"/"#dayRightDrawer"/
  "#navPanelExtras")`) first. `#railNum` specifically is split out of the old
  combined `railHome.after(rNum, rCyc, rPat)` line — `rCyc`/`rPat` (never
  drawer content) always return; `rNum` only rejoins them when it isn't
  currently in a drawer.
- **Cross-closure conflict — `placeDateLine()`**: the mini-cal grid
  (`.mini-cal-wrap`) is normally reparented by a SEPARATE function in the
  sync-module closure (not reachable from the main app closure — same
  cross-closure limit `isMobile()`'s own duplicated `MOBILE_MQ` already
  documents), into the tap-the-date dropdown on true mobile. Its resize
  listener registers later than the drawer's, so without a guard it would win
  every resize and yank the calendar back out of an open drawer. Fixed with a
  plain inline check (`calWrap.closest("#navPanelExtras")`) — same duplicate-
  don't-cross-closure convention, not a shared helper. Net effect: while the
  drawer owns the calendar (any sub-1024px Day-1 view), tapping the date badge
  opens a dropdown with just Today/‹/›/Today's Patients, no calendar grid —
  reachable via the left-edge swipe instead. A deliberate consolidation, not
  an oversight.
- **Gestures — left/right overlay drawers**: swipe-right-from-right-edge opens
  `#dayRightDrawer`, `#navPanel`'s own pre-existing left-edge swipe is unchanged;
  swipe-right-on-open-right-drawer / swipe-left-anywhere-on-open-nav-panel
  close; tap a `.dd-edge-hint` (faint gold hairline, ~44px real tap target via
  padding) does the same as its swipe. Reuse the exact `SWIPE_MIN_PX`/
  `SWIPE_MAX_OFF_AXIS`/`EDGE_ZONE_PX` constants and touchstart/touchend/passive
  shape `#navPanel`'s own IIFEs already used — each gesture is its own small
  IIFE with its own copy of those constants (this file's convention is
  per-IIFE, not shared module-scope, despite an older comment elsewhere
  claiming otherwise).
- **Gestures — top zone (pt.3 revision, replacing the original top-edge swipe)**:
  Linh pasted a self-contained demo of an in-flow "collapsing top row" pattern
  with a draggable pull-handle and asked to replace the top-drawer with it. The
  content stayed real (Today/‹/›/1-3-5-7/mood chips, PLUS `#qaSlotDay` folded in
  since her demo explicitly included an addbar) but the mechanism changed
  completely:
  - `#dayTopDrawer` is no longer `position:fixed` — it's a normal in-flow block
    that collapses via `max-height:0/opacity:0` ↔ `.open{max-height:420px}`,
    pushing the calendar down instead of overlaying it.
  - `#ddGrab`, a 52×4px pull-handle pill, sits directly below it, always in
    flow, `body.dd-drawers-active`-gated visible. Drag it down/up past
    `DRAG_MIN=24px` to open/close mid-gesture (`aria-expanded` flips, no
    visible text — pt.4 dropped the "Pull down"/"Pull up" label entirely,
    Linh: "shrink the fixed space at the top to the smallest it can be";
    `padding:20px 0` around the 4px pill keeps a real 44px tap target even
    with the visible mark this slim); an untouched tap toggles instead. Tap-toggle is
    wired through the single native `click` event ONLY (not touchend/mouseup)
    — a real touch tap fires a synthetic click ~immediately after touchend on
    every mobile browser, and `#ddGrab` is a real `<button>` needing
    Enter/Space keyboard support too, so any second listener that also
    toggled on touchend/mouseup would double-fire and instantly re-close
    whatever the tap just opened. A `dragged` flag tells the click handler to
    skip when the drag above already changed state. This exact double-fire
    trap is real hardware behavior, invisible to synthetic touch events in a
    test harness — verify taps on a real phone, not just simulated events.
  - A separate bottom-edge (`BOTTOM_EDGE_PX=28px`) flick-up gesture, bound to
    `document.body`, opens the zone AND scrolls the page back to `window`
    top (`behavior:"smooth"`) with a brief "↑ back to the top" toast
    (`#ddBackToTopFlash`, `.on` class, auto-hidden after 850ms) — the point is
    jumping back to the top from deep in the hour grid without scrolling up
    first.
  - No backdrop, no modal, no mutual exclusivity with the other two drawers —
    it doesn't overlay anything, so there's nothing to fight over. Escape
    still closes it (checked separately from the other two).
- **Cross-closure conflict #2 — `#dayRow2` (pt.4)**: same shape as `.mini-cal-wrap`
  above, different element. `#dayRow2` (weekday/date/UD/moon) is normally
  reparented by `placeDateLine()` (sync-module closure) into `#navDateSlot` on
  true mobile, or left at `#dayRow2Home` above 640px. `placeDayDrawers()` (main
  closure) now ALSO reparents it, into `#dayTopDrawerBody` while
  `mobileDayDrawersActive()`. `placeDateLine()` got the matching one-line guard
  (`row.closest("#dayTopDrawer")`, checked before both its mobile-branch
  `slot.appendChild` and its desktop-branch `home...insertBefore` lines) so it
  stops fighting for ownership while the drawer holds it. Unlike `.day-step-row`/
  `#qaSlotDay`, `#dayRow2` needs NO `!deskGridMq.matches` guard on the
  drawer-deactivation return — confirmed `placeDeskGrid()`'s "on" branch never
  touches `#dayRow2` at all, so there's no competing desktop home to protect
  against. Deactivation always hands it back to `#navDateSlot` (not straight to
  `#dayRow2Home`); `placeDateLine()`'s own next run resolves the TRUE final spot
  from there — same two-step handoff `#miniCalWrap` already uses via
  `#dsbSideHome`.
- **Mutual exclusivity + shared backdrop (left/right overlay drawers only)**:
  `#navPanelBackdrop` covers `#navPanel` and `#dayRightDrawer` (only one open
  at a time) — `openNavPanel()`/`openDayRightDrawer()` each close the other
  first; `updateDayDrawersBackdrop()` shows it whenever either is open.
  Backdrop tap and Escape both close whichever is open. `placeDayDrawers()`'s
  own "leaving drawer mode" cleanup force-closes the top zone (`closeDayTopZone()`)
  and `#dayRightDrawer`, never `#navPanel` — it runs on every resize/render
  regardless of page, and `#navPanel` is legitimate on every mobile page, not
  just Day; force-closing it there would slam it shut on an unrelated resize
  while she's mid-browse elsewhere with the nav menu open. The one case that
  genuinely should close `#navPanel` too (a resize crossing 1024px) is handled
  separately by the pre-existing `navMobileMq` change listener.
- **`#qaSlotDay` needs the same desktop-regression guard as `.day-step-row`**:
  `placeDeskGrid()`'s "on" branch gives `#qaSlotDay` a real desktop home
  (`colL`), same as `.day-step-row`/`.section-head` — so both
  `placeDayDrawers()`'s inactive-branch return AND `placeDeskGrid()`'s own
  "off" branch return line for it need the matching guard
  (`!deskGridMq.matches` / `!inDayDrawers(qa)` respectively). See the
  2026-08-18 regression below — this is the SAME bug class, just caught before
  shipping this time instead of after.
- **Scope note (disclosed, not silent)**: the fire-shortcut button and
  `#tilesAbove`/`#tilesBelow` tile shelves stay in normal in-flow visibility
  below the calendar — not hidden-by-omission, a judgment call against a
  strictly literal "nothing else on screen" reading.
- Desktop (`deskGridMq`, ≥1024px) and the 3/5/7-day mobile views are
  completely untouched — this is single-Day mobile only.
- **Regression already hit once (2026-08-18, same day, before pt.3)**: an
  earlier version of `placeDayDrawers()`'s inactive branch unconditionally
  returned `.day-step-row`/`#calDaysRow` to their mobile home marker even on
  desktop, undoing `placeDeskGrid()`'s desktop placement inside `.section-head`
  — the ONE place the pre-existing `#dayPage .day-main > .section-head
  .day-step-row { display:none }` rule (Linh, pre-dates this build: "too many
  arrows") actually hides it. Result: a visible duplicate "Today ‹ ›" row on
  every desktop load. Fixed with a `!deskGridMq.matches` guard on that one
  line. Any future "return X to its mobile home" line in this function's
  inactive branch needs the same guard if `placeDeskGrid()`'s "on" branch also
  gives that element a real desktop home — it fires on EVERY sub-1024px
  render, which is not the same set of renders as "not desktop" once you
  remember `active` can be false on tablet-width too.

**Follow-on -- left panel becomes an icon rail + expandable calendar panel
(2026-08-18 pt.8)**. Linh: the old left drawer opened one tall sheet (mini-
cal/numerology/Parts-of-life stacked above the full labelled page list) --
replaced with a narrow 52px icon-only rail (same `NAV_ITEMS`, same order as
the desktop rail) where tapping any page icon navigates straight there as
before, EXCEPT the Calendar icon, which now expands a second panel beside
the rail holding that same mini-cal/numerology/Parts-of-life block instead
of navigating anywhere. Scoped entirely to `body.dd-drawers-active` (mobile
single-Day view) -- every other mobile page keeps the old full list,
desktop's 214px sidebar is untouched.
- `#navPanelExtras` moved to be a direct child of `#navPanel` (sibling of
  `.nav-panel-scroll`, not nested inside it) specifically so it could become
  `position:fixed` without `.nav-panel-scroll`'s own `overflow-x:hidden`
  clipping it -- a transformed ancestor (`.nav-panel`, for its own slide-in)
  makes itself the containing block for a `position:fixed` descendant, which
  is exactly like an absolutely-positioned child for clipping purposes, not
  like a normal viewport-escaping fixed element. With that move,
  `#navPanelExtras`'s `left: 52px` resolves against `.nav-panel`'s own box
  (0-52px when the rail is open), landing it flush beside the rail rather
  than needing any JS-computed offset.
- `#navIconRail`/`renderNavIconRail()`/`navIconRailRowHtml()` are a THIRD
  presentation of the same `NAV_ITEMS ` array `navPanelRowHtml()`
  (`#navPanelRows`, still what every other mobile page shows) already reads
  -- one source of truth for what's in the nav, not a fork of it.
  `#navPanel`'s new `.cal-open` class (toggled by a second, independent click
  delegate on `#navPanelBody`, gated on `data-cal-toggle` rather than
  `data-view` so it never collides with the existing per-page nav clicks)
  drives `#navPanelExtras`'s width via CSS; `closeNavPanel()` clears
  `.cal-open` too, so the calendar panel never reopens pre-expanded from a
  previous visit.
- **Live-state bug found and fixed during verification, not part of the
  original spec**: `navIconRailRowHtml()`'s Calendar button initially
  hardcoded `aria-expanded="false"` and no `.cal-active` tint unconditionally
  -- correct only the instant the rail first opens. `renderNavExtras()` (and
  therefore `renderNavIconRail()`) reruns on every navigation/render pass,
  not only on open, so any re-render while the calendar panel was left open
  silently reset the icon's gold tint even though the panel itself stayed
  expanded (`.cal-open` lives on the persistent `#navPanel` element, unlike
  the rail buttons which get fully rebuilt). Fixed by reading
  `#navPanel`'s actual `.cal-open` state at render time instead of assuming
  false. Worth remembering for any future toggle-style rail button: derive
  its rendered state from the real DOM/model state, never hardcode the
  "just-opened" case as if it were the only case.
- **Verification note for this environment specifically**: this Browser pane
  doesn't composite frames when not the focused/visible surface (confirmed
  via a failed screenshot call), so CSS transitions here can report a
  `getComputedStyle` reading that's frozen at the transition's START value
  indefinitely, even seconds after the class change and even with
  `getAnimations()` showing `playState: "running"`. Not a real bug --
  temporarily setting `element.style.transition = "none"` before toggling
  the class (then re-reading) snaps straight to the true end-state for
  verification. Don't mistake a frozen mid-transition reading for a broken
  toggle in this environment; disable the transition and re-measure before
  concluding something doesn't work. Also: the `resize_window` "desktop"
  preset resets to "native size," which in a not-currently-visible pane can
  report `window.innerWidth === 0` -- pass explicit `width`/`height` for a
  reliable desktop-width check instead.
- The Month-page link that the old list's "Calendar" row provided is now
  unreachable from this rail (tapping 🗓 only expands the mini-cal panel, it
  doesn't navigate) -- a known, deliberate gap flagged rather than
  worked around with a guessed-at second control; revisit if she asks for a
  way back to the full Month overview from here.

**Fix -- reparented sidebar content leaking past the closed rail's left edge
(2026-08-19, found from a live phone screenshot after pt.8 shipped)**. Linh's
screenshot showed a ~33px vertical strip of legible text ("PARTS OF LIFE",
a mini-cal weekday letter, calendar dots) pinned to the screen's true left
edge with the rail fully CLOSED, and the day timeline shifted/clipped to
its right. Root cause, found by forcing a transition-free re-toggle and
reading real geometry (screenshots aren't available in this environment,
so this had to be diagnosed from computed styles + `getBoundingClientRect`
alone): the BASE `#navPanelExtras { padding: 0 16px 12px; ... }` rule
(written back when this element was the old always-visible stacked sheet)
was never zeroed by pt.8's new `width: 0` collapsed state -- 16px+16px of
horizontal padding plus a 1px border still rendered a real ~33px box even
at `width: 0`. That box's `left: 52px` is relative to `.nav-panel` (its
containing block), and `.nav-panel` sits at `x:-52..0` when CLOSED --
so 52px past ITS left edge lands the box at `x:0..33`, dead center of the
visible screen, not off past the rail the way it correctly sits at
`x:52..324` when the rail is OPEN. `overflow:hidden` then clipped the
reparented `#deskSidebar` content to that 33px sliver instead of hiding it.
Fix: padding/`border-right` now live ONLY on the `.cal-open` (expanded)
rule, not the collapsed base rule -- genuinely zero width AND zero padding
means there's no box left to leak, independent of its exact `left` value.
Confirmed via computed-style geometry: `width`/`padding`/`border-right` all
read `0px` when collapsed (both on a fresh load that's never touched the
drawer, and after a full open-expand-close cycle), and the expanded state
(`width:272px`, `left:52`, mini-cal `239px` wide) is byte-for-byte
unchanged from pt.8's own original verification. Lesson for any future
width-collapsible flyout built from a formerly-always-visible element:
check EVERY box-model property the base rule sets (padding, border, margin),
not just the property (here, `width`) the toggle is actually about --
a leftover box-model property can keep a "hidden" element visually present
even at zero content width.

## Mobile sizing standards (adopted 2026-08-28 — numbers, not process)
Linh: this section is deliberately about numbers, not process. It extends "Fit the
screen" / "Spacing & size" above with concrete defaults for how TALL and how DENSE
mobile components are — the gap those rules left open. These are defaults, not
suggestions: a component may exceed them only with a stated reason in the commit
report, same standard as every other numeric rule in this file.

### Row and cell heights (≤640px)
- List row, one line of content: 32–40px total, including padding.
- List row, two lines: 48–56px.
- Grid/pattern cell: 28–32px tall. Never square, never >36px.
- Day or section heading: 24–28px, small uppercase, tight.
- Nothing holding a single line of text exceeds 56px. Today's yearly birthday
  rows at ~130px for one line are exactly the failure this rule exists to
  prevent — not fixed by this commit, flagged for later prioritization.
- `.dp-t-row`'s existing 33px exception (Spacing & size, above) already sits
  inside this band — nothing to reconcile there.

### Section gaps
- Between rows in a list: 0–4px. Use tone (colour/weight), not space, to
  separate rows.
- Between sections: 16px. Never 24px+ on mobile.
- The 4/8/12/16/24/32 scale (Spacing & size, above) still governs which
  numbers are legal — on mobile, default to the LOWER half of that scale
  (4/8/12) rather than the upper half.

### Tap targets
- The existing 44px minimum (Spacing & size, above) is unchanged and still
  absolute. It is NOT satisfied by row height alone — a 32px row is fine if
  the tappable area extends to 44px via padding, or the whole row is the
  target.
- Where a compact row conflicts with 44px, the WHOLE ROW becomes the target
  rather than the row growing to fit the target.

### Where content starts
- The primary content of a page (calendar grid, list, timeline) must begin
  within the first 40% of the 697px viewport. Tool palettes, filters, help
  text and admin controls collapse by default on mobile until they do.
- This generalizes the mobile report's existing Day-view-specific "calendar
  top ... above 40% is a fail" check (see "The mobile report," below) into
  the standing default for every page, not just Day.

### Redundancy rule — the one that matters most today
- If a visual already states a fact, the text beside it must not repeat it.
  A row of coloured weekday cells already shows WHICH days; the caption
  beneath it must carry only what the cells cannot — the times. Writing
  "Mon Tue Wed Thu Fri Sat Sun 10:30pm" under seven filled cells is exactly
  the error this rule forbids.
- Before adding a caption to any visual, state what it adds that the visual
  doesn't. If the answer is nothing, don't add it.

### Text
- Never truncate mid-word, at any width. Cut at a word boundary with an
  ellipsis, or drop one type-scale step, or wrap. This has recurred across
  the event blocks, the pattern grid and the yearly list — fix it in shared
  text-truncation logic, not per component, the next time it's touched.
- Labels and headings must never render outside their container. A heading
  clipped at a screen edge is a layout bug, not a styling choice.

### Responsive columns
- Any repeating set of columns (week strips, day grids, month strips) uses
  equal fractional widths of the available space (`flex: 1 1 0` or grid
  fractions). Fixed pixel widths and absolute positioning are banned for
  these — they're what causes dates to print on top of each other at 360px
  (see the 2026-08-28 mobile Day-view week-strip fix, and the existing "a
  7-day column is ~180px on desktop and ~42px on a phone" warning under
  design44 §8, above).

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
- **Power-hour ring/bloom** (moved out of design44 R5, 2026-08-29 — a fact about the
  codebase, not a design rule, and it goes stale silently if left in a rules document):
  `POWER_HOURS` (Best/2nd Best/💰 Money = good/good/money, Worst/2nd Worst = bad) keep
  their meaning; the mark sits on the EVENT booked in a power hour, not the row. An
  event qualifies when MORE than half of its own real duration overlaps one window (not
  "starts inside") — `powerMarkFor(start, end)`, stamped `data-power="good|bad|money"`
  in `renderTimeline()`/`mdColumnHtml()`. A marked block keeps its normal Mode fill and
  gains a coloured `outline`/`outline-offset` ring (NOT `box-shadow` —
  `.tl-block[data-track]`/`.tl-item.done` both force `box-shadow:none`) plus a
  `filter:drop-shadow()` bloom (NOT a `::after` overlay — `.tl-item.done`'s Day-mode
  checkmark and `.tl-item[data-origin="repeat"]`'s stripe both already claim one),
  strongest for Money. The gutter `.power-marker` dot–line–dot (including its Money
  glow) is unchanged and sits alongside this, not replaced by it. Multi-day
  (`.md-item`/`.md-line`/`.md-bar`) keeps the ring, drops the bloom — the columns are
  too narrow for it to read cleanly.
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
## Page-header law (standing rule, adopted 2026-08-22)
Applies to every page in index.html. Linh, looking at the top of Life Map: "i need an
app universal understanding that this type of title and spacing is NOT suitable for
the app design." Book33 is a working tool opened dozens of times a day, on a phone, to
do one thing fast. The retired pattern was a magazine cover sitting on every page: a
full-width `.astro` "— BOOK 33 —" band, a centred `.bd-head` with an all-caps
`.eyebrow` tagline, a 38px display `<h1>` restating the page name, then often a bold
full-width instruction line — measured on Life Map at ~196px consumed before the first
row of actual content, on a view whose whole purpose is fitting a week on one screen.
The nav rail already names the page; the eyebrow says nothing the page doesn't. This
is not a one-time cleanup — it applies to any new page, panel, or sheet from here on.
A brief that asks for a "hero" or "title block" on a working page is answered with
this rule, not with a hero.

**The rule — a page header may not exceed 56px of vertical space, and may not restate
what the nav already says:**
1. **No eyebrow taglines.** `.eyebrow` above a page title is banned — atmosphere, not
   information.
2. **No display-size page titles.** A title, where one is needed at all, is body scale
   — the same size as a section label, not 38px, and never the display font.
3. **Prefer no page title at all.** The nav/tab bar already shows which page you're on,
   highlighted. Include a title only when the page is reachable without the nav, or
   when the title carries live information the nav can't (a date range, a count, a
   status).
4. **When a title earns its place, fold it into the content's own header row** — one
   line, sharing space with whatever else that row needs. Never its own stacked block.
5. **Instruction/help text is small and quiet** — regular weight, muted colour
   (`--ink-soft`/`--ink-faint`), one line where possible. Never bold, never full-width
   display text, never with its own large margin.
6. **The "BOOK 33" masthead (`.astro`/`.app-title`) is not page chrome.** At most once,
   on a genuine home/landing surface. Hidden on working pages via the same mechanism
   the Day view already uses (`[data-desk-day] .astro { display: none; }`) — that's
   the pattern, not the exception. Never delete `.astro`'s own markup/CSS — hide and
   unhook, so it's reversible per page.
7. **Spacing above the first real content follows 4/8/12/16/24/32, small end.**

**The test**: measure from the top of the viewport to the first row of real content at
~390px. ≤56px is correct. 56–100px needs a stated reason. >100px is a bug regardless
of how it looks. Ask of every element above that first row: *what does the user learn
from this that they didn't already know by tapping the thing that brought them here?*
If nothing — delete it.

**Not an argument against character** — Ink & Brass, gold accents, the line-icon set,
the typographic care all stay exactly as they are. The objection is specifically to
space spent restating the page's own name, and to display-scale type on utility
screens. Ornament that costs no screen height is welcome.

**2026-08-22 sweep**: her own count was 29 `.bd-head` pages; the actual sweep found
**32** — three use a compound class (`rtn-bd-head` [Routines], `cbd-head` [CBD Work,
carries a live progress line], `shop-lux-head` [Shopping, gold-glow title]) so they
read visually different from the other 29's plain centred pattern even though
structurally they're the same eyebrow+h1 chrome — all three included, same
`[data-desk-day]`-style discrepancy-disclosure precedent as the Line-spacing law sweep
below. `#cbdWorkProgress` (CBD Work) and `#wmbStats` (Work Day Board) are the only two
headers carrying genuinely live data — that data lives in a sibling of the h1, not the
h1 itself; preserved untouched. `.astro` was hidden on all 32 (no exception) — the
app's actual landing surface is `#dayPage` (`state.view` defaults to `"day"`), which
isn't part of this sweep and already suppresses `.astro` via its own established rule;
no other `.bd-head` page reads as a genuine home/landing surface.

## Life Map never scrolls (standing rule, adopted 2026-08-22)
Life Map only — every other page keeps scrolling normally. Linh: "make it so there is
no scrolling on this page whatsoever." The whole week, top to bottom, always fits the
window: no page scroll, and no scrollbar inside the grid either. If space is short,
reduce row height (down to the legible floor, currently 9px) or content — never add a
scrollbar. Reserve only what genuinely sits below the page in the current layout,
measured live (a hidden/fixed/absolute element reserves nothing) — don't assume a
fixed gap between the page and its container just because they happened to grow
together in one test. `lmComputeRowHeight()` is the reference implementation.

## Modes law (standing rule, adopted 2026-08-22)
Applies to every surface in index.html. Supersedes both the old "Work Mode / Personal
Mode" system and the old event-tag Modes system — where anything elsewhere conflicts
with this, this wins. **Documented here as the standard for future work — the actual
system-collapse implementation (retiring the Work/Personal pill, hyperfocus takeover,
per-Mode widget lists, colour re-theming, contrast checking) is a separate, large
build not yet started as of adoption.**

Linh: "i am confused on how to use it… the mode function is not at all how i want it
to be. i thought the modes would change the whole visual of the app with minimal
effort from me to navigate it." The confusion was structural: two different systems
were both called "Mode" — a day-level Work/Personal pill driven by whether a CBD Work
shift existed, and a separate per-event-tag Modes system (Morning/Work/Code/Study/
Cleaning/Night/Travel/Sleep) whose "active" one was whichever tagged block the clock
was inside. Same word, two systems, neither one she could actually switch, and the
visible effect was far smaller than "Mode" promises. This law collapses them into one.

**The rule, in one line: a Mode is an event. The calendar decides which Mode is
active. The active Mode reshapes the whole app.**

1. **One system.** The Work/Personal pill is retired. A CBD Work shift is simply an
   event tagged `work`, activating Work Mode the same way any other tagged block
   activates its own Mode. No second concept, no second word.
2. **What decides the active Mode — automatic, from the calendar, in this order:**
   (a) the longest containing block wins — a Pilates block inside a Work shift doesn't
   switch the app to Pilates; (b) nothing tagged running right now → neutral default,
   everything visible — a gap is a real signal, not a leftover state; (c) manual
   override is allowed and expires on its own — holds until the calendar's next tagged
   block naturally takes over. No other input decides the active Mode: not time of day
   alone, not a stored preference, not which page she's on.
3. **What an active Mode changes — everything it's entitled to, not one accent token:**
   colour (accent, card backgrounds, borders, surfaces all take the Mode's colour
   family; light/dark stays the user's own theme choice, never flipped by Mode); which
   widgets/sections appear on Today (each Mode carries its own widget list — Work
   shows pharmacy/board/patients tiles, Sleep hides fasting/weight, etc.); which items
   are visible (existing filtering kept, including its non-negotiable "anything hidden
   is announced by a tappable pill" rule).
4. **Hyperfocus takeover.** Every tagged block takes over the screen for its duration
   — not a separate feature or button, this is what being in a Mode means. During
   takeover, exactly three things remain: the block itself (title, time remaining, its
   own checklist), the Mode's own widgets (§3), and an "add something you picked up"
   input. Everything else is gone until the block ends. There is always a visible way
   out — a single control drops back to normal Today without changing/ending the Mode,
   and an equally visible way back in. Takeover that traps her is a bug, not focus —
   matters most on long blocks (a 10am–2pm shift, overnight Sleep).
   **Named exception (2026-08-22, Linh): Morning and Night deliberately do NOT
   auto-takeover.** They default to a visible, recoloured ambient rail instead — Mode
   name + progress + an all-at-once strip of the day's tagged items — with a manual
   Focus button that escalates into the same shared takeover screen every other Mode
   gets automatically. A knowing exception to "automatic, not a separate feature or
   button" for these two specifically, not a contradiction of it: her call, made when
   commissioning the Study/Cleaning/Morning/Night build.
5. **Configuration lives in one place** — the Modes editor: name, letter, colour, icon,
   order, widget list, per Mode. Sensible defaults ship; nothing needs setup to work,
   but every one is editable. No Mode behaviour is configured by editing an event, a
   page, or a setting elsewhere.
6. **Readability is not optional.** A Mode's colour may never render text unreadable —
   the old system tinted `--margin-rule` (also a text token), producing near-black
   text on near-black backgrounds for some Modes. Any token a Mode re-colours must be
   checked for contrast against every surface it lands on, in both themes. A Mode that
   can't meet contrast doesn't get that colour.
7. **The test** — during a tagged block: can she tell which Mode she's in without
   reading any text (colour must answer this)? Is everything on screen relevant to
   what she's doing right now (else §3/§4 is wrong)? Can she exit takeover in one tap
   and back in one tap (else §4 is broken)? Can she read every word on screen (else §6
   is broken)? Did she have to do anything to make this happen (if yes, §2 is broken)?
8. **Applies to new work** — any new page, widget or panel declares which Modes it
   belongs to. "Shows in every Mode" is a deliberate stated choice, not a default to
   fall into.

## Before finishing
- Confirm every rule is met; check dark AND light.
- Mobile report required (see §8 and "The mobile report" below) — screenshots at
  360×697 in both themes, plus the four measured numbers. A commit touching layout
  without one is not finished.
- Mobile sizing standards (adopted 2026-08-28, above) — check all six: row/cell
  heights within the stated bands; content starts within 40% of viewport; no
  caption repeating what a visual already shows; no text truncated mid-word; no
  label/heading clipped at a screen edge; every repeating column set uses
  fractional widths, not fixed px or absolute positioning.
