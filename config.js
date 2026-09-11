/* Everything that defines who the pet is. Change it here, nowhere else. */

export const NAME = 'Tort'

export const MOTION = {
  // Turtles are wider than tall (the reference photo is 806x626, ~1.29:1).
  // Keep this box in that proportion or real art will squash or letterbox.
  width: 112,
  height: 88,
  speed: 34,          // px per second. A turtle should look unhurried.
  edge: 8,            // px of clearance from screen edges
  ambient: [5 * 60000, 8 * 60000],
  blink: [2600, 7000],
  idleBeforeSleep: 12 * 60000
}

export const LINES = {
  ambient: [
    'slow is fine.',
    'water?',
    'shoulders down.',
    'one thing at a time.',
    'still going. me too.',
    'stretch. i cannot, you can.',
    'blink.',
    'i like it here.',
    'you are ahead of me.',
    'breathe.',
    'small steps count.',
    'look up for a second.'
  ],
  click: ['hi.', 'that tickles.', 'boop back.', 'oh. hello.', 'again?'],
  summon: ['coming. slowly.', 'on my way.', 'yes?', 'here.'],
  wake: ['oh. hi.', 'nap over.', 'that was a good one.'],
  sleep: 'zzz',
  hello: 'hi. i live here now.',
  drink: ['ahh.', 'needed that.', 'thank you.'],
  eat: ['yum.', 'my favourite.', 'thank you.'],
  clean: ['ooh, bubbles.', 'shiny now.', 'that tickles.'],
  cared: 'good day. thank you.'
}

/* Affirmations. One bank per time of day, because a 9am line and a 6pm line
   are doing different jobs: starting, enduring, stopping. One line fires per
   slot per day. If the Mac is asleep or Tort is snoozed at the exact minute,
   the slot still fires late rather than being lost for the day.

   Voice rules, same as the rest of him: lowercase, short, declarative. No
   exclamation marks, no emoji, no encouragement speak. He is a turtle who
   thinks you are going too fast, not a motivational poster. */
export const AFFIRMATIONS = {
  enabled: true,
  slots: {
    // Starting. Removes the pressure to already be behind.
    '09:00': [
      'morning. no rush.',
      'you are not late.',
      'pick one thing. just one.',
      'start with the small one.',
      'the day is long enough.'
    ],
    // The middle. The part nobody writes posts about.
    '13:00': [
      'halfway. still fine.',
      'eat something.',
      'unclench your jaw.',
      'it does not have to be good yet.',
      'you have done more than you think.'
    ],
    // Stopping. Permission, not a reward for finishing.
    '18:00': [
      'you can stop soon.',
      'it will still be here tomorrow.',
      'that was enough for today.',
      'close one tab. then another.',
      'you are allowed to be done.'
    ]
  }
}

/* Study tracker hook. Disabled on the web build: a public page cannot reach
   a study tracker running on someone's own Mac at localhost. The Electron
   version at desktop-pet/ still uses this. Tiers kept here for reference and
   so the demo reward buttons in pet-web.js can reuse the same labels. */
export const STUDY = {
  enabled: false,
  apiUrl: 'http://localhost:4612/api/data',
  pollMs: 60000,
  perSession: true,
  tiers: {
    water: 30,   // minutes, logged in one session
    fed: 60,
    clean: 120
  }
}
