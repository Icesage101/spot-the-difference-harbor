# Harbor Lights — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Icesage101/spot-the-difference-harbor/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Icesage101/spot-the-difference-harbor/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two pictures hang side by side in the harbour gallery. They look identical — they are not. **Harbor Lights** is a complete spot-the-difference game that runs offline in a desktop browser from its own files: three hand-drawn scenes (Dusk Harbor, The Book Nook, Night Garden), seven fair-but-hidden differences per scene, a 90-second timer, score, hints, and win/lose states — all art drawn procedurally in code, all sound synthesized with WebAudio, no network at runtime.

## How to play

- Click a difference on **either** picture to ring it on both.
- Find all 7 before the 90-second lamp burns down. A wrong click costs 3 seconds and 10 points.
- Three rounds, then your final score. Press **H** for a hint (3 per game), **M** to mute, **Enter** to continue.

## Run it

```sh
python3 -m http.server 8080 --directory game
```

Then open http://localhost:8080 in desktop Chrome. (Any static server works; `game/index.html` loads only files under `game/`.)

Screenshot states for the maker: `?shot=start`, `?shot=play&scene=2&found=2`, `?shot=win`.

## Layout

- `game/index.html` — page shell, HUD, overlays
- `game/src/config.js` — tuning constants and palette
- `game/src/scenes.js` — the three scenes and their seven differences each
- `game/src/draw.js` — seeded randomness and small canvas shapes
- `game/src/engine.js` — rules and state (timer, scoring, hints)
- `game/src/render.js` — panels, rings, HUD
- `game/src/input.js` — mouse, touch and keyboard
- `game/src/audio.js` — synthesized sound effects
- `game/src/shots.js` — deterministic screenshot states
- `game/src/main.js` — bootstrap
- `main.ts` — the hand-in program: copies `game/` and `screenshots/` to `/output` and writes `dossier.json`
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=h6wxe48a&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
