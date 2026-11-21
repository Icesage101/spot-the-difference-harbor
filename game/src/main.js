// Harbor Lights — bootstrap.
// One clear job: wire the engine, the renderer and the input together, run
// the clock, and expose the game for headless driving. Nothing about the
// rules lives here; see engine.js for those.

import { Engine, PHASE } from './engine.js';
import { render } from './render.js';
import { bindInput } from './input.js';
import { applyShot } from './shots.js';

const els = {
  canvasA: document.getElementById('panel-a'),
  canvasB: document.getElementById('panel-b'),
  round: document.getElementById('hud-round'),
  timerFill: document.getElementById('timer-fill'),
  timerText: document.getElementById('timer-text'),
  score: document.getElementById('hud-score'),
  found: document.getElementById('hud-found'),
  hints: document.getElementById('hud-hints'),
  message: document.getElementById('hud-message'),
  hintButton: document.getElementById('btn-hint'),
  startButton: document.getElementById('btn-start'),
  continueButton: document.getElementById('btn-continue'),
  againButton: document.getElementById('btn-again'),
  muteButton: document.getElementById('btn-mute'),
  overlayTitle: document.getElementById('overlay-title'),
  overlayClear: document.getElementById('overlay-clear'),
  overlayOver: document.getElementById('overlay-over'),
  clearText: document.getElementById('clear-text'),
  overTitle: document.getElementById('over-title'),
  overText: document.getElementById('over-text'),
};

const engine = new Engine();
bindInput(engine, els, () => render(engine, els, performance.now()));

// A screenshot state (?shot=...) is applied before the first frame.
const shot = applyShot(engine, new URLSearchParams(window.location.search));
if (shot) document.title = `Harbor Lights — ${shot}`;

let lastMs = performance.now();
let lastPhase = engine.phase;

function frame(nowMs) {
  const dt = Math.min(0.1, (nowMs - lastMs) / 1000);
  lastMs = nowMs;
  const event = engine.tick(dt, nowMs);
  if (event === 'timeout' && engine.phase === PHASE.GAME_OVER) {
    // The round ran out; the game-over overlay tells the story.
  }
  if (engine.phase !== lastPhase) lastPhase = engine.phase;
  render(engine, els, nowMs);
  requestAnimationFrame(frame);
}

render(engine, els, performance.now());
requestAnimationFrame(frame);

// Headless handle: the screenshot driver and the self-test use this.
window.__harbor = { engine, els };
