// ALL_WAYPOINTS is defined in waypoints.js, loaded before this script.

const params    = new URLSearchParams(location.search);
const teamId    = params.get('team') || 'emerald';
const WAYPOINTS = ALL_WAYPOINTS[teamId] ?? ALL_WAYPOINTS.emerald;

const startId    = params.get('start');
const startIndex = startId ? WAYPOINTS.findIndex(w => w.id === startId) : -1;
// ────────────────────────────────────────────────────────────────────────────

// ── CONFIG ───────────────────────────────────────────────────────────────────
const RANGE_FEET     = 10;   // default arrival radius in feet
const FAR_FEET       = 200;  // distance at which color is fully red
const FEET_PER_METER = 3.28084;
// ────────────────────────────────────────────────────────────────────────────

// ── STATE ────────────────────────────────────────────────────────────────────
let currentIndex = startIndex >= 0 ? startIndex : 0;
// phase:
//   'navigating'  — user is moving toward the current stop
//   'dialog'      — user arrived and is tapping through arrivalMessages
//   'clue-shown'  — user finished dialog; next clue is visible
//   'complete'    — user finished dialog at the final stop; hunt is over
let phase       = 'navigating';
let dialogIndex = 0;   // index into current waypoint's arrivalMessages
let distMeters  = null;
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
  const rangeFt  = WAYPOINTS[currentIndex].targetRange ?? RANGE_FEET;
  const isInside = distMeters !== null && metersToFeet(distMeters) <= rangeFt;

  const isFinal = currentIndex === WAYPOINTS.length - 1;

  if (phase === 'navigating' && isInside) {
    const msgs = WAYPOINTS[currentIndex].arrivalMessages;
    if (msgs && msgs.length > 0) {
      dialogIndex = 0;
      phase = 'dialog';
    } else {
      phase = isFinal ? 'complete' : 'clue-shown';
    }
    renderUI();
  } else if (phase === 'dialog') {
    const msgs = WAYPOINTS[currentIndex].arrivalMessages;
    if (dialogIndex < msgs.length - 1) {
      dialogIndex++;
      renderUI();
    } else {
      phase = isFinal ? 'complete' : 'clue-shown';
      renderUI();
    }
  } else if (phase === 'clue-shown') {
    // Persist the next stop's clue at the top, then advance
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
 * dist >= FAR_FEET  → hue   0 (red)
 * dist == rangeFt   → hue  60 (yellow)
 * dist <= 0         → hue 120 (green)
 */
function distToHue(distFt, rangeFt) {
  if (distFt >= FAR_FEET) return 0;
  if (distFt <= 0)        return 120;

  if (distFt > rangeFt) {
    const t = (FAR_FEET - distFt) / (FAR_FEET - rangeFt);
    return t * 60;                // Red → Yellow
  } else {
    const t = 1 - distFt / rangeFt;
    return 60 + t * 60;          // Yellow → Green
  }
}
// ────────────────────────────────────────────────────────────────────────────

// ── UI RENDERING ─────────────────────────────────────────────────────────────
function renderUI() {
  waitingEl.style.display = 'none';
  mainEl.style.display    = 'block';

  const distFt   = metersToFeet(distMeters);
  const waypoint = WAYPOINTS[currentIndex];
  const rangeFt  = waypoint.targetRange ?? RANGE_FEET;
  const isInside = distFt <= rangeFt;

  document.body.style.backgroundColor = `hsl(${distToHue(distFt, rangeFt)}, 75%, 38%)`;

  clueBarEl.style.display = phase === 'navigating' ? 'block' : 'none';

  stopCounterEl.textContent = `Stop ${currentIndex + 1} of ${WAYPOINTS.length}`;
  distanceEl.textContent    = Math.round(distFt);
  distLabelEl.textContent   = 'feet away';
  rangeEl.textContent       = `Target range: ${rangeFt} ft`;

  if (phase === 'complete') {
    setEggArrived();
    speechBubbleEl.textContent = "You've completed the hunt!";
  } else if (phase === 'dialog') {
    setEggArrived();
    const msgs = waypoint.arrivalMessages;
    const isLast = dialogIndex === msgs.length - 1;
    speechBubbleEl.textContent = isLast
      ? `${msgs[dialogIndex]} · Tap to continue`
      : msgs[dialogIndex];
  } else if (phase === 'clue-shown') {
    // Keep clue visible even if user has started walking away
    setEggArrived();
    speechBubbleEl.textContent = `${WAYPOINTS[currentIndex + 1].clue} · Tap me to start the next leg`;
  } else if (isInside) {
    setEggArrived();
    speechBubbleEl.textContent = "YOU'VE ARRIVED! Tap me.";
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
  const rangeFt  = WAYPOINTS[currentIndex].targetRange ?? RANGE_FEET;
  const isInside = distMeters !== null && distFt <= rangeFt;
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
