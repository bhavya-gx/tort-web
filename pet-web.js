import { sprite, leaf, water, bubble as bubbleSvg } from './sprite.js'
import { MOTION, LINES, AFFIRMATIONS } from './config.js'

/* Web build of Tort. Same personality and animation engine as the Mac app
   (desktop-pet/), ported to live inside a normal page instead of a
   click-through overlay window. Differences from the Electron version:

   - Bounded by #stage, not the whole screen.
   - No Electron IPC: "come here" walks to the last place you moved the
     mouse inside the stage, tracked locally instead of queried from main.
   - Double-click vanish fades him out in place and a page click brings him
     back, since there is no OS window to hide and no tray menu to restore
     from.
   - Persistence is localStorage instead of a file on disk, everything else
     about the care loop (petted/studied/walked, midnight reset, mood,
     affirmations) is identical.
   - The study-tracker reward tiers are demoed with buttons instead of a
     real localhost poll (STUDY.enabled is false in config.js on this
     build), since a public page cannot reach a tracker on someone's own
     Mac. */

const el = {
  stage: document.getElementById('stage'),
  pet: document.getElementById('pet'),
  sprite: document.getElementById('sprite'),
  bubble: document.getElementById('bubble'),
  hearts: document.getElementById('hearts'),
  leaf: document.getElementById('leaf'),
  water: document.getElementById('water'),
  bubbles: document.getElementById('bubbles')
}

el.sprite.innerHTML = sprite

/* ---------- dialogue ---------- */

const { ambient: AMBIENT, click: ON_CLICK, summon: ON_SUMMON, wake: ON_WAKE } = LINES

const pick = (list) => list[Math.floor(Math.random() * list.length)]
const rand = (min, max) => min + Math.random() * (max - min)

/* ---------- state ---------- */

const { width: WIDTH, height: HEIGHT, speed: SPEED, edge: EDGE } = MOTION

const state = {
  x: 0,
  target: null,
  mode: 'idle',
  lastMouseX: null,
  asleep: false,
  lastActivity: Date.now(),
  paused: false,
  day: localDay(),
  care: { petted: false, studied: false, walked: false, done: false },
  lastCaredAt: 0,
  affirmedToday: new Set(),
  hidden: false,
  dragging: false,
  dragMoved: false,
  dragStartX: 0,
  dragLastX: 0
}

function localDay (d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

/* ---------- persistence (localStorage instead of a file on disk) ---------- */

const STORAGE_KEY = 'tort-state'

function loadState () {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch (e) {
    return null // missing or corrupt: run as a fresh day
  }
}

function persist () {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      day: state.day,
      care: state.care,
      lastCaredAt: state.lastCaredAt,
      affirmedToday: [...state.affirmedToday]
    }))
  } catch (e) {
    // Private browsing, storage disabled, or full. Ambient page, no error surface.
  }
}

let bounds = { w: el.stage.clientWidth, h: el.stage.clientHeight }

function measure () {
  bounds = { w: el.stage.clientWidth, h: el.stage.clientHeight }
  state.x = clamp(state.x)
  draw()
}

const clamp = (x) => Math.max(EDGE, Math.min(x, bounds.w - WIDTH - EDGE))

function setMode (mode) {
  state.mode = mode
  el.pet.dataset.state = mode
}

function draw () {
  el.pet.style.transform = `translate3d(${state.x}px, 0, 0)`
}

/* ---------- movement ---------- */

function walkTo (x, then) {
  state.target = { x: clamp(x), then }
  el.pet.dataset.facing = state.target.x < state.x ? 'left' : 'right'
  setMode('walk')
}

let lastFrame = performance.now()

function frame (now) {
  const dt = Math.min((now - lastFrame) / 1000, 0.1)
  lastFrame = now

  if (state.target) {
    const dx = state.target.x - state.x
    const step = SPEED * dt
    if (Math.abs(dx) <= step) {
      state.x = state.target.x
      const then = state.target.then
      state.target = null
      setMode(state.asleep ? 'sleep' : 'idle')
      if (then) then()
    } else {
      state.x += Math.sign(dx) * step
    }
    draw()
  }

  requestAnimationFrame(frame)
}

/* He sits still by default now. A click is what sends him crawling to a new
   spot, not a timer. */
function crawl () {
  if (state.paused || state.asleep || state.dragging || state.hidden) return
  walkTo(rand(EDGE, bounds.w - WIDTH - EDGE))
}

/* ---------- speech ---------- */

let bubbleTimer = null

function say (text, ms = 4200) {
  if (state.paused || state.hidden) return
  el.bubble.textContent = text
  el.bubble.classList.toggle('flip', state.x > bounds.w - 260)
  el.bubble.classList.add('show')
  el.pet.classList.add('talking')
  clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => {
    el.bubble.classList.remove('show')
    el.pet.classList.remove('talking')
  }, ms)
}

function ambient () {
  if (!state.paused && !state.asleep && !state.hidden) say(pick(AMBIENT))
  schedule(ambient, ...MOTION.ambient)
}

