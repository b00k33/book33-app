# MEASURING.md — the checks that make design44 real

Split out of design44 on 2026-08-29. A rule nobody measures is a wish.
**design44 R9 makes the mobile report mandatory on every commit that touches layout.**

### Linh's phone — the reference device

Measured 2026-08-28 from the **installed app** (`display-mode: standalone`), which is how
Book33 is actually used. Every mobile check runs at these numbers. Don't substitute a
device-preset from a browser's device list — this is the real thing.

| | |
|---|---|
| **CSS viewport** | **360 × 697** — what media queries see |
| `visualViewport` | 360 × 697.67 |
| `devicePixelRatio` | 3 |
| `screen` (CSS px) | 360 × 780 |
| Real device pixels | 1080 × 2340 |
| `100vh` = `100dvh` = `100svh` = `100lvh` | 697.67px — **all four identical** |
| URL-bar collapse delta | **0px** |
| Safe-area insets | **0px on all four sides** |
| Orientation | portrait-primary |
| Pointer | coarse (touch) |
| `prefers-color-scheme` | **dark** |
| `prefers-reduced-motion` | no-preference |
| Browser | Chrome 151, Android (Samsung, 3-button navigation) |

**What follows from this:**

- **360 CSS px wide.** With the standard 16px side padding, a full-width row has **328px** of
  usable width. Any horizontal arrangement must survive that.
- **697 px tall, not 780.** ~83px goes to the status bar and Android's navigation bar even in
  the installed app. Never design against `screen.height`.
- **The viewport-height units are all the same number, and the collapse delta is 0.** A PWA
  has no collapsing URL bar, so `dvh`/`svh`/`lvh` gymnastics buy nothing here. Prefer `dvh`
  anyway — it costs nothing and stays correct if the app is ever opened in a browser tab,
  where the delta is real.
- **DPR 3.** Hairlines: a 1px CSS border is 3 device pixels. Nothing needs sub-pixel tricks.
- **All safe-area insets are 0.** No notch cutout, and the Android navigation bar sits
  outside the viewport — it's already accounted for in the 697. So `env(safe-area-inset-*)`
  padding buys nothing on this device. Keep it where it exists (it costs nothing and is
  correct on a notched phone), but never rely on it to clear the bottom bar here.
- **My phone is in dark mode.** The dark theme is what I see on mobile by default, so it is
  the first one to check, not the afterthought.
- **Reduced motion is off**, so animations do run — but they run on a phone, so keep them
  cheap.
- Landscape and the browser-tab case are not the reference. If a layout only breaks there,
  say so and leave it.

### The mobile report — required on every commit that touches layout

A rule nobody measures is a wish. Run this at 360×697 (the reference device above), in both
themes, and paste the results into the commit report:

1. **A screenshot.** Not a description of one.
2. **Horizontal overflow** — `document.body.scrollWidth <= innerWidth` must be true.
3. **Where the content starts** — for calendar pages, the top of `#timelineScroll` /
   `#mdTimelineScroll` as a px value and as a % of the viewport. Above 40% is a fail.
4. **Tap targets** — every interactive element ≥44px on its short side, or a stated
   reason.
5. **The tower check** (below). Any element failing it is a bug, not a layout quirk.

If a number got worse than the previous commit, say so rather than shipping it quietly.

**Tower check.** Measure the same element at 1440px and at 360px. If it is more than
twice as tall on the phone, a desktop-tuned rule is misfiring — almost always a
`min-width` bigger than the container it now sits in, forcing a permanent flex-wrap.
Find the rule and give the narrow case its own shape; do not shrink the type.

Trigger the narrow shape on **container width, not viewport width** — a container
query or a measured JS class, never another `@media`. Viewport-width media queries are
what caused this: a 7-day column is narrow at every viewport, and 5/7-day columns on a
phone are narrower still. (`mdAlldayNarrowPass()` in index.html is the reference
implementation — it measures each birthday chip's own rendered height and stamps
`data-narrow`, rather than guessing a column-width cutoff; see its own comment for why
width alone wasn't enough.)

**Copy-paste console check** (verified runnable against this build — an earlier version
compared a rounded top against an unrounded one and falsely flagged the calendar's own
wrapper as sitting "above" itself; fixed here by excluding the calendar element and its
ancestors, not just an exact id match):
```js
(() => {
  const tl = [...document.querySelectorAll('#mdTimelineScroll,#timelineScroll')]
    .find(e => e.getBoundingClientRect().height > 0);
  const top = tl ? Math.round(tl.getBoundingClientRect().top + scrollY) : null;
  const main = document.querySelector('.day-main');
  const above = [...(main ? main.children : [])].filter(e => {
    if (e === tl || (tl && e.contains(tl))) return false;
    const s = getComputedStyle(e), b = e.getBoundingClientRect();
    return s.display !== 'none' && !e.hidden && b.height > 0 && (b.top + scrollY) < top;
  }).map(e => ({ id: e.id || '.' + String(e.className).split(' ')[0],
                 h: Math.round(e.getBoundingClientRect().height) }));
  console.table(above);
  console.log('calendar top:', top, '=', Math.round(top / innerHeight * 100) + '% of viewport',
              '| overflow:', document.body.scrollWidth > innerWidth,
              '| drawers:', document.body.classList.contains('dd-drawers-active'));
})()
```

**Baseline, as of `223e356`** (360×697, mobile Day view) — beat these, don't just
match them. Re-measured 2026-08-29 for the 412×915→360×697 correction (see the
"Linh's phone" table above); an older set of figures was genuinely taken at 412×915
and is retired, not just relabeled — flagging that discrepancy here rather than
silently carrying the wrong device's numbers forward. Two things changed since that
older baseline besides the width: `#nowGlanceStrip` is a new, disclosed 4th permanent
element above the calendar (the Now-screen job, `1067ed2`), and this account's real
data no longer has a day with 0 all-day items to measure against — every day carries
at least one recurring all-day routine now, so "0 all-day items" from the old table
couldn't be reproduced. These numbers are today's real all-day content, not an empty
day:

| Day-count | Calendar top | % of viewport | Elements above it |
|---|---|---|---|
| 1 | 279px | 40% | `ddGrab` (51px), `nowGlanceStrip` (73px), `dayAlldayRow` (86px) |
| 3 | 189px | 27% | `ddGrab` (51px), `nowGlanceStrip` (73px) |
| 5 | 189px | 27% | `ddGrab` (51px), `nowGlanceStrip` (73px) |
| 7 | 189px | 27% | `ddGrab` (51px), `nowGlanceStrip` (73px) |

1-day sits right at the 40% ceiling — worth a look, not touched by the commit that took
this measurement. 3/5/7 render 1-day underneath (360px is below the multi-day flip point)
but without `dayAlldayRow` in this pass's reading — that asymmetry wasn't chased down
there since it was outside that commit's scope; flagging it rather than filing it away
silently.
