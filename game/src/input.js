// Harbor Lights — input.
// One clear job: turn mouse clicks, taps and keys into engine calls and
// sounds. Coordinates are converted from the page into panel space, so a
// click on either picture hunts the same differences.

import { PANEL_W, PANEL_H } from './config.js';
import { HINT_PULSE_MS } from './config.js';
import { PHASE } from './engine.js';
import { playFound, playWrong, playHint, playRoundClear, playGameOver, toggleMute } from './audio.js';

function panelPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * PANEL_W;
  const y = ((event.clientY - rect.top) / rect.height) * PANEL_H;
  return { x, y };
}

function handleClick(engine, x, y) {
  const result = engine.click(x, y);
  if (result === 'found') {
    playFound();
    if (engine.phase === PHASE.ROUND_CLEAR) playRoundClear();
  } else if (result === 'wrong') {
    playWrong();
  }
  return result;
}

export function bindInput(engine, els, rerender) {
  const onCanvas = (canvas) => (event) => {
    if (engine.phase !== PHASE.PLAYING) return;
    const { x, y } = panelPoint(canvas, event);
    if (x < 0 || x > PANEL_W || y < 0 || y > PANEL_H) return;
    handleClick(engine, x, y);
    rerender();
  };
  els.canvasA.addEventListener('click', onCanvas(els.canvasA));
  els.canvasB.addEventListener('click', onCanvas(els.canvasB));

  els.hintButton.addEventListener('click', () => {
    const idx = engine.useHint(performance.now(), HINT_PULSE_MS);
    if (idx !== null) playHint();
    rerender();
  });

  els.startButton.addEventListener('click', () => {
    engine.startGame();
    rerender();
  });
  els.continueButton.addEventListener('click', () => {
    engine.advance();
    rerender();
  });
  els.againButton.addEventListener('click', () => {
    engine.startGame();
    rerender();
  });
  els.muteButton.addEventListener('click', () => {
    const muted = toggleMute();
    els.muteButton.textContent = muted ? 'Sound: off' : 'Sound: on';
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'h' || event.key === 'H') {
      const idx = engine.useHint(performance.now(), HINT_PULSE_MS);
      if (idx !== null) playHint();
      rerender();
    } else if (event.key === 'm' || event.key === 'M') {
      const muted = toggleMute();
      els.muteButton.textContent = muted ? 'Sound: off' : 'Sound: on';
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (engine.phase === PHASE.TITLE) {
        engine.startGame();
        rerender();
      } else if (engine.phase === PHASE.ROUND_CLEAR) {
        engine.advance();
        rerender();
      } else if (engine.phase === PHASE.GAME_OVER) {
        engine.startGame();
        rerender();
      }
    }
  });
}

// Headless helper: click a difference by index (used by the screenshot
// driver and by the in-page self test). Returns the engine's verdict.
export function clickDifference(engine, diffIndex) {
  const d = engine.differences[diffIndex];
  return handleClick(engine, d.x, d.y);
}

// Headless helper: play a whole round by clicking every difference.
export function playRound(engine) {
  const verdicts = [];
  for (let i = 0; i < engine.differences.length; i++) {
    verdicts.push(clickDifference(engine, i));
  }
  return verdicts;
}
