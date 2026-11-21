// Harbor Lights — deterministic screenshot states.
// One clear job: put the game into a fixed, named state from the URL query
// (?shot=start, ?shot=play&scene=2&found=2, ?shot=win) so the maker's
// screenshots are real renders of the game in a known state. Every state is
// built by driving the real engine — clicks included — never by painting
// over the canvas.
//
//   ?shot=start            title screen over the harbour scene
//   ?shot=play&scene=N&found=K
//                          round N in progress with the first K differences
//                          already found (rings on, counter showing K left)
//   ?shot=win              results screen after clearing all three rounds

import { SCENES } from './scenes.js';
import { PHASE } from './engine.js';
import { clickDifference } from './input.js';

export const SHOT_STATES = ['start', 'play', 'win'];

function findFirst(engine, count) {
  for (let i = 0; i < count && i < engine.differences.length; i++) {
    clickDifference(engine, i);
  }
}

// Drive the engine through every round, finding every difference.
function clearAllRounds(engine) {
  engine.startGame();
  for (let round = 0; round < SCENES.length; round++) {
    for (let i = 0; i < engine.differences.length; i++) {
      clickDifference(engine, i);
    }
    if (engine.phase === PHASE.ROUND_CLEAR) engine.advance();
  }
}

export function applyShot(engine, query) {
  const shot = query.get('shot');
  if (!shot || !SHOT_STATES.includes(shot)) return null;

  if (shot === 'start') {
    // Title phase over round 1's scene: the default fresh state.
    return 'start';
  }

  if (shot === 'play') {
    const sceneNum = Math.min(
      Math.max(parseInt(query.get('scene') ?? '1', 10) || 1, 1),
      SCENES.length,
    );
    const found = Math.min(
      Math.max(parseInt(query.get('found') ?? '0', 10) || 0, 0),
      7,
    );
    engine.startGame();
    for (let r = 1; r < sceneNum; r++) {
      for (let i = 0; i < engine.differences.length; i++) {
        clickDifference(engine, i);
      }
      engine.advance();
    }
    findFirst(engine, found);
    return `play scene ${sceneNum} with ${found} found`;
  }

  if (shot === 'win') {
    clearAllRounds(engine);
    return 'win';
  }

  return null;
}
