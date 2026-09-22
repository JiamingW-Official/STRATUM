// A QR encoder, written out rather than installed.
//
// It is here for one reason: the code on the boarding pass has to actually
// scan. A picture of a QR code is a lie that survives right up until somebody
// points a phone at the screen, and this whole surface exists to be pointed a
// phone at. So this is the real thing — byte mode, error correction level M,
// Reed–Solomon over GF(256), all eight masks scored by the penalty rules in
// ISO/IEC 18004 — cut down to versions 1 to 10, which is everything a sixty
// character boarding pass will ever need.

export type QrMatrix = {
  size: number;
  /** [row][col]; true is a dark module. */
  modules: boolean[][];
  version: number;
};

// ── GF(256), primitive polynomial 0x11D ──────────────────────────────────────

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

const mul = (a: number, b: number) =>
  a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]];

/** The generator polynomial for `degree` error correction codewords. */
function generator(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= mul(poly[j], EXP[i]);
    }
    poly = next;
  }
  return poly;
}

function remainder(data: Uint8Array, degree: number): Uint8Array {
  const gen = generator(degree);
  const out = new Uint8Array(degree);
  for (const byte of data) {
    const factor = byte ^ out[0];
    out.copyWithin(0, 1);
    out[degree - 1] = 0;
    for (let i = 0; i < degree; i++) out[i] ^= mul(gen[i + 1], factor);
  }
  return out;
}

// ── Version tables, error correction level M ─────────────────────────────────

/** [ec codewords per block, [blocks, data codewords per block][] ] */
const ECC_M: Array<[number, Array<[number, number]>]> = [
  [10, [[1, 16]]],
  [16, [[1, 28]]],
  [26, [[1, 44]]],
  [18, [[2, 32]]],
  [24, [[2, 43]]],
  [16, [[4, 27]]],
  [18, [[4, 31]]],
  [22, [[2, 38], [2, 39]]],
  [22, [[3, 36], [2, 37]]],
  [26, [[4, 43], [1, 44]]],
];

const ALIGNMENT: number[][] = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

function dataCapacity(version: number): number {
  const [, blocks] = ECC_M[version - 1];
  return blocks.reduce((n, [count, size]) => n + count * size, 0);
}

// ── Bit stream ───────────────────────────────────────────────────────────────

class Bits {
  private bytes: number[] = [];
  private length = 0;
  push(value: number, width: number) {
    for (let i = width - 1; i >= 0; i--) {
      const bit = (value >>> i) & 1;
      if (this.length % 8 === 0) this.bytes.push(0);
      if (bit) this.bytes[this.bytes.length - 1] |= 0x80 >>> this.length % 8;
      this.length++;
    }
  }
  get bitLength() {
    return this.length;
  }
  toBytes() {
    return Uint8Array.from(this.bytes);
  }
}

function utf8(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function buildCodewords(data: Uint8Array, version: number): Uint8Array {
  const capacity = dataCapacity(version) * 8;
  const countBits = version < 10 ? 8 : 16;
  const bits = new Bits();
  bits.push(0b0100, 4); // byte mode
  bits.push(data.length, countBits);
  for (const b of data) bits.push(b, 8);
  bits.push(0, Math.min(4, capacity - bits.bitLength)); // terminator
  if (bits.bitLength % 8) bits.push(0, 8 - (bits.bitLength % 8));

  const out = new Uint8Array(dataCapacity(version));
  out.set(bits.toBytes());
  for (let i = bits.bitLength / 8, pad = 0; i < out.length; i++, pad++) {
    out[i] = pad % 2 === 0 ? 0xec : 0x11;
  }
  return out;
}

/** Split into blocks, add error correction, interleave — in that order. */
function interleave(data: Uint8Array, version: number): Uint8Array {
  const [ecLen, groups] = ECC_M[version - 1];
  const blocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  let offset = 0;
  for (const [count, size] of groups) {
    for (let i = 0; i < count; i++) {
      const block = data.slice(offset, offset + size);
      offset += size;
      blocks.push(block);
      ecBlocks.push(remainder(block, ecLen));
    }
  }
  const maxData = Math.max(...blocks.map((b) => b.length));
  const out: number[] = [];
  for (let i = 0; i < maxData; i++) {
    for (const b of blocks) if (i < b.length) out.push(b[i]);
  }
  for (let i = 0; i < ecLen; i++) {
    for (const b of ecBlocks) out.push(b[i]);
  }
  return Uint8Array.from(out);
}

// ── Matrix ───────────────────────────────────────────────────────────────────

function bch(value: number, generatorPoly: number, width: number): number {
  let rest = value << width;
  const genBits = 32 - Math.clz32(generatorPoly);
  while (32 - Math.clz32(rest) >= genBits) {
    rest ^= generatorPoly << (32 - Math.clz32(rest) - genBits);
  }
  return (value << width) | rest;
}

function blank(size: number) {
  return Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
}

function drawFunctionPatterns(
  modules: boolean[][],
  reserved: boolean[][],
  version: number,
) {
  const size = modules.length;
  const set = (r: number, c: number, dark: boolean) => {
    modules[r][c] = dark;
    reserved[r][c] = true;
  };

  // Finders, with their separators.
  for (const [r0, c0] of [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ]) {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = r0 + dr;
        const c = c0 + dc;
        if (r < 0 || c < 0 || r >= size || c >= size) continue;
        const ring = Math.max(Math.abs(dr - 3), Math.abs(dc - 3));
        set(r, c, ring !== 2 && ring <= 3);
      }
    }
  }

  // Timing.
  for (let i = 8; i < size - 8; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }

  // Alignment, everywhere the finders are not.
  const centers = ALIGNMENT[version - 1];
  for (const r0 of centers) {
    for (const c0 of centers) {
      const nearFinder =
        (r0 === 6 && c0 === 6) ||
        (r0 === 6 && c0 === size - 7) ||
        (r0 === size - 7 && c0 === 6);
      if (nearFinder) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          set(r0 + dr, c0 + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
        }
      }
    }
  }

  // Reserve the format areas, and the one module that is always dark.
  for (let i = 0; i < 9; i++) {
    if (!reserved[8][i]) set(8, i, false);
    if (!reserved[i][8]) set(i, 8, false);
  }
  for (let i = 0; i < 8; i++) {
    if (!reserved[8][size - 1 - i]) set(8, size - 1 - i, false);
    if (!reserved[size - 1 - i][8]) set(size - 1 - i, 8, false);
  }
  set(size - 8, 8, true);

  // Version information, from version 7 up.
  if (version >= 7) {
    const bits = bch(version, 0b1111100100101, 12);
    for (let i = 0; i < 18; i++) {
      const bit = ((bits >>> i) & 1) === 1;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      set(b, a, bit);
      set(a, b, bit);
    }
  }
}

