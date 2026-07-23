import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const input = resolve(root, 'img/logo/logo-transparent.png');
const output = resolve(root, 'img/logo/logo-premium.png');
const sourceSize = 512;

const decoded = spawnSync(
  'ffmpeg',
  ['-v', 'error', '-i', input, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'],
  { encoding: null, maxBuffer: 16 * 1024 * 1024 },
);

if (decoded.status !== 0) {
  throw new Error(decoded.stderr?.toString() || 'Unable to decode the source logo.');
}

const pixels = decoded.stdout;
const total = sourceSize * sourceSize;

if (pixels.length !== total * 4) {
  throw new Error(`Unexpected source dimensions: received ${pixels.length} bytes.`);
}

// Measure every visible pixel's distance from transparency. The old asset has
// a binary (hard-cut) alpha edge, so its outermost pale pixels become a white
// fringe on the dark hero panel.
const distance = new Uint16Array(total);
distance.fill(65535);
const queue = new Int32Array(total);
let head = 0;
let tail = 0;

for (let index = 0; index < total; index += 1) {
  if (pixels[index * 4 + 3] === 0) {
    distance[index] = 0;
    queue[tail++] = index;
  }
}

const neighbours = (index, visit) => {
  const x = index % sourceSize;
  const y = Math.floor(index / sourceSize);
  if (x > 0) visit(index - 1);
  if (x + 1 < sourceSize) visit(index + 1);
  if (y > 0) visit(index - sourceSize);
  if (y + 1 < sourceSize) visit(index + sourceSize);
};

while (head < tail) {
  const index = queue[head++];
  const nextDistance = distance[index] + 1;
  neighbours(index, (next) => {
    if (distance[next] <= nextDistance) return;
    distance[next] = nextDistance;
    queue[tail++] = next;
  });
}

// Spread clean interior colours to the four-pixel perimeter. This removes the
// original white matte without changing the official lettering or emblem.
const nearestCore = new Int32Array(total);
nearestCore.fill(-1);
head = 0;
tail = 0;

for (let index = 0; index < total; index += 1) {
  if (pixels[index * 4 + 3] > 0 && distance[index] >= 5) {
    nearestCore[index] = index;
    queue[tail++] = index;
  }
}

while (head < tail) {
  const index = queue[head++];
  const source = nearestCore[index];
  neighbours(index, (next) => {
    if (nearestCore[next] !== -1) return;
    nearestCore[next] = source;
    queue[tail++] = next;
  });
}

let minX = sourceSize;
let minY = sourceSize;
let maxX = -1;
let maxY = -1;

for (let index = 0; index < total; index += 1) {
  const offset = index * 4;
  const oldAlpha = pixels[offset + 3];
  const edgeDistance = distance[index];

  if (oldAlpha === 0 || edgeDistance <= 1) {
    pixels[offset] = 0;
    pixels[offset + 1] = 0;
    pixels[offset + 2] = 0;
    pixels[offset + 3] = 0;
    continue;
  }

  if (edgeDistance <= 4 && nearestCore[index] !== -1) {
    const sourceOffset = nearestCore[index] * 4;
    pixels[offset] = pixels[sourceOffset];
    pixels[offset + 1] = pixels[sourceOffset + 1];
    pixels[offset + 2] = pixels[sourceOffset + 2];
  }

  pixels[offset + 3] = edgeDistance === 2 ? 124 : edgeDistance === 3 ? 224 : 255;

  const x = index % sourceSize;
  const y = Math.floor(index / sourceSize);
  minX = Math.min(minX, x);
  minY = Math.min(minY, y);
  maxX = Math.max(maxX, x);
  maxY = Math.max(maxY, y);
}

const contentWidth = maxX - minX + 1;
const contentHeight = maxY - minY + 1;
const paddedSide = Math.max(contentWidth, contentHeight) + 24;
const centreX = (minX + maxX) / 2;
const centreY = (minY + maxY) / 2;
const cropX = Math.max(0, Math.round(centreX - paddedSide / 2));
const cropY = Math.max(0, Math.round(centreY - paddedSide / 2));
const side = Math.min(paddedSide, sourceSize - cropX, sourceSize - cropY);
const cropped = Buffer.alloc(side * side * 4);

for (let y = 0; y < side; y += 1) {
  const from = ((cropY + y) * sourceSize + cropX) * 4;
  const to = y * side * 4;
  pixels.copy(cropped, to, from, from + side * 4);
}

const encoded = spawnSync(
  'ffmpeg',
  [
    '-v', 'error',
    '-f', 'rawvideo',
    '-pix_fmt', 'rgba',
    '-s', `${side}x${side}`,
    '-i', '-',
    '-vf', 'scale=720:720:flags=lanczos',
    '-frames:v', '1',
    '-c:v', 'png',
    '-compression_level', '9',
    '-f', 'image2pipe',
    '-',
  ],
  { input: cropped, encoding: null, maxBuffer: 16 * 1024 * 1024 },
);

if (encoded.status !== 0) {
  throw new Error(encoded.stderr?.toString() || 'Unable to encode the premium logo.');
}

writeFileSync(output, encoded.stdout);
console.log(`Created ${output} from a ${side}×${side} crop (${encoded.stdout.length} bytes).`);
