// Harbor Lights — the hand-in program (Node 22, standard library only).
//
// The game is plain static files under game/ plus 3-4 screenshots under
// screenshots/. This program copies both into the grader's output directory
// and writes /output/dossier.json with the kit's buildDossier library, so the
// sealed gate can check the files and the judge can read the dossier.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The program is deterministic: it walks directories in sorted order, copies
// bytes unchanged, and the dossier is a pure function of the files it reads,
// so two runs write the same bytes.

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

const GAME_DIR = join(repoRoot, 'game');
const SHOTS_DIR = join(repoRoot, 'screenshots');

// The gate's caps, from the competition brief: game/ at most 993 entries
// and 48 MiB, screenshots at most 4 files of 256 KiB, dossier at most
// 1.5 MiB of text (160 KiB cap inside buildDossier's text budget).
const DOSSIER_OPTIONS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function fail(message) {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

// Copy a directory tree in sorted order, refusing symlinks so the output
// holds only plain files and directories, as the gate requires.
function copyTree(source, target, counts) {
  mkdirSync(target, { recursive: true });
  for (const name of readdirSync(source).sort()) {
    const from = join(source, name);
    const to = join(target, name);
    const info = statSync(from);
    if (info.isSymbolicLink()) fail(`refusing symlink: ${from}`);
    if (info.isDirectory()) {
      counts.dirs += 1;
      copyTree(from, to, counts);
    } else if (info.isFile()) {
      counts.files += 1;
      counts.bytes += info.size;
      copyFileSync(from, to);
    } else {
      fail(`unsupported entry (not a file or directory): ${from}`);
    }
  }
}

function main() {
  if (!existsSync(join(GAME_DIR, 'index.html'))) {
    fail('game/index.html is missing');
  }
  if (!existsSync(join(repoRoot, 'vendor', 'makefun-game.ts'))) {
    fail('vendor/makefun-game.ts is missing');
  }
  if (!existsSync(SHOTS_DIR)) fail('screenshots/ is missing');

  const shotNames = readdirSync(SHOTS_DIR)
    .filter((n) => !n.startsWith('.'))
    .sort();
  if (shotNames.length < 3 || shotNames.length > 4) {
    fail(`screenshots/ must hold 3 or 4 images, found ${shotNames.length}`);
  }
  for (const name of shotNames) {
    if (!/^[A-Za-z0-9._-]+$/.test(name) || name.startsWith('-')) {
      fail(`bad screenshot name: ${name}`);
    }
    const size = statSync(join(SHOTS_DIR, name)).size;
    if (size > 262144) fail(`screenshot over 256 KiB: ${name}`);
    // The gate wants whole PNG or JPEG files: check the magic bytes.
    const head = readFileSync(join(SHOTS_DIR, name)).subarray(0, 8);
    const isPng = head.length >= 8 && head.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
    const isJpeg = head.length >= 2 && head[0] === 0xff && head[1] === 0xd8;
    if (!isPng && !isJpeg) fail(`screenshot is not PNG or JPEG: ${name}`);
  }
  if (statSync(join(GAME_DIR, 'index.html')).size > 1048576) {
    fail('game/index.html is over 1 MiB');
  }

  mkdirSync(outputDir, { recursive: true });
  const gameCounts = { files: 0, dirs: 0, bytes: 0 };
  copyTree(GAME_DIR, join(outputDir, 'game'), gameCounts);
  const shotCounts = { files: 0, dirs: 0, bytes: 0 };
  copyTree(SHOTS_DIR, join(outputDir, 'screenshots'), shotCounts);

  const dossier = buildDossier(outputDir, DOSSIER_OPTIONS);
  writeFileSync(join(outputDir, 'dossier.json'), dossier);

  console.log(`Harbor Lights hand-in complete.`);
  console.log(`  game: ${gameCounts.files} files, ${gameCounts.bytes} bytes`);
  console.log(
    `  screenshots: ${shotNames.map((n) => basename(n)).join(', ')} (${shotCounts.bytes} bytes)`,
  );
  console.log(`  dossier.json: ${Buffer.byteLength(dossier, 'utf8')} bytes`);
  console.log(`  output: ${outputDir}`);
}

main();
