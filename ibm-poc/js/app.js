// ── App state ──────────────────────────────────────────────────────
const state = {
  ageBand: 'NEWBORN',
  isReady: false,
  isRecording: false,
  frameBuffer: [],
  timestampBuffer: [],
  stabilityBuffer: [],
  recordingStartTime: null,
  metrics: null
}

// ── Screen navigation ──────────────────────────────────────────────
const showScreen = (screenId) => {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  document.getElementById(screenId).classList.add('active')
}

// ── Age band selector ──────────────────────────────────────────────
const initAgeBandSelector = () => {
  document.querySelectorAll('.age-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      state.ageBand = btn.dataset.band
      console.log('Age band:', state.ageBand)
    })
  })
}

// ── Record button ──────────────────────────────────────────────────
const initRecordButton = () => {
  document.getElementById('btn-record').addEventListener('click', () => {
    if (!state.isReady) return

    // Reset buffers
    state.frameBuffer = []
    state.timestampBuffer = []
    state.stabilityBuffer = []
    state.recordingStartTime = performance.now()
    state.isRecording = true

    showScreen('screen-recording')
    startRecordingUI()
  })
}

// ── Stop button ────────────────────────────────────────────────────
const initStopButton = () => {
  const btn = document.getElementById('btn-stop')

  btn.addEventListener('click', () => {
    state.isRecording = false
    stopRecordingUI()

    // Calculate metrics and show results
    // (signal.js will be wired up here in a later step)
    showScreen('screen-results')
    showPlaceholderResults()
  })
}

// ── New recording button ───────────────────────────────────────────
const initNewButton = () => {
  document.getElementById('btn-new').addEventListener('click', () => {
    state.metrics = null
    state.isRecording = false
    showScreen('screen-position')
  })
}

// ── Recording UI ───────────────────────────────────────────────────
let timerInterval = null
let stopTimeout = null

const startRecordingUI = () => {
  const timerEl = document.getElementById('rec-timer')
  const stopBtn = document.getElementById('btn-stop')
  const frameCountEl = document.getElementById('frame-count')

  stopBtn.disabled = true
  let elapsed = 0
  timerEl.textContent = '0s'

  // Enable stop button after 10 seconds minimum
  stopTimeout = setTimeout(() => {
    stopBtn.disabled = false
  }, 10000)

  timerInterval = setInterval(() => {
    elapsed++
    timerEl.textContent = `${elapsed}s`
    frameCountEl.textContent = `${state.frameBuffer.length} frames captured`
  }, 1000)
}

const stopRecordingUI = () => {
  clearInterval(timerInterval)
  clearTimeout(stopTimeout)
  timerInterval = null
  stopTimeout = null
}

// ── Placeholder results (until signal.js is wired up) ─────────────
const showPlaceholderResults = () => {
  document.getElementById('result-bpm').textContent = '—'
  document.getElementById('result-tidal').textContent = '—'
  document.getElementById('result-ie').textContent = '—'
  document.getElementById('result-quality').textContent = '—'
  document.getElementById('result-duration').textContent =
    state.recordingStartTime
      ? `${((performance.now() - state.recordingStartTime) / 1000).toFixed(1)}`
      : '—'

  const notes = document.getElementById('result-notes')
  notes.innerHTML = ''
  const li = document.createElement('li')
  li.textContent = 'Processing not yet connected — this is the navigation shell only'
  notes.appendChild(li)
}

// ── Update ready state (called by positioning.js later) ───────────
const setReadyState = (ready) => {
  state.isReady = ready
  document.getElementById('btn-record').disabled = !ready
}

// ── Initialise ─────────────────────────────────────────────────────
const init = () => {
  showScreen('screen-position')
  initAgeBandSelector()
  initRecordButton()
  initStopButton()
  initNewButton()

  // Temporary: set status message
  document.getElementById('status-message').textContent =
    'Camera and depth model will load here'

  console.log('App initialised — shell only, Step 1 complete')
}

document.addEventListener('DOMContentLoaded', init)
