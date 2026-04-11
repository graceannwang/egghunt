// ALL_WAYPOINTS is defined in waypoints.js, loaded before this script.

const params    = new URLSearchParams(location.search);
const teamId    = params.get('team') || 'emerald';
const WAYPOINTS = ALL_WAYPOINTS[teamId] ?? ALL_WAYPOINTS.emerald;

const startId    = params.get('start');
const startIndex = startId ? WAYPOINTS.findIndex(w => w.id === startId) : -1;
// ────────────────────────────────────────────────────────────────────────────

// ── CONFIG ───────────────────────────────────────────────────────────────────
const RANGE_FEET     = 10;   // arrival radius in feet
const FAR_FEET       = 200;  // distance at which color is fully red
const FEET_PER_METER = 3.28084;
// ────────────────────────────────────────────────────────────────────────────

// ── STATE ────────────────────────────────────────────────────────────────────
let currentIndex = startIndex >= 0 ? startIndex : 0;
// phase:
//   'navigating'  — user is moving toward the current stop
//   'clue-shown'  — user arrived and tapped once; clue text is visible
//   'complete'    — user tapped at the final stop; hunt is over
let phase      = 'navigating';
let distMeters = null;
// ────────────────────────────────────────────────────────────────────────────

// ── DOM REFERENCES ───────────────────────────────────────────────────────────
const clueBarEl      = document.getElementById('clue-bar');
const waitingEl      = document.getElementById('waiting');
const mainEl         = document.getElementById('main');
const stopCounterEl  = document.getElementById('stop-counter');
const eggContainerEl = document.getElementById('egg-container');
const eggEl          = document.getElementById('egg');
const speechBubbleEl = document.getElementById('speech-bubble');
const distanceEl     = document.getElementById('distance');
const distLabelEl    = document.getElementById('distance-label');
const rangeEl        = document.getElementById('range');
// ────────────────────────────────────────────────────────────────────────────

// ── TAP HANDLER ──────────────────────────────────────────────────────────────
eggContainerEl.addEventListener('click', () => {
  const isInside = distMeters !== null && metersToFeet(distMeters) <= RANGE_FEET;

  if (phase === 'navigating' && isInside) {
    // First tap on arrival: reveal next clue (or end hunt if this is the last stop)
    phase = currentIndex === WAYPOINTS.length - 1 ? 'complete' : 'clue-shown';
    renderUI();
  } else if (phase === 'clue-shown') {
    // Second tap: persist the next stop's clue at the top, then advance
    clueBarEl.textContent = `Clue: ${WAYPOINTS[currentIndex + 1].clue}`;
    currentIndex++;
    phase = 'navigating';
    renderUI();
  }
});
// ────────────────────────────────────────────────────────────────────────────

// ── MATH HELPERS ─────────────────────────────────────────────────────────────
function toRadians(deg) { return deg * Math.PI / 180; }

function metersToFeet(m) { return m * FEET_PER_METER; }

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R    = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a    = Math.sin(dLat / 2) ** 2 +
               Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Maps distance to a hue on the red → yellow → green spectrum.
 * dist >= FAR_FEET   → hue   0 (red)
 * dist == RANGE_FEET → hue  60 (yellow)
 * dist <= 0          → hue 120 (green)
 */
function distToHue(distFt) {
  if (distFt >= FAR_FEET) return 0;
  if (distFt <= 0)        return 120;

  if (distFt > RANGE_FEET) {
    const t = (FAR_FEET - distFt) / (FAR_FEET - RANGE_FEET);
    return t * 60;                // Red → Yellow
  } else {
    const t = 1 - distFt / RANGE_FEET;
    return 60 + t * 60;          // Yellow → Green
  }
}
// ────────────────────────────────────────────────────────────────────────────

