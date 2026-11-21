// Harbor Lights — the three scenes.
// One clear job: draw each picture twice (left panel and right panel) and name
// the seven differences between them. Both panels share one seed, so the art
// is identical except for the listed differences — the hunt is fair.
//
// Every difference entry: { x, y, r, label } in panel coordinates (600x440).
// The label is shown on the results screen when a difference was missed.

import { PANEL_W, PANEL_H } from './config.js';
import {
  makeRng, pick, roundRect, circle, ellipse, sparkle, star, sky, gull,
} from './draw.js';

// ---------------------------------------------------------------------------
// Scene 1 — Dusk Harbor
// ---------------------------------------------------------------------------
function drawHarbor(ctx, seed, right) {
  const rng = makeRng(seed);
  sky(ctx, PANEL_W, PANEL_H, '#2b3a67', '#e8915a');

  // Sun, top left. Right panel: the rays are gone.
  ctx.fillStyle = '#f7d774';
  circle(ctx, 90, 70, 26);
  ctx.fill();
  if (!right) {
    ctx.strokeStyle = '#f7d774';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 4) * i;
      ctx.beginPath();
      ctx.moveTo(90 + Math.cos(a) * 32, 70 + Math.sin(a) * 32);
      ctx.lineTo(90 + Math.cos(a) * 42, 70 + Math.sin(a) * 42);
      ctx.stroke();
    }
  }

  // Gulls. Right panel: the middle gull is gone.
  gull(ctx, 200, 90, 14, '#22304a');
  if (!right) gull(ctx, 250, 62, 11, '#22304a');
  gull(ctx, 320, 100, 12, '#22304a');

  // Sea.
  const sea = ctx.createLinearGradient(0, 260, 0, PANEL_H);
  sea.addColorStop(0, '#2c5a74');
  sea.addColorStop(1, '#16324a');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 260, PANEL_W, PANEL_H - 260);
  // Sunlight path on the water.
  ctx.fillStyle = 'rgba(247, 215, 116, 0.25)';
  for (let i = 0; i < 6; i++) {
    const y = 275 + i * 26;
    ctx.fillRect(58 + i * 6, y, 64 - i * 8, 5);
  }
  // Wave lines (seeded, same both sides).
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const x = 30 + rng() * 540;
    const y = 280 + rng() * 140;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 12, y - 4, x + 26, y);
    ctx.stroke();
  }

  // Rocky base and lighthouse, right side.
  ctx.fillStyle = '#5d5a52';
  ctx.beginPath();
  ctx.moveTo(430, 265);
  ctx.lineTo(530, 265);
  ctx.lineTo(520, 240);
  ctx.lineTo(445, 240);
  ctx.closePath();
  ctx.fill();
  // Tower: white with red bands.
  ctx.fillStyle = '#f4efe4';
  ctx.fillRect(462, 92, 36, 152);
  ctx.fillStyle = '#c65a4a';
  ctx.fillRect(462, 130, 36, 18);
  ctx.fillRect(462, 186, 36, 18);
  // Gallery and lamp room.
  ctx.fillStyle = '#22304a';
  ctx.fillRect(456, 84, 48, 10);
  ctx.fillStyle = '#f7d774';
  ctx.fillRect(464, 62, 32, 22);
  ctx.fillStyle = '#22304a';
  ctx.fillRect(460, 56, 40, 8);
  // The beam. Right panel: the lamp is dark.
  if (!right) {
    const beam = ctx.createLinearGradient(464, 73, 150, 73);
    beam.addColorStop(0, 'rgba(247, 215, 116, 0.55)');
    beam.addColorStop(1, 'rgba(247, 215, 116, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(464, 64);
    ctx.lineTo(150, 40);
    ctx.lineTo(150, 108);
    ctx.lineTo(464, 84);
    ctx.closePath();
    ctx.fill();
  }

  // Pier from the left edge.
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(30, 305, 310, 14);
  ctx.fillStyle = '#5d3d22';
  for (const px of [60, 140, 220, 300]) {
    ctx.fillRect(px, 319, 10, 38);
  }
  // Lamp post on the pier. Right panel: the lamp is unlit.
  ctx.strokeStyle = '#22304a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(300, 305);
  ctx.lineTo(300, 196);
  ctx.stroke();
  ctx.fillStyle = '#22304a';
  ctx.fillRect(288, 190, 24, 18);
  if (!right) {
    ctx.fillStyle = 'rgba(247, 215, 116, 0.5)';
    circle(ctx, 300, 214, 22);
    ctx.fill();
    ctx.fillStyle = '#f7d774';
    circle(ctx, 300, 214, 9);
    ctx.fill();
  } else {
    ctx.fillStyle = '#8a8f96';
    circle(ctx, 300, 214, 9);
    ctx.fill();
  }

  // Crates stacked on the pier. Right panel: one extra crate on top.
  ctx.fillStyle = '#a8763e';
  ctx.fillRect(75, 278, 26, 27);
  ctx.fillRect(103, 278, 26, 27);
  ctx.strokeStyle = '#6d4a24';
  ctx.lineWidth = 2;
  ctx.strokeRect(75, 278, 26, 27);
  ctx.strokeRect(103, 278, 26, 27);
  if (right) {
    ctx.fillStyle = '#a8763e';
    ctx.fillRect(89, 251, 26, 27);
    ctx.strokeStyle = '#6d4a24';
    ctx.strokeRect(89, 251, 26, 27);
  }

  // Sailboat. Right panel: the sail is teal instead of red.
  ctx.fillStyle = '#4a3226';
  ctx.beginPath();
  ctx.moveTo(148, 330);
  ctx.lineTo(218, 330);
  ctx.lineTo(206, 348);
  ctx.lineTo(160, 348);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3a2a1e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(182, 330);
  ctx.lineTo(182, 252);
  ctx.stroke();
  ctx.fillStyle = right ? '#2f8f83' : '#c65a4a';
  ctx.beginPath();
  ctx.moveTo(182, 256);
  ctx.lineTo(182, 322);
  ctx.lineTo(226, 322);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e8a33d';
  ctx.beginPath();
  ctx.moveTo(182, 252);
  ctx.lineTo(200, 258);
  ctx.lineTo(182, 264);
  ctx.closePath();
  ctx.fill();

  // Buoy. Right panel: it has drifted away.
  if (!right) {
    ctx.fillStyle = '#d96a2f';
    ctx.beginPath();
    ctx.moveTo(430, 336);
    ctx.lineTo(446, 336);
    ctx.lineTo(440, 362);
    ctx.lineTo(436, 362);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f4efe4';
    ctx.fillRect(431, 346, 14, 6);
    ctx.fillStyle = '#22304a';
    ctx.fillRect(435, 330, 4, 8);
  }
}

