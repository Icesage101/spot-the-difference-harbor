// Harbor Lights — sound effects, synthesized with WebAudio.
// One clear job: every beep, chime and thud the game plays, with no audio
// files at all. All sounds are short oscillator notes, so the game stays
// self-contained and silent until the player first interacts (browsers
// require a user gesture before audio may start).

let audioCtx = null;
let muted = false;

function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext ?? window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function note(freq, start, dur, type, gain) {
  const ac = ctx();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  amp.gain.setValueAtTime(0.0001, ac.currentTime + start);
  amp.gain.exponentialRampToValueAtTime(gain, ac.currentTime + start + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(amp);
  amp.connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.05);
}

// A bright two-note chime for finding a difference.
export function playFound() {
  note(660, 0, 0.16, 'sine', 0.18);
  note(990, 0.09, 0.24, 'sine', 0.16);
}

// A low buzz for a wrong click.
export function playWrong() {
  note(160, 0, 0.18, 'sawtooth', 0.08);
}

// A rising arpeggio for clearing a round.
export function playRoundClear() {
  [523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.09, 0.22, 'triangle', 0.16));
}

// A gentle descending phrase for the final results.
export function playGameOver(win) {
  const seq = win ? [523, 659, 784, 1047, 1319] : [392, 330, 262];
  seq.forEach((f, i) => note(f, i * 0.12, 0.3, 'triangle', 0.14));
}

// A soft tick when a hint is spent.
export function playHint() {
  note(880, 0, 0.12, 'sine', 0.12);
  note(1175, 0.08, 0.18, 'sine', 0.1);
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

export function isMuted() {
  return muted;
}
