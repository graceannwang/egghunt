Read me to get a better understanding of @script.js before you dive into the code.

`ALL_WAYPOINTS` lives in @waypoints.js (loaded before script.js). Edit waypoints there.

**ALL_WAYPOINTS** Object with keys (`emerald`, `lilac`, `test`), each an array of stops. The active team is read from the `?team=` URL param (defaults to `emerald`); an unrecognized value also falls back to `emerald`. Each stop has `lat/lng`, a `clue` (shown in clue-bar on load for stop 0; revealed on tap at the previous stop for all others), and an optional `secondaryClue`/`secondaryRange` proximity teaser. Final stop is detected by index, not a null clue. Each stop also has an `id` string (e.g. `'busstop'`, `'fieldhouse'`) used for dev/testing only — pass `?start=<id>` to jump directly to that waypoint.

## Key sections (in order)

**CONFIG** (line 3) — `RANGE_FEET` (arrival radius, default 10 ft), `FAR_FEET` (fully-red distance, default 200 ft).

**STATE** (line 13) — `currentIndex` (which waypoint), `phase` (`'navigating'` | `'clue-shown'` | `'complete'`), `distMeters` (live distance to current waypoint).

**Tap handler** (line 36) — Single `click` on `#egg-container`. Logic:
- `navigating` + inside range → reveal clue (or `complete` if final stop)
- `clue-shown` → persist clue to top bar, increment `currentIndex`, back to `navigating`

**`renderUI()`** (line 88) — Called on every GPS update. Sets background color, distance display, egg emoji (`🥚` vs `🐣`), and speech bubble text based on `phase` + `distFt`.

**`animateEgg()`** (line 144) — `requestAnimationFrame` loop. Shakes the egg on x/y/rotation using mixed sine frequencies. Amplitude ramps up quadratically inside 100 ft; stops when arrived or clue is shown.

**Geolocation** (line 131) — `watchPosition` calls `onPosition` → recalculates `distMeters` → `renderUI()`.

## Phase state machine
```
navigating ──(arrive + tap)──► clue-shown ──(tap again)──► navigating (next stop)
navigating ──(arrive + tap, final stop)──► complete
```