const HARBOR_DIFFERENCES = [
  { x: 425, y: 85, r: 28, label: 'the lighthouse beam' },
  { x: 250, y: 62, r: 18, label: 'the middle gull' },
  { x: 200, y: 290, r: 26, label: 'the sail colour' },
  { x: 438, y: 350, r: 20, label: 'the orange buoy' },
  { x: 102, y: 264, r: 22, label: 'the extra crate' },
  { x: 300, y: 214, r: 20, label: 'the pier lamp' },
  { x: 90, y: 70, r: 32, label: 'the sun rays' },
];

// ---------------------------------------------------------------------------
// Scene 2 — The Book Nook
// ---------------------------------------------------------------------------
function drawNook(ctx, seed, right) {
  const rng = makeRng(seed);
  // Wall and floor.
  ctx.fillStyle = '#f2e3c6';
  ctx.fillRect(0, 0, PANEL_W, 360);
  ctx.fillStyle = '#b98a5a';
  ctx.fillRect(0, 360, PANEL_W, 80);
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 2;
  for (let y = 380; y < PANEL_H; y += 18) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(PANEL_W, y);
    ctx.stroke();
  }

  // Window, top right, night outside. Right panel: the moon is gone.
  ctx.fillStyle = '#22304a';
  ctx.fillRect(418, 28, 144, 124);
  ctx.fillStyle = '#1b2b52';
  ctx.fillRect(426, 36, 128, 108);
  for (let i = 0; i < 10; i++) {
    sparkle(ctx, 436 + rng() * 108, 44 + rng() * 92, 2.5, '#f4efe4');
  }
  if (!right) {
    ctx.fillStyle = '#f7e8b0';
    circle(ctx, 490, 80, 18);
    ctx.fill();
    ctx.fillStyle = '#d9c37a';
    circle(ctx, 484, 74, 4);
    ctx.fill();
    circle(ctx, 496, 86, 3);
    ctx.fill();
  }
  ctx.strokeStyle = '#f4efe4';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(490, 36);
  ctx.lineTo(490, 144);
  ctx.moveTo(426, 90);
  ctx.lineTo(554, 90);
  ctx.stroke();

  // Bookshelf, left. The top shelf is laid out from fixed widths so the one
  // book that changes colour sits at an exact, known spot (x 120, y 92).
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(28, 40, 184, 292);
  const shelfColors = ['#c65a4a', '#2f6f5e', '#3f6da8', '#e8a33d', '#7a4a8a'];
  const topShelf = [
    { w: 16, h: 52, c: '#3f6da8' },
    { w: 14, h: 46, c: '#e8a33d' },
    { w: 18, h: 56, c: '#2f6f5e' },
    { w: 15, h: 48, c: '#7a4a8a' },
    { w: 17, h: 52, c: '#c65a4a' },
    { w: 13, h: 44, c: '#3f6da8' },
    { w: 16, h: 54, c: '#e8a33d' },
    { w: 14, h: 47, c: '#2f6f5e' },
  ];
  for (let shelf = 0; shelf < 3; shelf++) {
    const top = 56 + shelf * 92;
    ctx.fillStyle = '#f4efe4';
    ctx.fillRect(36, top, 168, 62);
    if (shelf === 0) {
      let bx = 40;
      topShelf.forEach((book, i) => {
        // The fifth book on the top shelf changes colour on the right.
        const isTarget = i === 4;
        ctx.fillStyle = isTarget && right ? '#2f6f5e' : book.c;
        ctx.fillRect(bx, top + 62 - book.h, book.w, book.h);
        bx += book.w + 2;
      });
    } else {
      let bx = 40;
      while (bx < 192) {
        const bw = 12 + rng() * 8;
        const bh = 44 + rng() * 14;
        ctx.fillStyle = pick(rng, shelfColors);
        ctx.fillRect(bx, top + 62 - bh, bw, bh);
        bx += bw + 2;
      }
    }
    ctx.fillStyle = '#5d3d22';
    ctx.fillRect(36, top + 62, 168, 8);
  }

  // Wall clock. Right panel: the hands read half past four, not three.
  ctx.fillStyle = '#f4efe4';
  circle(ctx, 300, 75, 30);
  ctx.fill();
  ctx.strokeStyle = '#22304a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(300, 75, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 75);
  if (!right) {
    ctx.lineTo(300, 55); // up: twelve
    ctx.moveTo(300, 75);
    ctx.lineTo(318, 75); // right: three
  } else {
    ctx.lineTo(300, 95); // down: six
    ctx.moveTo(300, 75);
    ctx.lineTo(315, 67); // half past four
  }
  ctx.stroke();
  ctx.fillStyle = '#22304a';
  circle(ctx, 300, 75, 3);
  ctx.fill();

  // Table with teapot. Right panel: no steam rises.
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(230, 300, 190, 12);
  ctx.fillStyle = '#6d4525';
  ctx.fillRect(244, 312, 12, 48);
  ctx.fillRect(394, 312, 12, 48);
  // Teapot body, spout, lid.
  ctx.fillStyle = '#3f6da8';
  ellipse(ctx, 300, 282, 30, 20);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(272, 276);
  ctx.quadraticCurveTo(252, 268, 256, 250);
  ctx.quadraticCurveTo(266, 262, 274, 270);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2c4f7a';
  circle(ctx, 300, 260, 7);
  ctx.fill();
  if (!right) {
    ctx.strokeStyle = 'rgba(120, 120, 120, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(300, 250);
    ctx.quadraticCurveTo(292, 238, 300, 228);
    ctx.quadraticCurveTo(308, 218, 300, 208);
    ctx.stroke();
  }

  // Lamp on the side table, left. Right panel: the lamp is off.
  ctx.fillStyle = '#8a5a34';
  ctx.fillRect(40, 300, 90, 12);
  ctx.fillStyle = '#6d4525';
  ctx.fillRect(78, 312, 8, 48);
  ctx.fillStyle = '#22304a';
  ctx.fillRect(62, 262, 6, 40);
  ctx.fillStyle = right ? '#b8a888' : '#f4c95d';
  ctx.beginPath();
  ctx.moveTo(48, 262);
  ctx.lineTo(86, 262);
  ctx.lineTo(78, 232);
  ctx.lineTo(56, 232);
  ctx.closePath();
  ctx.fill();
  if (!right) {
    ctx.fillStyle = 'rgba(244, 201, 93, 0.35)';
    circle(ctx, 67, 246, 26);
    ctx.fill();
  }

  // Rug and cat. Right panel: the cat has wandered off.
  ctx.fillStyle = '#a84a3f';
  ellipse(ctx, 300, 398, 135, 24);
  ctx.fill();
  ctx.strokeStyle = '#e8a33d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(300, 398, 118, 18, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (!right) {
    ctx.fillStyle = '#e8e0d0';
    ellipse(ctx, 330, 388, 34, 16);
    ctx.fill();
    circle(ctx, 356, 378, 12);
    ctx.fill();
    // Ears.
    ctx.beginPath();
    ctx.moveTo(348, 370);
    ctx.lineTo(352, 358);
    ctx.lineTo(358, 368);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(360, 368);
    ctx.lineTo(366, 358);
    ctx.lineTo(368, 370);
    ctx.closePath();
    ctx.fill();
    // Tail curled around.
    ctx.strokeStyle = '#e8e0d0';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(300, 392);
    ctx.quadraticCurveTo(288, 380, 300, 372);
    ctx.stroke();
    // Closed, sleeping eye.
    ctx.strokeStyle = '#22304a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(358, 378);
    ctx.quadraticCurveTo(362, 381, 366, 378);
    ctx.stroke();
  }

  // Potted plant, right. Right panel: the flower is gone.
  ctx.fillStyle = '#a84a3f';
  ctx.beginPath();
  ctx.moveTo(500, 330);
  ctx.lineTo(540, 330);
  ctx.lineTo(534, 362);
  ctx.lineTo(506, 362);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2f6f5e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(520, 330);
  ctx.lineTo(520, 292);
  ctx.moveTo(520, 312);
  ctx.quadraticCurveTo(500, 300, 496, 286);
  ctx.moveTo(520, 306);
  ctx.quadraticCurveTo(540, 296, 544, 282);
  ctx.stroke();
  if (!right) {
    ctx.fillStyle = '#e87aa8';
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5;
      circle(ctx, 520 + Math.cos(a) * 8, 283 + Math.sin(a) * 8, 5);
      ctx.fill();
    }
    ctx.fillStyle = '#e8a33d';
    circle(ctx, 520, 283, 4);
    ctx.fill();
  }
}

