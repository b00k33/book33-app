# RETIRED FEATURES — never re-add without an explicit request

Read this before adding any field, picker, tag, column, filter, legend, or settings
page to Book33. Everything listed here was **deliberately removed by Linh**. It must
never be re-added, re-shown, or referenced in new code unless she asks for it back
**by name**.

If a spec, mockup, older code comment, or an older entry in `CLAUDE.md` implies one of
these should exist, **this file wins** — the removal is newer than any of it. Flag the
conflict to her rather than quietly reinstating the feature.

---

## 1. Whose job — retired 2026-08-24

The `Mine / <partner> / Both of us` picker on the event add/edit form.

**Removed:** the `Whose job` label, its collapsed summary button, its picker
(`#fWhoField` / `#whoSummaryBtn` / `#whoPicker`), the `.who-summary-btn` component,
and the small `who-chip` badge that used to print on calendar blocks.

**Kept, deliberately:** the underlying `e.who` property, plus `whoOf()` / `WHO_IDS` /
`whoLabel()` / `whoEm()`. These are still live for two *separate* features that were
never part of this retirement and still have their own controls:
- the **Us page** (division-of-labour board — Mine / Partner / Both columns)
- the **quick-add bar's** own who parsing

`formWho` and `syncWho()` also stay: an existing item's real `e.who` is still loaded
into the form on edit purely so re-saving round-trips it unchanged (see §4).

## 2. Part of life — retired 2026-08-24

The life-category field (`Work / Marriage / Personal / Family / …`), internally the
`track` property and the `CATS` array.

**Removed — every picker:**
- Event form (`#trackPicker` / `#trackSummaryBtn`)
- Routine form (`#rtnTrackPicker`)
- To-do form (`#todoTrackPicker`)
- Person form (`#pplTrackPicker`)
- Habit builder's "Category" colour-swatch picker (`#hbCats` / `drawHbCats()`)

**Removed — every visible tag, label, column, legend, filter and grouping:**
- the `🏷 Personal` row and hero crumb in the event detail sheet
- the `· Personal` subline on desktop day-view blocks (clinic patient counts stay)
- the `title="Personal"` tooltip on the small life-dot (the dot itself stays — quiet
  colour only, see §3)
- the People page's `Part of life` column
- the Routines list's `WORK / MARRIAGE / PERSONAL` group bands (it's one flat list
  sub-headed by Category now)
- the Routine Library's `Track` column, its sort, and its `Group by: Track` and
  `Group by: Track ▸ Category` options (default is `Group by: Category`)
- the Habits grid's colour legend and its per-track band headings
- the All Events page's `Filter by life area`
- the deleted-items archive's per-row track sub-label
- the saved-preset card's track subline (a preset with no Mode shows no subline)
- the quick-add search result's track subline

**Removed — the management page:** the "Categories & colours" table (rename, recolour,
add, remove, reassign). The page itself survives as **Appearance**, holding only the
Night / Day / Auto theme picker.

## 3. What was deliberately KEPT — do not "finish the job"

Removing these would be a regression, not a cleanup:

- **`e.track` / `t.track` / `p.track` are still written on every save.** Existing values
  in localStorage are untouched. See §4.
- **`CATS`, `saveCategories()`, `applyCategoryColours()`, `catDotColor()`,
  `resolveEventColorHex()`, the `--*-seed` tokens** — all still live.
  `catDotColor()`/`--*-seed` still colour the small life-dot on blocks/cards, the
  5/7-day legend (`mdLegendHtml()`) and the "Piling up" dot — the last surfaces that
  render a per-track colour anywhere.
- **2026-08-26 update ("No Mode becomes one neutral"):** the per-track colour
  *fallback* this section used to defend is **gone**. A Mode-less item no longer
  borrows its part-of-life colour — every no-Mode block/chip/bar/dot renders ONE
  neutral (`--track-neutral`, plus a deeper `--track-neutral-bar` for the textless
  bar/dot tier). `regenerateCategoryStyles()` still exists but is a no-op (its
  callers survive); the `--cat-c` / `--cat-t` tokens are still the calendar's colour
  plumbing, now carrying **Mode accent when set, the one neutral when not**. The old
  justification (2026-08-24: 47 of 118 real items had no Mode, so a clinic day would
  render "colourless" without the track fallback) was re-decided by Linh: those items
  now *deliberately* render neutral — quiet, uncoloured, receding — instead of
  encoding a category she can no longer see or set anywhere.
