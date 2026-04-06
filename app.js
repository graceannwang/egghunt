const STATE_KEY = 'egghunt_found';

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STATE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

function updateCounter(state) {
  const found = Object.values(state).filter(Boolean).length;
  const label = found === 1 ? '1 egg found' : `${found} eggs found`;
  document.getElementById('counter').textContent = label;
}

function dimEgg(eggId) {
  const entity = document.querySelector(`[data-egg-id="${eggId}"]`);
  if (entity) {
    entity.setAttribute('opacity', '0.35');
    entity.setAttribute('color', '#888888');
  }
}

function openHint(eggId) {
  const egg = EGGS.find(e => e.id === eggId);
  const state = loadState();

  document.getElementById('hint-egg-number').textContent = `Egg #${egg.id}`;
  document.getElementById('hint-text').textContent = egg.hint;

  const foundBadge = document.getElementById('hint-found-badge');

  if (state[eggId]) {
    foundBadge.style.display = 'inline-block';
  } else {
    state[eggId] = true;
    saveState(state);
    updateCounter(state);
    dimEgg(eggId);
    foundBadge.style.display = 'inline-block';
  }

  document.getElementById('hint-overlay').style.display = 'flex';
}

document.getElementById('hint-close').addEventListener('click', () => {
  document.getElementById('hint-overlay').style.display = 'none';
});

document.querySelector('a-scene').addEventListener('loaded', () => {
  const scene = document.querySelector('a-scene');
  const state = loadState();

  updateCounter(state);

  EGGS.forEach(egg => {
    const el = document.createElement('a-sphere');
    el.setAttribute('scale', '1 1.35 1');
    el.setAttribute('radius', '0.4');
    el.setAttribute('color', state[egg.id] ? '#888888' : egg.color);
    el.setAttribute('gps-new-entity-place', `latitude: ${egg.lat}; longitude: ${egg.lon}`);
    el.setAttribute('data-egg-id', egg.id);

    if (state[egg.id]) {
      el.setAttribute('opacity', '0.35');
    }

    el.addEventListener('click', () => openHint(egg.id));
    scene.appendChild(el);
  });
});