// ── UI RENDERING ─────────────────────────────────────────────────────────────
function renderUI() {
  waitingEl.style.display = 'none';
  mainEl.style.display    = 'block';

  const distFt   = metersToFeet(distMeters);
  const isInside = distFt <= RANGE_FEET;
  const waypoint = WAYPOINTS[currentIndex];

  document.body.style.backgroundColor = `hsl(${distToHue(distFt)}, 75%, 38%)`;

  stopCounterEl.textContent = `Stop ${currentIndex + 1} of ${WAYPOINTS.length}`;
  distanceEl.textContent    = Math.round(distFt);
  distLabelEl.textContent   = 'feet away';
  rangeEl.textContent       = `Target range: ${RANGE_FEET} ft`;

  if (phase === 'complete') {
    setEggArrived();
    speechBubbleEl.textContent = "You've completed the hunt!";
  } else if (phase === 'clue-shown') {
    // Keep clue visible even if user has started walking away
    setEggArrived();
    speechBubbleEl.textContent = `${WAYPOINTS[currentIndex + 1].clue} · Tap again when ready`;
  } else if (isInside) {
    setEggArrived();
    speechBubbleEl.textContent = "You're here! Tap me for your next clue";
  } else if (waypoint.secondaryClue && distFt <= waypoint.secondaryRange) {
    eggEl.textContent            = '🥚';
    speechBubbleEl.style.display = 'block';
    speechBubbleEl.textContent   = waypoint.secondaryClue;
  } else {
    eggEl.textContent            = '🥚';
    speechBubbleEl.style.display = 'none';
  }
}

function setEggArrived() {
  eggEl.textContent            = '🐣';
  eggEl.style.transform        = '';
  speechBubbleEl.style.display = 'block';
}
// ────────────────────────────────────────────────────────────────────────────

// ── GEOLOCATION ──────────────────────────────────────────────────────────────
function onPosition(pos) {
  const { latitude: lat, longitude: lng } = pos.coords;
  const { lat: tLat, lng: tLng }          = WAYPOINTS[currentIndex];
  distMeters = haversineDistance(lat, lng, tLat, tLng);
  renderUI();
}

function onGeoError(err) {
  waitingEl.textContent = `Location error: ${err.message}`;
}
// ────────────────────────────────────────────────────────────────────────────

// ── EGG SHAKE ANIMATION ──────────────────────────────────────────────────────
const SHAKE_START_FEET = 100;
const SHAKE_MAX_PX     = 8;

let elapsed  = 0;
let lastTime = null;

function shakeAmplitude(distFt) {
  if (distFt >= SHAKE_START_FEET) return 0;
  // t goes 0→1 as user approaches; quadratic for dramatic ramp-up near target
  const t = 1 - distFt / SHAKE_START_FEET;
  return t * t;
}

function animateEgg(timestamp) {
  if (lastTime !== null) elapsed += timestamp - lastTime;
  lastTime = timestamp;

  const distFt   = distMeters !== null ? metersToFeet(distMeters) : SHAKE_START_FEET;
  const isInside = distMeters !== null && distFt <= RANGE_FEET;
  const amp      = shakeAmplitude(distFt);

  if (!isInside && phase === 'navigating' && amp > 0.01) {
    const t = elapsed / 1000;
    // Mix of frequencies for an organic rattle feel
    const x = amp * SHAKE_MAX_PX * (Math.sin(t * 28) + 0.5 * Math.sin(t * 41));
    const y = amp * SHAKE_MAX_PX * 0.5 * (Math.sin(t * 33) + 0.4 * Math.sin(t * 47));
    const r = amp * 6 * Math.sin(t * 22);
    eggEl.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
  } else if (phase === 'navigating') {
    eggEl.style.transform = '';
  }

  requestAnimationFrame(animateEgg);
}

requestAnimationFrame(animateEgg);
// ────────────────────────────────────────────────────────────────────────────

// ── INIT ─────────────────────────────────────────────────────────────────────
clueBarEl.textContent = `Clue: ${WAYPOINTS[currentIndex].clue}`;

if (!navigator.geolocation) {
  waitingEl.textContent = 'Geolocation is not supported by this browser.';
} else {
  navigator.geolocation.watchPosition(onPosition, onGeoError, {
    enableHighAccuracy: true,
    maximumAge: 0,
  });
}
// ────────────────────────────────────────────────────────────────────────────
