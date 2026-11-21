// Harbor Lights — the game engine.
// One clear job: the rules and the state, nothing about pixels or the DOM.
// The renderer reads this state; the input handler calls its methods; the
// screenshot helper drives it directly. No timers live here — the caller
// ticks it with elapsed seconds, which keeps headless play deterministic.

import {
  ROUND_TIME_SECONDS,
  DIFFERENCES_PER_ROUND,
  TOTAL_ROUNDS,
  POINTS_PER_FIND,
  TIME_BONUS_PER_SECOND_LEFT,
  WRONG_CLICK_TIME_PENALTY,
  WRONG_CLICK_SCORE_PENALTY,
  HINTS_PER_GAME,
  ROUND_SEEDS,
  FIND_RADIUS,
} from './config.js';
import { SCENES } from './scenes.js';

export const PHASE = {
  TITLE: 'title',
  PLAYING: 'playing',
  ROUND_CLEAR: 'roundClear',
  GAME_OVER: 'gameOver',
};

export class Engine {
  constructor() {
    this.reset();
  }

  reset() {
    this.phase = PHASE.TITLE;
    this.roundIndex = 0;
    this.score = 0;
    this.hintsLeft = HINTS_PER_GAME;
    this.roundsWon = 0;
    this.found = new Set();
    this.timeLeft = ROUND_TIME_SECONDS;
    this.hintPulse = null; // { diffIndex, untilMs }
    this.message = 'Find all 7 differences before time runs out.';
    this.missedLabels = [];
    this.nowMs = 0;
  }

  get scene() {
    return SCENES[this.roundIndex];
  }

  get seed() {
    return ROUND_SEEDS[this.roundIndex];
  }

  get differences() {
    return this.scene.differences;
  }

  get foundCount() {
    return this.found.size;
  }

  get remainingCount() {
    return DIFFERENCES_PER_ROUND - this.found.size;
  }

  get isLastRound() {
    return this.roundIndex === TOTAL_ROUNDS - 1;
  }

  startGame() {
    this.reset();
    this.phase = PHASE.PLAYING;
    this.message = `Round 1 — ${this.scene.title}. ${this.scene.subtitle}`;
  }

  startRound() {
    this.found = new Set();
    this.timeLeft = ROUND_TIME_SECONDS;
    this.hintPulse = null;
    this.phase = PHASE.PLAYING;
    this.message = `Round ${this.roundIndex + 1} — ${this.scene.title}. ${this.scene.subtitle}`;
  }

  // Advance the clock. Returns 'timeout' when the round just ran out.
  tick(dtSeconds, nowMs) {
    this.nowMs = nowMs;
    if (this.phase !== PHASE.PLAYING) return null;
    this.timeLeft -= dtSeconds;
    if (this.hintPulse && nowMs > this.hintPulse.untilMs) this.hintPulse = null;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.endRound(false);
      return 'timeout';
    }
    return null;
  }

  // A click at panel coordinates. Panel is 0 (left) or 1 (right); a
  // difference counts on either panel, and the ring appears on both.
  click(x, y) {
    if (this.phase !== PHASE.PLAYING) return 'ignored';
    const hit = this.differences.findIndex((d) => {
      const dx = x - d.x;
      const dy = y - d.y;
      const reach = Math.max(FIND_RADIUS, d.r);
      return dx * dx + dy * dy <= reach * reach;
    });
    if (hit === -1) {
      this.timeLeft = Math.max(0, this.timeLeft - WRONG_CLICK_TIME_PENALTY);
      this.score = Math.max(0, this.score - WRONG_CLICK_SCORE_PENALTY);
      this.message = `Not quite — that spot matches. −${WRONG_CLICK_TIME_PENALTY}s, −${WRONG_CLICK_SCORE_PENALTY} pts.`;
      if (this.timeLeft === 0) this.endRound(false);
      return 'wrong';
    }
    if (this.found.has(hit)) return 'already';
    this.found.add(hit);
    this.score += POINTS_PER_FIND;
    const left = this.remainingCount;
    this.message =
      left === 0
        ? 'All found — beautiful eyes!'
        : `Found ${this.differences[hit].label}! ${left} to go.`;
    if (left === 0) this.endRound(true);
    return 'found';
  }

  // Spend a hint: briefly pulse the ring of one difference still unfound.
  useHint(nowMs, pulseMs) {
    if (this.phase !== PHASE.PLAYING || this.hintsLeft <= 0) return null;
    const remaining = this.differences
      .map((d, i) => i)
      .filter((i) => !this.found.has(i));
    if (remaining.length === 0) return null;
    this.hintsLeft -= 1;
    // Always hint the first unfound difference, so hints are deterministic.
    const diffIndex = remaining[0];
    this.hintPulse = { diffIndex, untilMs: nowMs + pulseMs };
    this.message = `Hint: look near ${this.differences[diffIndex].label}.`;
    return diffIndex;
  }

  endRound(won) {
    if (won) {
      const bonus = Math.ceil(this.timeLeft) * TIME_BONUS_PER_SECOND_LEFT;
      this.score += bonus;
      this.roundsWon += 1;
      this.message = `Round clear! Time bonus +${bonus}.`;
      this.phase = PHASE.ROUND_CLEAR;
    } else {
      this.missedLabels = this.differences
        .map((d, i) => ({ d, i }))
        .filter(({ i }) => !this.found.has(i))
        .map(({ d }) => d.label);
      this.message = `Time up! You missed: ${this.missedLabels.join(', ')}.`;
      this.phase = PHASE.GAME_OVER;
    }
  }

  // From the round-clear screen, move on (or finish the game).
  advance() {
    if (this.phase !== PHASE.ROUND_CLEAR) return;
    if (this.isLastRound) {
      this.phase = PHASE.GAME_OVER;
      this.message = `You cleared all three scenes! Final score: ${this.score}.`;
    } else {
      this.roundIndex += 1;
      this.startRound();
    }
  }

  // Snapshot for the HUD and for headless checks.
  snapshot() {
    return {
      phase: this.phase,
      round: this.roundIndex + 1,
      rounds: TOTAL_ROUNDS,
      scene: this.scene.id,
      sceneTitle: this.scene.title,
      score: this.score,
      timeLeft: Math.ceil(this.timeLeft),
      found: this.foundCount,
      total: DIFFERENCES_PER_ROUND,
      remaining: this.remainingCount,
      hintsLeft: this.hintsLeft,
      roundsWon: this.roundsWon,
      message: this.message,
      missed: this.missedLabels,
    };
  }
}