/* ---------- reactions ---------- */

function celebrate () {
  wake()
  markCare('petted')
  setMode('happy')
  say(pick(ON_CLICK), 2600)
  for (let i = 0; i < 4; i++) {
    const heart = document.createElement('span')
    heart.className = 'heart'
    heart.textContent = pick(['💛', '💙', '💗', '✨'])
    heart.style.left = `${rand(14, WIDTH - 30)}px`
    heart.style.setProperty('--dx', `${rand(-16, 16)}px`)
    heart.style.animationDelay = `${i * 70}ms`
    el.hearts.appendChild(heart)
    setTimeout(() => heart.remove(), 1400)
  }
  setTimeout(() => { if (state.mode === 'happy') crawl() }, 900)
}

/* ---------- daily care loop ---------- */

function markCare (task) {
  state.care[task] = true
  if (!state.care.done && state.care.petted && state.care.studied && state.care.walked) {
    state.care.done = true
    state.lastCaredAt = Date.now()
    el.pet.classList.add('cared')
    say(LINES.cared, 5000)
  }
  persist()
}

const rewardQueue = []
let playingReward = false

function queueReward (tier) {
  rewardQueue.push(tier)
  if (!playingReward) playNextReward()
}

async function playNextReward () {
  const tier = rewardQueue.shift()
  if (!tier) { playingReward = false; return }
  playingReward = true
  wake()
  markCare('studied')

  if (tier === 'water') {
    el.water.innerHTML = water
    el.water.classList.remove('gone')
    el.water.classList.add('drop')
    el.pet.classList.add('drinking')
    say(pick(LINES.drink), 2400)
    await wait(2200)
    el.water.classList.add('gone')
    el.pet.classList.remove('drinking')
  } else if (tier === 'fed') {
    el.leaf.innerHTML = leaf
    el.leaf.classList.remove('gone')
    el.leaf.classList.add('drop')
    await wait(500)
    el.pet.classList.add('eating')
    el.leaf.classList.add('gone')
    say(pick(LINES.eat), 2400)
    await wait(2000)
    el.pet.classList.remove('eating')
  } else if (tier === 'clean') {
    el.pet.classList.add('cleaning')
    el.bubbles.innerHTML = ''
    for (let i = 0; i < 8; i++) {
      const b = document.createElement('div')
      b.className = 'bubble'
      b.innerHTML = bubbleSvg
      b.style.left = `${10 + i * 11}%`
      b.style.setProperty('--dx', `${i % 2 ? 18 : -18}px`)
      b.style.animationDelay = `${i * 90}ms`
      el.bubbles.appendChild(b)
    }
    say(pick(LINES.clean), 2600)
    await wait(1800)
    el.pet.classList.remove('cleaning')
    el.pet.classList.add('shiny')
  }

  await wait(400)
  playNextReward()
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/* ---------- mood ---------- */

const RECENTLY_CARED_MS = 30 * 60000

function updateMood () {
  el.pet.classList.remove('mood-bright', 'mood-sleepy')
  if (!state.asleep) {
    if (Date.now() - state.lastCaredAt < RECENTLY_CARED_MS) {
      el.pet.classList.add('mood-bright')
    } else if (Date.now() - state.lastActivity > IDLE_BEFORE_SLEEP / 2) {
      el.pet.classList.add('mood-sleepy')
    }
  }
  schedule(updateMood, 60000, 60000)
}

/* ---------- affirmations ---------- */

const AFFIRMATION_GRACE_MS = 2 * 60 * 60000

function minutesOfDay (hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function checkAffirmations () {
  if (AFFIRMATIONS.enabled && !state.paused && !state.asleep) {
    const now = new Date()
    const nowMins = now.getHours() * 60 + now.getMinutes()
    for (const [slot, lines] of Object.entries(AFFIRMATIONS.slots)) {
      if (state.affirmedToday.has(slot)) continue
      const due = minutesOfDay(slot)
      if (nowMins < due) continue
      state.affirmedToday.add(slot)
      persist()
      if ((nowMins - due) * 60000 <= AFFIRMATION_GRACE_MS) {
        say(pick(lines), 5500)
        break
      }
    }
  }
  schedule(checkAffirmations, 30000, 30000)
}

/* ---------- midnight reset ---------- */

function checkMidnight () {
  const today = localDay()
  if (today !== state.day) {
    state.day = today
    state.care = { petted: false, studied: false, walked: false, done: false }
    state.affirmedToday = new Set()
    el.pet.classList.remove('cared', 'shiny')
    persist()
  }
  schedule(checkMidnight, 60000, 60000)
}

function blink () {
  if (!state.asleep) {
    el.pet.classList.add('blink')
    setTimeout(() => el.pet.classList.remove('blink'), 130)
  }
  schedule(blink, ...MOTION.blink)
}

/* ---------- sleep ---------- */

const IDLE_BEFORE_SLEEP = MOTION.idleBeforeSleep

function checkIdle () {
  if (!state.asleep && !state.paused && Date.now() - state.lastActivity > IDLE_BEFORE_SLEEP) {
    state.asleep = true
    state.target = null
    setMode('sleep')
    say(LINES.sleep, 3000)
  }
  schedule(checkIdle, 30000, 30000)
}

function wake () {
  state.lastActivity = Date.now()
  if (state.asleep) {
    state.asleep = false
    setMode('idle')
    say(pick(ON_WAKE), 2600)
  }
}

/* ---------- vanish (double-click), and bringing him back ---------- */

function vanish () {
  state.hidden = true
  state.target = null
  el.pet.classList.add('hidden')
  el.bubble.classList.remove('show')
}

function reveal () {
  if (!state.hidden) return
  state.hidden = false
  el.pet.classList.remove('hidden')
  wake()
}

/* ---------- summon and speak (page buttons instead of a tray menu) ---------- */

function summon () {
  reveal()
  wake()
  markCare('walked')
  const x = state.lastMouseX != null ? state.lastMouseX : bounds.w / 2
  walkTo(x - WIDTH / 2, () => say(pick(ON_SUMMON), 2600))
}

function speak () {
  reveal()
  wake()
  say(pick(AMBIENT))
}

/* ---------- drag, click, double-click ---------- */

el.stage.addEventListener('mousemove', (e) => {
  const rect = el.stage.getBoundingClientRect()
  state.lastMouseX = e.clientX - rect.left
  state.lastActivity = Date.now()
  if (state.asleep) wake()
  if (state.dragging) {
    if (!state.dragMoved && Math.abs(e.clientX - state.dragStartX) > DRAG_THRESHOLD) {
      state.dragMoved = true
      state.target = null
      setMode('walk')
    }
    if (state.dragMoved) {
      const next = clamp(state.x + (e.clientX - state.dragLastX))
      el.pet.dataset.facing = next < state.x ? 'left' : 'right'
      state.x = next
      draw()
    }
    state.dragLastX = e.clientX
  }
})

const DRAG_THRESHOLD = 6

el.pet.addEventListener('mousedown', (e) => {
  if (state.hidden) return
  wake()
  state.dragging = true
  state.dragMoved = false
  state.dragStartX = e.clientX
  state.dragLastX = e.clientX
  el.pet.style.cursor = 'grabbing'
  e.preventDefault() // stop native SVG/element drag-ghost
})

let lastClickAt = 0
const DOUBLE_CLICK_MS = 320

window.addEventListener('mouseup', () => {
  if (!state.dragging) return
  const moved = state.dragMoved
  state.dragging = false
  el.pet.style.cursor = 'pointer'
  if (moved) {
    setMode('idle')
    return
  }
  const now = Date.now()
  if (now - lastClickAt < DOUBLE_CLICK_MS) {
    lastClickAt = 0
    vanish()
    return
  }
  lastClickAt = now
  celebrate()
})

// The native 'click' that follows this same mouseup would otherwise bubble
// up to the stage's revive-on-click listener below and undo a vanish in the
// same tick, since the browser dispatches it against #pet regardless of the
// pointer-events change vanish() just made. Stop it at the source: a click
// that lands on the pet itself is never the "bring him back" gesture.
el.pet.addEventListener('click', (e) => e.stopPropagation())

// Vanished for a screenshot? Any click on the stage brings him back.
el.stage.addEventListener('click', () => { if (state.hidden) reveal() })

/* ---------- scheduling helper ---------- */

const timers = new Set()
function schedule (fn, min, max) {
  const id = setTimeout(() => { timers.delete(id); fn() }, rand(min, max))
  timers.add(id)
}

/* ---------- page controls ---------- */

document.getElementById('btn-come').addEventListener('click', summon)
document.getElementById('btn-speak').addEventListener('click', speak)
document.querySelectorAll('#demo-rewards button[data-tier]').forEach((btn) => {
  btn.addEventListener('click', () => queueReward(btn.dataset.tier))
})

window.addEventListener('resize', measure)

/* ---------- boot ---------- */

async function restoreState () {
  const saved = loadState()
  if (saved && saved.day === state.day) {
    state.care = { petted: false, studied: false, walked: false, done: false, ...saved.care }
    state.lastCaredAt = saved.lastCaredAt || 0
    state.affirmedToday = new Set(Array.isArray(saved.affirmedToday) ? saved.affirmedToday : [])
    if (state.care.done) el.pet.classList.add('cared')
  }
}

measure()
state.x = clamp(bounds.w * 0.72)
el.pet.dataset.facing = 'left'
draw()
requestAnimationFrame(frame)

schedule(ambient, 90000, 150000)
schedule(blink, ...MOTION.blink)
schedule(checkIdle, 30000, 30000)
schedule(updateMood, 60000, 60000)
schedule(checkMidnight, 60000, 60000)
setTimeout(() => say(LINES.hello, 5000), 1200)

restoreState().finally(() => schedule(checkAffirmations, 0, 0))