- **So (current):** Mode decides the colour when set; nothing decides it when not —
  no Mode *is* the one neutral. Track is never named or coloured on a block again.

## 4. Data policy — this is a UI retirement, not a data migration

**Never write a migration that strips `who` or `track` from stored records.** Existing
values stay in localStorage indefinitely, unread except for the colour fallback above,
so either field could be brought back with nothing lost. The forms still round-trip the
values they load, precisely so editing an old item doesn't quietly erase them.

## 5. Chains — retired 2026-08-24

The ⛓ chained-routine feature (Linh: "i dont use chains so remove the visibility of it
from the pages and make the function stale").

**Removed — every entry point and display surface:**
- Nav-rail chapter entry (`{ id: "chains", ... }` under CH22/Plan)
- The Chains card on the Routines page (`#rtnChainsHead` / `#rtnChains`, its mobile
  collapse toggle, and the `renderChains()` call that filled it)
- The `⛓` pill on a chained routine's List/Cards row
- `#rtnChainField` ("Chain to another routine") in the routine editor
- `#fPhaseField` ("Chain phase") and `#fChainField` ("Chain to another routine") in the
  event/Repeats form
- The `⋯` row menu's "🔗 Start a chain" item
- The detail-sheet `⛓` relationship row (`chainRowHtml`) and its Before/Event/After
  phase-bands block (`chainPhaseBandsHtml`)
- The `renderPhaseFlowChips()` / `renderChainLayer()` calls in `renderDay()` (`#chainChips`
  and `#chainLayer` now stay permanently empty, same "called nowhere" shape §5 below
  already uses for `renderAlldayRow()`)

`#chainsPage` and its page-router wiring are left in place — harmless, now genuinely
unreachable (nothing left sets `state.view = "chains"`).

**Kept, deliberately — this is a stale-function retirement, not a data removal:**
- `t.anchorTo` / `t.anchorMode` / `t.deadline` / `t.deadlineLabel` / `t.chainName` /
  `t.chainAutoCalendar` / `t.phase` on `ROUTINE_TASKS`/`RECURRING_EVENTS`/`EVENTS` —
  untouched. One real routine (`pre-datenight`) already has a live `anchorTo` link.
- Every resolver that reads them — `chainAnchorOf`, `chainGrantsOn`, `chainNodeOccursOn`,
  `chainDeadlineStartMin`, `chainedStartMinOn`, etc. — **unchanged**.
  `chainGrantsOn()` is called from inside `routineOccursOn()`/`recurringEventOccursOn()`,
  the core "does this occur today" functions for every routine/event in the app — this is
  NOT optional feature code, it's load-bearing for any existing anchorTo link and must
  never be short-circuited.
- ICS export's chain-aware handling — untouched, so an already-linked routine keeps
  exporting correctly.
- The `liveChainIds`/`fromChain`/`chainPin` tagging inside `renderDay()`'s dayEvents
  pass — untouched. It also drives `renderTimeline()`'s 16px right-nudge on a chained
  block, which is occurrence/positioning behaviour, not display chrome, so it stays.
- `renderChains()`, `renderChainLayer()`, `renderPhaseFlowChips()`, `chainRowHtml`'s
  builder logic, `chainPhaseBandsHtml()`, `loadChainIntoBuilder()`, `rtnActChain()`,
  `saveChainNode()`, `chainableEvents`/`chainPool`/`chainNodeById` — all still defined,
  called from nowhere. Same "stale, not deleted" treatment as the pre-existing Stage 1
  `CHAINS`/`loadChains()`/`saveChains()` set (§5 below), which was already dead before
  this pass and needed no changes.

**Do not** wire any removed button back up, and do not touch the resolvers above —
existing chain data must keep occurring/positioning/exporting correctly forever, even
though nothing can create a NEW link through the UI any more.

## 6. Variable hour-row heights — retired 2026-08-26

Every hour row on the calendar grid (single-day, multi-day, mobile) is now the SAME
height — `HOUR_H()` (`--hour-h`) — for every hour the "Hours shown" trim doesn't
collapse to 0. This retires TWO earlier, separate features that both grew a row taller
or shorter than that one shared height:

- **2026-08-04, "hours size to their content automatically"** — an empty hour shrank
  to `compactH()`'s 22px, a busy one stayed full height.
- **2026-08-24/25, "three plain preset heights"** — a power hour (Best/2nd Best/Money)
  or a bad hour (Worst/2nd Worst) drew at its own fixed preset (139/56px) regardless of
  `--hour-h` or busy/empty.

Linh's own reasoning: a 2-hour block should look exactly twice as tall as a 1-hour
block, which a variable-height grid can never guarantee — "the way Google Calendar
does it." Power/bad hours still matter to her; the mark moved from the ROW onto
whichever EVENT is genuinely mostly inside the window instead (see below).

**Removed (retired, not deleted — left in place, unreferenced):**
- `computeCompactHours()`, `state.compactHours`, `compactH()`'s call from `hourRowH()`,
  the `.hour-row.empty`/`.has` class distinction in `buildHoursHtml()`.
- `POWER_HOUR_TYPE_H`, `powerHourH()`'s call from `hourRowH()`.
- `hourRowH()` itself is simplified to two branches: the "Hours shown" trim → 0,
  otherwise `HOUR_H()`. Nothing else.

**Added in its place:** `powerMarkFor(start, end)` — an event counts as a power-hour
event when MORE than half of its own real duration overlaps one window (not "starts
inside", not "touches"). Stamped as `data-power="good|bad|money"` in `renderTimeline()`/
`mdColumnHtml()`. The block keeps its normal Mode fill and gains a coloured
`outline`/`outline-offset` ring plus a `filter:drop-shadow()` bloom (deliberately NOT
`box-shadow` — `.tl-block[data-track]`/`.tl-item.done` both force `box-shadow:none` —
and NOT a `::after` overlay — `.tl-item.done`'s Day-mode checkmark and
`.tl-item[data-origin="repeat"]`'s stripe both already claim one). Multi-day
(`.md-item`/`.md-line`/`.md-bar`) keeps the ring, drops the bloom — too narrow.

**Kept, deliberately, exactly as before:** `POWER_HOURS` (the five times/labels/kinds),
`powerHourPopoverHtml()`, the Money digit treatment, `#powerNote`, and the gutter
`.power-marker` dot–line–dot (including its Money glow) — only the ROW-HEIGHT role of
power hours is gone; everything else about them is unchanged. The "Hours shown" trim
(`hourRange`/`hourTrimActive()`/`computeHourRange()`) and pinch-to-zoom on `--hour-h`
are both untouched.

**Desktop `--hour-h`:** 96px (94 light) → 54px (53 light) — 96 was tuned for a grid
where most hours actually drew at 22px; with every hour now genuinely that tall, 96
would force far more scrolling than before. Measured live at 1440×900: the default
"Hours shown" range (6am–10pm, 16 hours) fits with effectively no scroll at 54px.
Mobile/tablet/base `--hour-h` (74/77px) were already the "busy ordinary" values and
needed no change — they're just uniform now too.

## 7. Known dead code left in place (intentional)

Self-contained, unreachable, and harmless — left rather than torn out, and disclosed
here so nobody "discovers" it and wires it back up:

- `renderCategories()`, `catRowHtml()`, `catReassignHtml()` and the `#categoriesPage`
  delegates' `data-cat-*` branches (no `#catBody` element exists any more)
- `renderRtnGridNested()`, `renderRtnGridCardsNested()` (only reachable via the removed
  `trackcat` grouping)
- `syncWho()`, `syncTrack()`, `syncTrackSummary()` (null-guarded no-ops now; their
  callers exist for the data round-trip in §4)
- `computeCompactHours()`, `POWER_HOUR_TYPE_H`, `powerHourH()` (§6 above — their
  ROW-HEIGHT role is retired; `POWER_HOURS` itself is still very much live)

## 8. Nav rail trim — retired 2026-08-26

Linh: "cut the nav rail down to the pages I actually use. It currently pins twelve,
and I use six." `NAV_ITEMS` (the single array read by `navPanelRowHtml()`,
`navIconRailRowHtml()`, `navTabRowHtml()` and `dnrRailRowHtml()`) cut from 13 rows to
6 pinned pages + Settings: **day → Today, month → Calendar, lifeMap → Life Map, events
→ Events (new — see below), people → People, health → Body**.

**Unpinned (removed as a rail row only):** Presets, Habits, Nutrition, Medical, Money,
CBD Work, Growth.

**This is a rail retirement, not a page retirement — same distinction §5 (Chains) and
§6 draw.** Every one of the 7 unpinned pages keeps its own page, route and
`CATEGORIES` entry completely untouched, and stays reachable two ways regardless of
NAV_ITEMS membership: the ▤ Chapters accordion (`navPanelChaptersHtml()` /
`dnrChaptersHtml()`, both read `CATEGORIES` directly, never `NAV_ITEMS`) and the
quick-add bar's "go to X" (`qaFindView()`, same `CATEGORIES` source). Confirmed both
routes independently resolve all 7 before cutting anything — see the full per-page
route audit that was run before this change; medical/money/cbdWork/growth have only
these two generic routes (no page-specific shortcut existed for them before either),
habits and presets are the best-covered with several extra dedicated entry points
each (Today-page cards, the fire-shortcut button, the Upkeep dial, etc.) — none of
that changes here.

**The one real loss — a live badge, not a route:** Medical's rail row carried
`count: () => needsBooking()`, a live count of overdue/soon medical checks. Checked
whether that count surfaces anywhere else in the app before unpinning: **it does not**
— `needsBooking()` had exactly one caller (that row), and no other widget, dashboard
tile, or page shows this number. The Medical page's own `#medNeeds` section ("Needs
booking") computes the same overdue/soon filter in place, but that's the Medical page
showing its own detail list to itself, not a second surfacing elsewhere. `needsBooking()`
is kept in place, unreferenced, per this file's "stale, not deleted" convention — see
its own preceding comment in index.html (~line 43020) — MEDICAL.checks/medStatus() are
both still live, so reviving the badge is a one-line change, not a rebuild.

**A second, smaller badge loss, same shape:** Presets carried `count: () =>
SAVED_EVENTS.length`. Not separately investigated for other surfacing (not asked), but
disclosed here alongside Medical's since it's the same kind of loss — a live number
that only ever appeared on this now-unpinned rail row.

**Added, not retired — noted here only because it's adjacent:** Events (`events`)
is a brand-new NAV_ITEMS row. It already had a page, a route, and a `CATEGORIES`
entry (`calendar` chapter, "Plan" group) — it simply had no rail row until now. Its
desktop-rail icon (`B33_ICONS.events`) uses a new colour token, `--ic-violet`
(declared alongside `--ic-green`/`--ic-blue`/`--ic-sky`, all three declaration
sites), since violet was genuinely unused anywhere else and can't be mistaken for an
existing category colour.

**Kept, deliberately, exactly as before:** `CATEGORIES` itself; every unpinned page's
own render function, data and routes; `B33_ICONS` entries for unpinned pages (still
shown inside Chapters); the Chapters row and Settings footer row, both untouched
including their separators.

## 9. Mobile Day-view header rows — retired 2026-08-27

Measured live at 412×915, mobile Day view, drawer open: `.nav-tiers`' "August ▾"
control, `#dayRow2`'s big date, and `.day-step-row`'s `‹ Thursday 27 August › ⚙` row
printed the same date **three times** and cost 138px of drawer content before this
change. Linh: "it should be at the top row, that information is redundant." Replaced
by a 7-day strip in the top bar itself (`#navDayStrip`, `renderNavDayStrip()`) — tap a
day to jump to it, swipe to step the window (reuses `bindSwipe()`, the same function
the calendar grid's own swipe already used).

## 10. All Events "Every year" Date order / A–Z toggle — retired 2026-08-29

The `#evlYearSortToggle` control (`Date order` / `A–Z` buttons) on the All Events
page's Repeats → Pattern → Every year section, and the month-grouped list it
controlled (`.evl-year-months` / `.evl-year-month-block` / `.evl-year-month-head`).

**Why:** the All Events rebuild (Commit 3) replaced the whole "Every year" list with
twelve always-present month rails (`renderYearRails()`), inherently date-ordered —
January to December, always. A-Z has no meaning on a twelve-month axis, so the
toggle's second option stopped being a real choice.

**Removed:** the toggle markup and its click handler (search "evlYearSortToggle" in
git history if you need the old code). `.evl-year-row` / `.evl-year-row-name` /
`.evl-year-row-freq` / `.evl-year-row-date` were **not** removed — they're still live
for the "Everything else" bucket (monthly/interval/sinceLastDone/numMoney), which
Commit 3 explicitly left untouched.

**Kept, deliberately:** the stored `PREFS.evlYearlySort` key — nothing reads it any
more, but leaving it in place means an old saved value on her device never throws.

**Removed (hidden, not deleted — CSS `display: none`, mobile-only, ≤640px):**
- `#navMonthBtn` / `#navMonthPop` (the "August ▾" control) — its month-name label and
  its own 1/3/5/7 day-count picker (a 4th redundant copy) both retire outright.
- `.day-step-row` (`#dayStepToday` / `#dayStepPrev` / `#dayStepDate` / `#dayStepNext`)
  — subsumed by tapping a day in the strip (jump anywhere, including today) or
  swiping it (step the window).
- `#dayRow2 .date-row` (`#dateBig`, and the `#dateTrigger` dropdown holding
  `#prevDay`/`#todayPill`/`#nextDay`/`#patientsNudge`) — same reason. `#patientsNudge`
  ("🩺 Today's Patients") was already `display:none` on mobile before this change
  (an unrelated, pre-existing rule, confirmed live) — nothing reachable on phone was
  lost by retiring the row around it.
- `#weekday`'s weekday-NAME text ("Thursday"/"Thu") — the strip's own weekday letter
  replaces it. Its planet-ruler glyph+popover did **not** retire — see below.

**Moved, not retired — real facts that needed a new home:**
- `#udBadge` (UD9) and `#weekday`'s planet-ruler glyph (e.g. "♃ Jupiter" for
  Thursday) both physically moved into `#numGroupStrip`, as its first two children —
  Linh's own instruction for UD9 ("move it into #numGroupStrip with the other
  numerology chips"), extended to the planet glyph on the same reasoning: it was
  never a date duplicate, just co-located with one.
- `#dayNavGear` (⚙) physically moved into `.topbar-right`, same id, same handlers
  (`gearAnchorEl()`/`renderDdtGearPop()` — zero JS changes needed).
- **2026-09-02 — the phone's "Days shown" 1/3/5/7 row moved out of the ⚙ sheet into
  the date sheet** (`#dateSheet`, `renderDateSheet()`, opened from the date title).
  Linh: "mobile app doesnt show 3 5 or 7 das" — the ⚙ copy was the only one left on
  the phone and she never found it. Same `.cal-days-btn`/`data-cal-days` markup and
  the same document-level delegate; ⚙ keeps Day starts/ends, Week view and
  Notification settings. Also retired the same day: `calDaysRenderCount()`'s
  2026-08-29 narrow-phone guard that rendered 1 day for any 5/7 pick — the grid's own
  bars-plus-legend fallback (2026-08-25) is what renders narrow columns now.
- `#navMonthPop`'s "Week view" jump (`state.view = "week"`) had no other entry point
  anywhere in the file — moved into the ⚙ gear sheet as `#ddtGearWeekView`.
  "Month view" did **not** move — already reachable via the ☰ menu's own "Calendar"
  row (`NAV_ITEMS`), confirmed before dropping it.

**Confirmed separate, untouched:** `#mdColHeads` (the multi-day grid's own per-column
day headers) — a different, necessary element, not a duplicate of the new strip.
`.mini-cal-wrap` (the mini month grid) — already lived in the ☰ drawer on mobile
Day view before this change, never inside the rows retired here.

## 11. design44 → design45 — retired 2026-09-02

Linh supplied a full Day-view mock ("i really like this design. use it") and then
"remove and delete design44". CLAUDE.md's design44 (one-screen summary, R1–R19, the
Black & Brass palette note) is deleted; design45 replaces it. In the app itself:

**Retired (hidden, not deleted — CSS, the design45 block at the end of the stylesheet
restates every older rule at equal/higher specificity):**
- The 52px **icon-only** desktop nav rail and the phone's 52px icon rail inside
  `#navPanel` — both are labelled now (`.dnr-lbl` / `.nir-lbl`). The `.rail-teach`
  "show labels for a few seconds" CSS is gone with them; `openNavPanel()` still adds
  the class, harmlessly.
- The top bar's own `BOOK33` wordmark (`.ddt-word`) on the desktop Day page — the
  rail head carries the date badge + word now (the mock's top-left mark).
- The **"Numerology"** heading on `#railNum` — the card is headed "Today" (it IS the
  mock's TODAY card; the eight tiles are unchanged). The tile icon row
  (`.rail-chip-ic`) is hidden on desktop so all eight tiles sit at one height.
- `.mini-cal-mascot` (the PY · motif · UY · CD row under the desktop mini month) —
  PY is a tile, CD is the top-bar cycle chip (`cycleAlldayChipHtml()` now prepends
  into `#ddtAllday`).
- Day theme's black structural accent (`--margin-rule: #111111`) and the navy
  `#253A5E` accent — the one accent is blue `#2F5BEA` (Night `#6C8CFF`).
- The 3px "square-ish" block radius (Day + phone) — 10px in both themes.
- The gold/navy now-line — the now-line and the cycle chip are "dark red wine"
  (`--now-mark` / `--cycle-ink`), her answer to the mock's pink. **Pink is banned
  everywhere again.**

**Un-retired (deliberately brought back):** the mini month on the desktop Day
sidebar. Two earlier rules hid it as redundant (`#dayPage .mini-cal` and
`[data-desk-day] #deskSidebar .mini-cal`, both display:none); her answer 3 ("TODAY
tiles + mini month") puts it back, so the design45 block overrides both.

**Not built, on purpose:** the mock's ⋮ per calendar block — tapping the block
already opens the detail sheet, and her standing "verify then remove redundancy"
rule forbids a second control with the same handler. The mock's UP NEXT card
("mock, minus whats next") and the on-demand NOW rail (she kept RIGHT NOW always
open) were declined by her, not by me.

## 12. Session card "Stay 15 more →" — retired 2026-09-03

Linh: "remove stay 15 more, i dont use it". The link in the session card's head
row (`.sc-stay-link`, `data-sc-extend="15"`, added 2026-08-31 as the one surviving
ending-action) no longer renders. Kept in the JS, unreferenced: `extendSession()`,
the `[data-sc-extend]` click branch, `bookAnotherSession()` / `moveToNextSession()`
and their branches, and the `.sc-stay-link` CSS. A session now always auto-ends at
its scheduled time (sessionTick); to keep going she reschedules the block itself.

Also that day: **Mode takeover and Mode calendar filtering became opt-in**
(Settings → Modes, `PREFS.modeTakeover` / `PREFS.modeFilter`, both off by default,
her "stop modes from taking over screen and calendar"). Nothing deleted — the
Focus button, takeover overlay and Mode badge all come back when switched on.

**Desktop/tablet:** none of the CSS above applies past 640px — `.day-step-row`
already had its own, older, unrelated desktop hide rule (`#dayPage .day-main >
.section-head .day-step-row { display: none }`, "too many arrows"); `#navMonthBtn`/
`#dayNavGear`/`.nav-day-strip` all share one base rule (`display: none` outside the
mobile media query, same list `.nav-search-btn`/`.nav-mode-badge`/`.day-fab` already
use) so nothing new renders above 640px. `#ddtGear` (desktop's own separate gear) is
untouched.
