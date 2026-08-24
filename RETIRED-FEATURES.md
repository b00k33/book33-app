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
- **`CATS`, `saveCategories()`, `applyCategoryColours()`, `regenerateCategoryStyles()`,
  `catDotColor()`, `resolveEventColorHex()`, the `--*-seed` / `--cat-c` / `--cat-t`
  tokens** — all still live. They are the calendar's **quiet colour fallback**.
- **Why the fallback exists:** Linh's instruction was to colour the calendar by **Mode**
  instead. Mode colouring already wins wherever a Mode is set (`regenerateModeStyles()`
  emits `.tl-item[data-mode="…"]` rules that override the track rules). But **Mode is an
  optional field** — measured against her real data on 2026-08-24, **47 of 118 items had
  no Mode**, including nearly every clinic patient appointment. Without the fallback her
  clinic day would render colourless. She chose the fallback explicitly.
- **So:** Mode decides the colour when set; track decides it silently when not. Neither
  is ever *named* on screen.

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

## 6. Known dead code left in place (intentional)

Self-contained, unreachable, and harmless — left rather than torn out, and disclosed
here so nobody "discovers" it and wires it back up:

- `renderCategories()`, `catRowHtml()`, `catReassignHtml()` and the `#categoriesPage`
  delegates' `data-cat-*` branches (no `#catBody` element exists any more)
- `renderRtnGridNested()`, `renderRtnGridCardsNested()` (only reachable via the removed
  `trackcat` grouping)
- `syncWho()`, `syncTrack()`, `syncTrackSummary()` (null-guarded no-ops now; their
  callers exist for the data round-trip in §4)