const NOOK_DIFFERENCES = [
  { x: 300, y: 75, r: 30, label: 'the clock hands' },
  { x: 300, y: 232, r: 20, label: 'the teapot steam' },
  { x: 330, y: 382, r: 32, label: 'the sleeping cat' },
  { x: 120, y: 92, r: 16, label: 'the red book spine' },
  { x: 520, y: 283, r: 18, label: 'the pink flower' },
  { x: 490, y: 80, r: 24, label: 'the window moon' },
  { x: 67, y: 246, r: 26, label: 'the lamp glow' },
];

// ---------------------------------------------------------------------------
// Scene 3 — Night Garden
// ---------------------------------------------------------------------------
function drawGarden(ctx, seed, right) {
  const rng = makeRng(seed);
  sky(ctx, PANEL_W, PANEL_H, '#16233f', '#2c4a6e');

  // Stars.
  for (let i = 0; i < 40; i++) {
    sparkle(ctx, rng() * PANEL_W, rng() * 240, 1.5 + rng() * 2, '#f4efe4');
  }
  // Moon. Right panel: the crater is gone.
  ctx.fillStyle = '#f7eec8';
  circle(ctx, 520, 65, 30);
  ctx.fill();
  if (!right) {
    ctx.fillStyle = '#d9c98f';
    circle(ctx, 510, 58, 6);
    ctx.fill();
    circle(ctx, 530, 72, 4);
    ctx.fill();
  }

  // Fireflies. Right panel: one has flown away.
  const flies = [
    [250, 150], [180, 120], [330, 100], [420, 170], [120, 200],
  ];
  flies.forEach(([fx, fy], i) => {
    if (right && i === 0) return;
    ctx.fillStyle = 'rgba(190, 255, 120, 0.4)';
    circle(ctx, fx, fy, 10);
    ctx.fill();
    ctx.fillStyle = '#c8ff6e';
    circle(ctx, fx, fy, 3.5);
    ctx.fill();
  });

  // Rolling hill.
  ctx.fillStyle = '#24402e';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(150, 260, 300, 300);
  ctx.quadraticCurveTo(450, 340, 600, 295);
  ctx.lineTo(600, 440);
  ctx.lineTo(0, 440);
  ctx.closePath();
  ctx.fill();

  // Fence across the hill. Right panel: one post is missing.
  ctx.strokeStyle = '#5d3d22';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(30, 306);
  ctx.lineTo(570, 306);
  ctx.moveTo(30, 326);
  ctx.lineTo(570, 326);
  ctx.stroke();
  ctx.fillStyle = '#7a5230';
  for (let px = 40; px <= 560; px += 52) {
    if (right && px === 92) continue;
    ctx.fillRect(px, 292, 8, 52);
  }

  // Telescope on its tripod. Right panel: it points down, not up.
  ctx.strokeStyle = '#3a2a1e';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(300, 290);
  ctx.lineTo(282, 330);
  ctx.moveTo(300, 290);
  ctx.lineTo(318, 330);
  ctx.moveTo(300, 290);
  ctx.lineTo(300, 332);
  ctx.stroke();
  ctx.strokeStyle = '#c8ccd4';
  ctx.lineWidth = 12;
  ctx.beginPath();
  if (!right) {
    ctx.moveTo(300, 292);
    ctx.lineTo(252, 240);
  } else {
    ctx.moveTo(300, 292);
    ctx.lineTo(344, 252);
  }
  ctx.stroke();
  ctx.fillStyle = '#22304a';
  if (!right) {
    circle(ctx, 250, 238, 9);
    ctx.fill();
  } else {
    circle(ctx, 346, 250, 9);
    ctx.fill();
  }

  // Owl on a branch, right side. Right panel: its eyes are shut.
  ctx.strokeStyle = '#4a3226';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(600, 108);
  ctx.quadraticCurveTo(540, 128, 470, 138);
  ctx.stroke();
  ctx.fillStyle = '#6d4a2a';
  ellipse(ctx, 472, 116, 16, 22);
  ctx.fill();
  circle(ctx, 472, 92, 12);
  ctx.fill();
  // Ear tufts.
  ctx.beginPath();
  ctx.moveTo(462, 84);
  ctx.lineTo(464, 74);
  ctx.lineTo(469, 82);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(476, 82);
  ctx.lineTo(480, 74);
  ctx.lineTo(482, 84);
  ctx.closePath();
  ctx.fill();
  if (!right) {
    ctx.fillStyle = '#ffffff';
    circle(ctx, 467, 90, 4.5);
    ctx.fill();
    circle(ctx, 478, 90, 4.5);
    ctx.fill();
    ctx.fillStyle = '#22304a';
    circle(ctx, 467, 90, 2);
    ctx.fill();
    circle(ctx, 478, 90, 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#22304a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(463, 90);
    ctx.lineTo(471, 90);
    ctx.moveTo(474, 90);
    ctx.lineTo(482, 90);
    ctx.stroke();
  }
  ctx.fillStyle = '#e8a33d';
  ctx.beginPath();
  ctx.moveTo(472, 94);
  ctx.lineTo(468, 100);
  ctx.lineTo(476, 100);
  ctx.closePath();
  ctx.fill();

  // Mushrooms. Right panel: a third little one appears.
  const mushroom = (mx, my, s) => {
    ctx.fillStyle = '#f4efe4';
    ctx.fillRect(mx - 2 * s, my, 4 * s, 10 * s);
    ctx.fillStyle = '#c65a4a';
    ctx.beginPath();
    ctx.arc(mx, my, 12 * s, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f4efe4';
    circle(ctx, mx - 5 * s, my - 5 * s, 2 * s);
    ctx.fill();
    circle(ctx, mx + 4 * s, my - 7 * s, 2 * s);
    ctx.fill();
  };
  mushroom(110, 372, 1);
  mushroom(132, 380, 0.7);
  if (right) mushroom(152, 386, 0.55);

  // Flowers along the hill. Right panel: the red one turns yellow.
  const flower = (fx, fy, color) => {
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5;
      circle(ctx, fx + Math.cos(a) * 7, fy + Math.sin(a) * 7, 4.5);
      ctx.fill();
    }
    ctx.fillStyle = '#e8a33d';
    circle(ctx, fx, fy, 3.5);
    ctx.fill();
    ctx.strokeStyle = '#2f6f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx, fy + 8);
    ctx.lineTo(fx, fy + 22);
    ctx.stroke();
  };
  flower(420, 362, right ? '#e8c33d' : '#d95f4b');
  flower(360, 380, '#e87aa8');
  flower(480, 385, '#f4efe4');
  flower(200, 395, '#b48ae0');

  // Path stones.
  ctx.fillStyle = 'rgba(244, 239, 228, 0.7)';
  for (const [sx, sy, sr] of [[280, 400, 12], [310, 415, 10], [340, 428, 12], [250, 418, 9]]) {
    ellipse(ctx, sx, sy, sr, sr * 0.6);
    ctx.fill();
  }
}

const GARDEN_DIFFERENCES = [
  { x: 472, y: 92, r: 22, label: 'the owl eyes' },
  { x: 152, y: 384, r: 16, label: 'the third mushroom' },
  { x: 250, y: 150, r: 14, label: 'the missing firefly' },
  { x: 298, y: 262, r: 30, label: 'the telescope aim' },
  { x: 420, y: 362, r: 16, label: 'the red flower' },
  { x: 96, y: 315, r: 18, label: 'the fence post' },
  { x: 520, y: 65, r: 30, label: 'the moon crater' },
];

// ---------------------------------------------------------------------------
// The catalogue the engine and the screenshot helper read.
// ---------------------------------------------------------------------------
export const SCENES = [
  {
    id: 'harbor',
    title: 'Dusk Harbor',
    subtitle: 'Seven changes hide along the pier.',
    draw: drawHarbor,
    differences: HARBOR_DIFFERENCES,
  },
  {
    id: 'nook',
    title: 'The Book Nook',
    subtitle: 'Seven changes hide in the reading room.',
    draw: drawNook,
    differences: NOOK_DIFFERENCES,
  },
  {
    id: 'garden',
    title: 'Night Garden',
    subtitle: 'Seven changes hide under the stars.',
    draw: drawGarden,
    differences: GARDEN_DIFFERENCES,
  },
];

export function sceneById(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}
