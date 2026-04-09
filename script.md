Read me to get a better understanding of @script.js before you dive into the code.

## What this app does
A location-based scavenger hunt. The user navigates to GPS waypoints in sequence. As they get closer, the background color shifts red → yellow → green and the egg icon shakes with increasing intensity. On arrival, they tap the egg to reveal a hint, then tap again to advance to the next stop.

## Key sections (in order)

**WAYPOINTS** (line 6) — Array of stops. Each has `lat/lng`, a `hint` describing how to find *that* stop (shown in hint-bar on load for stop 0; revealed on tap at the previous stop for all others), and an optional `secondaryHint`/`secondaryRange` proximity teaser. Final stop is detected by index, not a null hint.

**CONFIG** (line 32) — `RANGE_FEET` (arrival radius, default 10 ft), `FAR_FEET` (fully-red distance, default 200 ft).

**STATE** (line 38) — `currentIndex` (which waypoint), `phase` (`'navigating'` | `'hint-shown'` | `'complete'`), `distMeters` (live distance to current waypoint).

**Tap handler** (line 61) — Single `click` on `#egg-container`. Logic:
- `navigating` + inside range → reveal hint (or `complete` if final stop)
- `hint-shown` → persist hint to top bar, increment `currentIndex`, back to `navigating`

**`renderUI()`** (line 113) — Called on every GPS update. Sets background color, distance display, egg emoji (`🥚` vs `🐣`), and speech bubble text based on `phase` + `distFt`.

**`animateEgg()`** (line 182) — `requestAnimationFrame` loop. Shakes the egg on x/y/rotation using mixed sine frequencies. Amplitude ramps up quadratically inside 100 ft; stops when arrived or hint is shown.

**Geolocation** (line 156) — `watchPosition` calls `onPosition` → recalculates `distMeters` → `renderUI()`.

## Phase state machine
```
navigating ──(arrive + tap)──► hint-shown ──(tap again)──► navigating (next stop)
navigating ──(arrive + tap, final stop)──► complete
```
