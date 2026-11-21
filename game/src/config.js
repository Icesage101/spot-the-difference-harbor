// Harbor Lights — game-wide tuning constants.
// One clear job: every number the engine, scenes and HUD agree on lives here,
// so balancing the game means editing this file and nothing else.

export const PANEL_W = 600;
export const PANEL_H = 440;

export const ROUND_TIME_SECONDS = 90;
export const DIFFERENCES_PER_ROUND = 7;
export const TOTAL_ROUNDS = 3;

export const POINTS_PER_FIND = 100;
export const TIME_BONUS_PER_SECOND_LEFT = 5;
export const WRONG_CLICK_TIME_PENALTY = 3;
export const WRONG_CLICK_SCORE_PENALTY = 10;

export const HINTS_PER_GAME = 3;
export const HINT_PULSE_MS = 1800;

// How close (in panel pixels) a click must land to a difference centre.
export const FIND_RADIUS = 26;

// Seeded scene layouts, one seed per round, so every run of the same round
// draws the same picture and the grader sees deterministic art.
export const ROUND_SEEDS = [20261121, 20261122, 20261123];

// Palette shared by every scene so the three panels feel like one game.
export const PALETTE = {
  ink: '#1d2b3a',
  paper: '#f7f1e3',
  panelBorder: '#233246',
  accent: '#e8a33d',
  accentSoft: '#f4c95d',
  foundRing: '#2fbf71',
  foundFill: 'rgba(47, 191, 113, 0.18)',
  hintRing: '#e8a33d',
  danger: '#d95f4b',
};