function drawFormat(modules: boolean[][], mask: number) {
  const size = modules.length;
  // Level M is 0b00; the mask follows it, and the whole thing is scrambled so
  // that a blank format area is not a legal one.
  const bits = bch(0b00 << 3 | mask, 0b10100110111, 10) ^ 0b101010000010010;
  const bit = (i: number) => ((bits >>> i) & 1) === 1;
  for (let i = 0; i <= 5; i++) modules[i][8] = bit(i);
  modules[7][8] = bit(6);
  modules[8][8] = bit(7);
  modules[8][7] = bit(8);
  for (let i = 9; i < 15; i++) modules[8][14 - i] = bit(i);
  for (let i = 0; i < 8; i++) modules[8][size - 1 - i] = bit(i);
  for (let i = 8; i < 15; i++) modules[size - 15 + i][8] = bit(i);
}

function drawCodewords(
  modules: boolean[][],
  reserved: boolean[][],
  codewords: Uint8Array,
) {
  const size = modules.length;
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        const upward = ((right + 1) & 2) === 0;
        const r = upward ? size - 1 - vert : vert;
        if (reserved[r][c] || i >= codewords.length * 8) continue;
        modules[r][c] = ((codewords[i >>> 3] >>> (7 - (i & 7))) & 1) === 1;
        i++;
      }
    }
  }
}

const MASKS: Array<(r: number, c: number) => boolean> = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

/** The four penalty rules. Lower is better; the best mask is the one that wins. */
function penalty(modules: boolean[][]): number {
  const size = modules.length;
  let score = 0;

  const runs = (get: (a: number, b: number) => boolean) => {
    for (let a = 0; a < size; a++) {
      let run = 1;
      for (let b = 1; b < size; b++) {
        if (get(a, b) === get(a, b - 1)) {
          run++;
          if (run === 5) score += 3;
          else if (run > 5) score += 1;
        } else run = 1;
      }
    }
  };
  runs((r, c) => modules[r][c]);
  runs((c, r) => modules[r][c]);

  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = modules[r][c];
      if (v === modules[r][c + 1] && v === modules[r + 1][c] && v === modules[r + 1][c + 1])
        score += 3;
    }
  }

  // The finder-like sequence, in both directions, either way round.
  const FINDER = [true, false, true, true, true, false, true];
  const matches = (line: boolean[], at: number, pattern: boolean[]) =>
    pattern.every((p, k) => line[at + k] === p);
  const lines: boolean[][] = [];
  for (let r = 0; r < size; r++) lines.push(modules[r]);
  for (let c = 0; c < size; c++) lines.push(modules.map((row) => row[c]));
  for (const line of lines) {
    for (let i = 0; i + 10 < size; i++) {
      const light4 = [false, false, false, false];
      if (matches(line, i, [...FINDER, ...light4])) score += 40;
      if (matches(line, i, [...light4, ...FINDER])) score += 40;
    }
  }

  let dark = 0;
  for (const row of modules) for (const v of row) if (v) dark++;
  const ratio = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(ratio - 50) / 5) * 10;
  return score;
}

/**
 * Encode `text` as a QR code at error correction level M — the level airlines
 * use for a pass that will be read off a scratched phone screen.
 */
export function encodeQr(text: string): QrMatrix {
  const data = utf8(text);
  let version = 0;
  for (let v = 1; v <= 10; v++) {
    const countBits = v < 10 ? 8 : 16;
    if (dataCapacity(v) * 8 >= 4 + countBits + data.length * 8) {
      version = v;
      break;
    }
  }
  if (!version) throw new Error(`QR: ${data.length} bytes is past version 10`);

  const codewords = interleave(buildCodewords(data, version), version);
  const size = version * 4 + 17;
  const reserved = blank(size);
  const base = blank(size);
  drawFunctionPatterns(base, reserved, version);
  drawCodewords(base, reserved, codewords);
  // The remainder bits versions 2 to 6 carry after the last codeword are
  // already false, which is what the spec asks them to be.

  let best: boolean[][] | null = null;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    const candidate = base.map((row) => row.slice());
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!reserved[r][c] && MASKS[mask](r, c)) candidate[r][c] = !candidate[r][c];
      }
    }
    drawFormat(candidate, mask);
    const score = penalty(candidate);
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return { size, modules: best!, version };
}

/**
 * The matrix as one SVG path. One path rather than a thousand rects: at the
 * size a boarding pass draws this, the rects are the slowest thing on the
 * screen and they hairline against each other when the glass is scaled.
 */
export function qrPath(m: QrMatrix): string {
  const parts: string[] = [];
  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) {
      if (m.modules[r][c]) parts.push(`M${c} ${r}h1v1h-1z`);
    }
  }
  return parts.join("");
}
