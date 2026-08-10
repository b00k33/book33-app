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
- Only 4/8/12/16/24/32px for margins/padding/gaps.
- One corner radius for cards, one for pills. One type scale (title/body/label).
- Minimum tap target 44px.
## Alignment & symmetry
- Equal left/right padding, balanced top/bottom. Items share one left edge and
  consistent columns. Label/value pairs aligned. Group related items evenly.
## Colours — Ink & Brass, one source of truth
- Use ONLY Ink & Brass variables (--ink*, --*-seed, --*-ink, --tl-*-bg,
  --accent-seed). Never hardcode a hex in a component. Works in dark AND light.
  Track colours come only from --*-seed.
## Components
- Reuse the same button/pill/card/row styles everywhere; no one-offs.
- Every editor for an event, task or routine (the add/edit popup or panel) MUST have a
  Save button in its TOP-RIGHT corner (reuse .addform-head-save), so it can be saved
  without scrolling to the bottom. Keep the bottom Save/Cancel bar too.
## Before finishing
- Confirm every rule is met; check dark AND light; check nothing is cut off or
  overlapping at 360px.
