// ── WAYPOINTS ────────────────────────────────────────────────────────────────
// Two teams, each with their own ordered list of stops.
// Share the URL with ?team=emerald or ?team=lilac to select a route.
//   clue          — clue telling the user how to find THIS stop.
//                   WAYPOINTS[0].clue is shown in the clue-bar on page load.
//                   Subsequent clues are revealed when the user taps at the previous stop.
//   secondaryClue — shown as a speech bubble when within secondaryRange feet of THIS stop (optional)
//   secondaryRange — distance in feet at which secondaryClue appears (optional)
const ALL_WAYPOINTS = {
  test: [
    {
      id:            'entrance',
      lat:           41.897490,
      lng:           -87.619770,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
    {
      id:            'redbench',
      lat:           41.897488,
      lng:           -87.619460,
      clue:          'Head to the red bench near the fountain',
      secondaryClue: 'Almost there — what color stands out?',
      secondaryRange: 30,
    },
    {
      id:            'bluedoor',
      lat:           41.897486,
      lng:           -87.618323,
      clue:          'Look for the blue door on the north side of the building',
      secondaryClue: 'Nearly there — the end is in sight',
      secondaryRange: 40,
    },
  ],
  emerald: [
    { // 157 bus stop
      id:            'busstop',
      lat:           41.8976848,
      lng:           -87.6200501,
      clue:          'Off we go, on the road to honor Casimir Pulaski',
    },
    { // lake shore field house east entrance
      id:            'fieldhouse',
      lat:           41.8971490,
      lng:           -87.6176673,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
    { // tunnel life saver
      id:            'lifesaver',
      lat:           41.8974869,
      lng:           -87.6169984,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
    { // ohio street beach - lockers
      id:            'ohiobeach',
      lat:           41.8931839,
      lng:           -87.6137550,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
    { // jane adams - chess
      id:            'chess',
      lat:           41.8930254,
      lng:           -87.6133124,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
    { // jane adams - sculpture
      id:            'jasculpture',
      lat:           41.8928584,
      lng:           -87.6128836,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
    { // milton lee olive park
      id:            'mlopark',
      lat:           41.8951193,
      lng:           -87.6108924,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
    { // chicago dog
      id:            'chicagodog',
      lat:           41.8921524,
      lng:           -87.6118328,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
    { // navy pier children's museum
      id:            'childrensmuseum',
      lat:           41.8916807,
      lng:           -87.6103741,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
    { // TO SIT AWHILE statue
      id:            'sitawhile',
      lat:           41.8903272,
      lng:           -87.6099818,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
    { // polk bros park bench
      id:            'polkbench',
      lat:           41.8900249,
      lng:           -87.6103730,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
    { // cupitol coffee
      id:            'cupitol',
      lat:           41.8910355,
      lng:           -87.6153878,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
    { // gotham bagels
      id:            'gotham',
      lat:           41.8958343,
      lng:           -87.6229690,
      clue:          'Start near the main entrance and look for something colorful',
      secondaryClue: 'Getting close — look for something round and wet',
      secondaryRange: 50,
    },
  ], 
  lilac: [ 
    { // birdhouse library 
      id:            'entrance',
      lat:           41.8975421,
      lng:           -87.6198315,
      clue:          '',
      secondaryClue: '',
      secondaryRange: 50,
    },
    { // dancing the revolution 
      id:            'mca',
      lat:           41.8973542,
      lng:           -87.6216755,
      clue:          '',
      secondaryClue: '',
      secondaryRange: 50,
    },
  ],
};