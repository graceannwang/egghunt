Read me to get a better understanding of @script.js before you dive into the code.


## Key sections (in order)

**ALL_WAYPOINTS** (line 6) — Object with two keys (`emerald`, `lilac`), each an array of stops. The active team is read from the `?team=` URL param (defaults to `emerald`); an unrecognized value also falls back to `emerald`. Each stop has `lat/lng`, a `clue` (shown in clue-bar on load for stop 0; revealed on tap at the previous stop for all others), and an optional `secondaryClue`/`secondaryRange` proximity teaser. Final stop is detected by index, not a null clue.

**CONFIG** (line 32) — `RANGE_FEET` (arrival radius, default 10 ft), `FAR_FEET` (fully-red distance, default 200 ft).

**STATE** (line 38) — `currentIndex` (which waypoint), `phase` (`'navigating'` | `'clue-shown'` | `'complete'`), `distMeters` (live distance to current waypoint).

**Tap handler** (line 61) — Single `click` on `#egg-container`. Logic:
- `navigating` + inside range → reveal clue (or `complete` if final stop)
- `clue-shown` → persist clue to top bar, increment `currentIndex`, back to `navigating`

**`renderUI()`** (line 113) — Called on every GPS update. Sets background color, distance display, egg emoji (`🥚` vs `🐣`), and speech bubble text based on `phase` + `distFt`.

**`animateEgg()`** (line 182) — `requestAnimationFrame` loop. Shakes the egg on x/y/rotation using mixed sine frequencies. Amplitude ramps up quadratically inside 100 ft; stops when arrived or clue is shown.

**Geolocation** (line 156) — `watchPosition` calls `onPosition` → recalculates `distMeters` → `renderUI()`.

## Phase state machine
```
navigating ──(arrive + tap)──► clue-shown ──(tap again)──► navigating (next stop)
navigating ──(arrive + tap, final stop)──► complete
```
