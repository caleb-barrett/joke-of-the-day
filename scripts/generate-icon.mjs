// Generates resources/icon.png (256x256 RGBA) with Node built-ins only.
// Run with `npm run icon`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const SIZE = 256;
const SAMPLES = 4; // 4x4 supersampling per pixel
const CORNER_RADIUS = 48;
const GRADIENT_START = [0x43, 0x38, 0xca]; // #4338ca
const GRADIENT_END = [0x6d, 0x28, 0xd9]; // #6d28d9
const WHITE = [0xff, 0xff, 0xff];
const INDIGO = [0x43, 0x38, 0xca];
const FACE = { x: 128, y: 128, r: 84 };
const EYES = [{ x: 100, y: 108, r: 11 }, { x: 156, y: 108, r: 11 }];
const SMILE = { x: 128, y: 124, inner: 44, outer: 56, fromDeg: 20, toDeg: 160 };
const OUTPUT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'resources', 'icon.png');

const inCircle = (x, y, c) => (x - c.x) ** 2 + (y - c.y) ** 2 <= c.r ** 2;

function inRoundedSquare(x, y) {
  const cx = Math.min(Math.max(x, CORNER_RADIUS), SIZE - CORNER_RADIUS);
  const cy = Math.min(Math.max(y, CORNER_RADIUS), SIZE - CORNER_RADIUS);
  return (x - cx) ** 2 + (y - cy) ** 2 <= CORNER_RADIUS ** 2;
}

function inSmile(x, y) {
  const dx = x - SMILE.x;
  const dy = y - SMILE.y;
  const dist = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI; // y grows downwards, so the lower half is 0..180
  return dist >= SMILE.inner && dist <= SMILE.outer && angle >= SMILE.fromDeg && angle <= SMILE.toDeg;
}

/** Returns [r, g, b, a] for a single sample point, or null when transparent. */
function sample(x, y) {
  if (!inRoundedSquare(x, y)) return null;
  if (EYES.some((eye) => inCircle(x, y, eye)) || inSmile(x, y)) return INDIGO;
  if (inCircle(x, y, FACE)) return WHITE;
  const t = (x + y) / (2 * SIZE);
  return GRADIENT_START.map((start, i) => start + (GRADIENT_END[i] - start) * t);
}

const rows = Buffer.alloc(SIZE * (SIZE * 4 + 1)); // each scanline: filter byte 0 + RGBA
for (let py = 0; py < SIZE; py++) {
  for (let px = 0; px < SIZE; px++) {
    const sum = [0, 0, 0, 0];
    for (let sy = 0; sy < SAMPLES; sy++) {
      for (let sx = 0; sx < SAMPLES; sx++) {
        const color = sample(px + (sx + 0.5) / SAMPLES, py + (sy + 0.5) / SAMPLES);
        if (!color) continue;
        for (let i = 0; i < 3; i++) sum[i] += color[i];
        sum[3] += 1;
      }
    }
    const offset = py * (SIZE * 4 + 1) + 1 + px * 4;
    if (sum[3] > 0) {
      for (let i = 0; i < 3; i++) rows[offset + i] = Math.round(sum[i] / sum[3]);
    }
    rows[offset + 3] = Math.round((sum[3] / SAMPLES ** 2) * 255);
  }
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([length, typeBuf, data, crc]);
}

const header = Buffer.alloc(13);
header.writeUInt32BE(SIZE, 0);
header.writeUInt32BE(SIZE, 4);
header.set([8, 6, 0, 0, 0], 8); // bit depth 8, color type 6 (RGBA), default compression/filter/interlace

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', header),
  chunk('IDAT', zlib.deflateSync(rows)),
  chunk('IEND', Buffer.alloc(0)),
]);

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, png);
console.log(`Wrote ${OUTPUT} (${png.length} bytes)`);
