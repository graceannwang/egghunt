// ── WAYPOINTS ────────────────────────────────────────────────────────────────
// Two teams, each with their own ordered list of stops.
// Share the URL with ?team=emerald or ?team=lilac to select a route.
//   clue          — clue telling the user how to find THIS stop.
//                   WAYPOINTS[0].clue is shown in the clue-bar on page load.
//                   Subsequent clues are revealed when the user taps at the previous stop.
//   secondaryClue — shown as a speech bubble when within secondaryRange feet of THIS stop (optional)
//   secondaryRange — distance in feet at which secondaryClue appears (optional)
const ALL_WAYPOINTS = {
  test: [ // this is for dev testing only, not a real route
    {
      id:              'arrived',
      lat:             41.897490,
      lng:             -87.619770,
      targetRange:     200,
      clue:            'Start near the main entrance and look for something colorful',
      secondaryClue:   'Getting close — look for something round and wet',
      secondaryRange:  50,
      arrivalMessages: [
        "You found it!",
        "Here's a little riddle for you...",
        "What has hands but can't clap?",
      ],
    },
    {
      id:            'navigating',
      lat:           41.897488,
      lng:           -87.619460,
      clue:          'Head to the red bench near the fountain',
      secondaryClue: 'Almost there — what color stands out?',
      secondaryRange: 5,
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
      id:            'minilibrary',
      lat:           41.8975421,
      lng:           -87.6198315,
      clue:          'CLUE: Peruse the titles by the green. Take a moment by this little spot of joy.',
      arrivalMessages: [
        'GRACE says: "Chicago\'s supply of green spaces is one of my favorite things about the city"',
        'Tap me to receive the next CLUE',
      ],
    },
    { // dancing the revolution 
      id:            'mca',
      lat:           41.8973542,
      lng:           -87.6216755,
      clue:          'CLUE: Opening soon: combative twerking.',
      secondaryClue: 'DANCING THE REVOLUTION',
      secondaryRange: 100,
      arrivalMessages: [
        'GRACE says: "I will definitely be paying this exhibit a visit sometime"',
        'GRACE says: "Dancing is probably one of my favorite forms of expression and exercise"',
        'Do you know what Grace\'s favorite dance genre is? Take a guess!',
        'Tap me to receive the next CLUE',
      ],
    },
    { // old water tower 
      id:            'oldwatertower',
      lat:           41.8971994,
      lng:           -87.6245888,
      targetRange:   30,
      clue:          'CLUE: I am a limestone, neo-Gothic thing of beauty.',
      secondaryClue: 'The year was 1871, there I stood, resilient.',
      secondaryRange: 500,
      arrivalMessages: [
        'GRACE says: "The Chicago Water Tower is one of the few buildings to survive the Great Chicago Fire, which is pretty incredible considering how devastating the fire was"',
        'GRACE says: "I have a soft spot for gothic architecture, so I\'m a big fan of the water tower"',
        'Tap me to receive the next CLUE',
      ],
    },
    { // american girl doll 
      id:            'americangirl',
      lat:           41.8982982,
      lng:           -87.6239434,
      targetRange:   25,
      clue:          'CLUE: I am a thing of resilience, and to honor my name, they built... a mall???',
      secondaryClue: 'It is Raquel Reyes\' year. You go girl!',
      secondaryRange: 200,
      arrivalMessages: [
        'GRACE says: "I used to look through American girl Doll magazines all the time when I was little"',
        'GRACE says: "Really wanted a doll, never got one!"',
        'KEYWORD unlocked: BIRTHDAY',
        'Remember this keyword, it will be important later on!',
        'Tap me to receive the next CLUE',
      ],
    },
    { // gazebo 
      id:            'gazebo',
      lat:           41.9011399,
      lng:           -87.6235323,
      targetRange:   15,
      clue:          'CLUE: Set foot toward the garden of survival (there are many choices, choose wisely)',
      secondaryClue: 'I am the focal point of this park.',
      secondaryRange: 200,
      arrivalMessages: [
        'GRACE says: "I like to come here sometimes to take a break from work"',
        'GRACE says: "Ain\'t it lovely?"',
        'Tap me to receive the next CLUE',
      ],
    },
    { // oak street life saver 
      id:            'oaklifesaver',
      lat:           41.9022301,
      lng:           -87.6229325,
      clue:          'CLUE: Pass through Jeff Zimmerman\'s masterpiece. YOU KNOW WHAT YOU SHOULD DO TOO.',
      secondaryClue: 'Save a life.',
      secondaryRange: 30,
      arrivalMessages: [
        'Take a group picture and send it into the Partiful!',
        'Pretty please 🥺? Grace would like to see your beautiful faces.',
        'Tap me to receive the next CLUE',
      ]
    },
    { // hendrickx (41.9000761, -87.6252486)
      id:            'hendrickx',
      lat:           41.9000761,
      lng:           -87.6252486,
      targetRange:   25,
      clue:          'CLUE: Chef Renaud\'s country bread is my favorite to eat.',
      arrivalMessages: [
        'GRACE says: "Every day this little shop tempts me."',
        'Take a look inside! You are here, might as well :)',
        'Tap me to receive the next CLUE',
      ],
    },
    { // newberry 
      id:            'newberry',
      lat:           41.8999041,
      lng:           -87.6306056,
      targetRange:   20,
      clue:          'CLUE: After my death, I leave to the people of Chicago: a place for curious minds.',
      arrivalMessages: [
        'GRACE says: "They give tours of this place! I have not yet attended one :("',
        'KEYWORD unlocked: Grace',
        'Tap me to receive the next CLUE',
      ],
    },
    { // washington square park
      id:            'washingtonsquare',
      lat:           41.8991914,
      lng:           -87.6305882,
      clue:          'CLUE: Pet the dogs.',
      arrivalMessages: [
        'Did you pet any dogs??',
        'Tap me to receive the next CLUE',
      ]
    },
    { // vintea 
      id:            'vintea',
      lat:           41.8973135,
      lng:           -87.6283288,
      targetRange:   25,
      clue:          'CLUE: On her birthday, Grace had a big bowl of pho for breakfast here.',
      arrivalMessages: [
        'GRACE says: "The pho was delicious."',
        'KEYWORD unlocked: what',
        'Tap me to receive the next CLUE',
      ],
    },
    { // chicago red line 
      id:            'chicagoredline',
      lat:           41.8968029,
      lng:           -87.6280220,
      targetRange:   15,
      clue:          'CLUE: This intersection brims with energy, a hub of movement and connection',
      secondaryClue: 'Choose the intersection closest to Grace\'s home',
      secondaryRange: 65,
      arrivalMessages: [
        'GRACE says: My most frequented CTA train stop :D',
        'Tap me to receive the next CLUE',
      ]
    },
    { // ralphs 
      id:            'ralphs',
      lat:           41.8965601,
      lng:           -87.6244875,
      targetRange:   20,
      clue:          'CLUE: Stroll east along the street named after this city.',
      secondaryClue: 'Apparently clothing stores sell coffee now',
      secondaryRange: 180,
      arrivalMessages: [
        'I hope this has been fun for you so far!!',
        'Tap me to receive the next CLUE',
      ]
    },
    { // gotham bagels
      id:            'gotham',
      lat:           41.8958343,
      lng:           -87.6229690,
      targetRange:   15,
      clue:          'CLUE: Where does batman get his bagels?',
      arrivalMessages: [
        'You did it!!',
        'GRACE says: "I am so proud of you!"',
        'KEYWORD unlocked: shared',
        'You\'ve unlocked all keywords for this route! Discuss with team EMERALD to unlock the final prize'
      ]
    },
  ],
};