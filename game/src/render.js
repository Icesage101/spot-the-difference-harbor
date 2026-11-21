// Harbor Lights — the renderer.
// One clear job: turn engine state into pixels and HUD text. It never changes
// the rules; it only draws the two panels (the scene, the rings on found
// differences, the hint pulse) and updates the DOM header, counter and
// overlays for the title, round-clear and game-over screens.

import { PANEL_W, PANEL_H, ROUND_TIME_SECONDS, PALETTE } from './config.js';
import { foundRing } from './draw.js';
import { PHASE } from './engine.js';

function drawPanel(canvas, engine, isRight, nowMs) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  engine.scene.draw(ctx, engine.seed, isRight);

  // Rings on every difference already found, on both panels at once.
  for (const i of engine.found) {
    const d = engine.differences[i];
    ctx.fillStyle = PALETTE.foundFill;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 6, 0, Math.PI * 2);
    ctx.fill();
    foundRing(ctx, d.x, d.y, d.r + 6, PALETTE.foundRing);
  }

  // The hint pulse: a breathing ring around one unfound difference.
  if (engine.hintPulse && engine.phase === PHASE.PLAYING) {
    const d = engine.differences[engine.hintPulse.diffIndex];
    const breathe = 1 + 0.18 * Math.sin(nowMs / 130);
    ctx.strokeStyle = PALETTE.hintRing;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(d.x, d.y, (d.r + 10) * breathe, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Frame.
  ctx.strokeStyle = PALETTE.panelBorder;
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, PANEL_W - 4, PANEL_H - 4);
}

function setText(el, text) {
  if (el && el.textContent !== text) el.textContent = text;
}

export function render(engine, els, nowMs) {
  const snap = engine.snapshot();

  drawPanel(els.canvasA, engine, false, nowMs);
  drawPanel(els.canvasB, engine, true, nowMs);

  setText(els.round, `Round ${snap.round} / ${snap.rounds} — ${snap.sceneTitle}`);
  setText(els.score, `Score ${snap.score}`);
  setText(els.found, `${snap.found} / ${snap.total} found — ${snap.remaining} to go`);
  setText(els.hints, `Hints ${snap.hintsLeft}`);
  setText(els.message, snap.message);

  // Timer bar: full width at 90s, draining, red under 15s.
  const frac = Math.max(0, snap.timeLeft / ROUND_TIME_SECONDS);
  if (els.timerFill) {
    els.timerFill.style.width = `${Math.round(frac * 100)}%`;
    els.timerFill.style.background =
      snap.timeLeft <= 15 ? PALETTE.danger : PALETTE.accent;
  }
  setText(els.timerText, `${snap.timeLeft}s`);

  // Overlays: exactly one visible at a time.
  const show = (el, on) => {
    if (el) el.classList.toggle('hidden', !on);
  };
  show(els.overlayTitle, snap.phase === PHASE.TITLE);
  show(els.overlayClear, snap.phase === PHASE.ROUND_CLEAR);
  show(els.overlayOver, snap.phase === PHASE.GAME_OVER);

  if (snap.phase === PHASE.ROUND_CLEAR && els.clearText) {
    setText(
      els.clearText,
      engine.isLastRound
        ? `You cleared ${snap.sceneTitle}! Press Continue for your results.`
        : `You cleared ${snap.sceneTitle}! ${snap.message}`,
    );
  }
  if (snap.phase === PHASE.GAME_OVER && els.overText) {
    const wonAll = snap.roundsWon === snap.rounds;
    setText(
      els.overTitle,
      wonAll ? 'You found them all!' : snap.roundsWon > 0 ? 'Good hunting!' : 'Time ran out.',
    );
    setText(
      els.overText,
      wonAll
        ? `All three scenes cleared — ${snap.roundsWon} of ${snap.rounds} rounds won. Final score: ${snap.score}.`
        : snap.missed.length
          ? `You missed: ${snap.missed.join(', ')}. Final score: ${snap.score}. Play again to beat it!`
          : `Final score: ${snap.score}. Play again to beat it!`,
    );
  }

  // The hint button is only live while playing and hints remain.
  if (els.hintButton) {
    els.hintButton.disabled =
      snap.phase !== PHASE.PLAYING || snap.hintsLeft <= 0;
  }
}
