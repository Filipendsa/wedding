// Pure TypeScript QR Code matrix generator (Versions 1-9, Byte Mode, ECC Level L)
// Used for rendering real scannable QR Codes for PIX BR Code payloads and Photo Booth links.

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function buildRsGenerator(ecCount: number): number[] {
  let poly = [1];
  for (let i = 0; i < ecCount; i++) {
    const next = new Array(poly.length + 1).fill(0);
    const factor = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], factor);
    }
    poly = next;
  }
  return poly;
}

function computeRsEcc(data: number[], ecCount: number): number[] {
  const gen = buildRsGenerator(ecCount);
  const res = [...data, ...new Array(ecCount).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const coef = res[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        res[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return res.slice(data.length);
}

interface VersionSpec {
  version: number;
  size: number;
  totalDataBytes: number;
  ecPerBlock: number;
  blocks: number;
  align: number[];
}

// Level L specs for versions 1..9 (supports up to 230 bytes)
const VERSION_SPECS: VersionSpec[] = [
  { version: 1, size: 21, totalDataBytes: 19, ecPerBlock: 7, blocks: 1, align: [] },
  { version: 2, size: 25, totalDataBytes: 34, ecPerBlock: 10, blocks: 1, align: [6, 18] },
  { version: 3, size: 29, totalDataBytes: 55, ecPerBlock: 15, blocks: 1, align: [6, 22] },
  { version: 4, size: 33, totalDataBytes: 80, ecPerBlock: 20, blocks: 1, align: [6, 26] },
  { version: 5, size: 37, totalDataBytes: 108, ecPerBlock: 26, blocks: 1, align: [6, 30] },
  { version: 6, size: 41, totalDataBytes: 136, ecPerBlock: 18, blocks: 2, align: [6, 34] },
  { version: 7, size: 45, totalDataBytes: 156, ecPerBlock: 20, blocks: 2, align: [6, 22, 38] },
  { version: 8, size: 49, totalDataBytes: 194, ecPerBlock: 24, blocks: 2, align: [6, 24, 42] },
  { version: 9, size: 53, totalDataBytes: 232, ecPerBlock: 30, blocks: 2, align: [6, 26, 46] },
];

export function generateQrMatrix(text: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text));
  const spec =
    VERSION_SPECS.find((s) => bytes.length + 2 <= s.totalDataBytes) ??
    VERSION_SPECS[VERSION_SPECS.length - 1];

  const maxPayload = spec.totalDataBytes - 2;
  const payload = bytes.slice(0, maxPayload);

  // Build bit stream: Mode 0100 (4 bits) + Length (8 bits) + Payload + Terminator
  const bits: number[] = [];
  const pushBits = (val: number, count: number) => {
    for (let i = count - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  };

  pushBits(0b0100, 4);
  pushBits(payload.length, 8);
  for (const b of payload) {
    pushBits(b, 8);
  }
  const totalBits = spec.totalDataBytes * 8;
  for (let i = 0; i < 4 && bits.length < totalBits; i++) {
    bits.push(0);
  }
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bits[i + j];
    }
    dataBytes.push(byte);
  }

  let padToggle = 0;
  while (dataBytes.length < spec.totalDataBytes) {
    dataBytes.push(padToggle % 2 === 0 ? 0xec : 0x11);
    padToggle++;
  }

  // Split into blocks & compute ECC
  const blockSize = Math.floor(spec.totalDataBytes / spec.blocks);
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];
  for (let b = 0; b < spec.blocks; b++) {
    const start = b * blockSize;
    const end = b === spec.blocks - 1 ? dataBytes.length : start + blockSize;
    const block = dataBytes.slice(start, end);
    dataBlocks.push(block);
    ecBlocks.push(computeRsEcc(block, spec.ecPerBlock));
  }

  const finalCodewords: number[] = [];
  const maxDataLen = Math.max(...dataBlocks.map((b) => b.length));
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) finalCodewords.push(block[i]);
    }
  }
  for (let i = 0; i < spec.ecPerBlock; i++) {
    for (const block of ecBlocks) {
      if (i < block.length) finalCodewords.push(block[i]);
    }
  }

  const allBits: number[] = [];
  for (const cw of finalCodewords) {
    for (let i = 7; i >= 0; i--) {
      allBits.push((cw >> i) & 1);
    }
  }

  const size = spec.size;
  const grid: (boolean | null)[][] = Array.from({ length: size }, () =>
    Array<boolean | null>(size).fill(null)
  );
  const isReserved: boolean[][] = Array.from({ length: size }, () =>
    Array<boolean>(size).fill(false)
  );

  const setModule = (r: number, c: number, dark: boolean, reserve = true) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    grid[r][c] = dark;
    if (reserve) isReserved[r][c] = true;
  };

  const placeFinder = (top: number, left: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = top + r;
        const cc = left + c;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const inBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const inCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        const inOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        setModule(rr, cc, inOuter && (inBorder || inCenter));
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Alignment patterns
  for (const r of spec.align) {
    for (const c of spec.align) {
      if (isReserved[r][c]) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const dark = Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0);
          setModule(r + dr, c + dc, dark);
        }
      }
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (!isReserved[6][i]) setModule(6, i, i % 2 === 0);
    if (!isReserved[i][6]) setModule(i, 6, i % 2 === 0);
  }

  // Dark module
  setModule(size - 8, 8, true);

  // Reserve format info
  for (let i = 0; i < 9; i++) {
    if (!isReserved[8][i]) isReserved[8][i] = true;
    if (!isReserved[i][8]) isReserved[i][8] = true;
  }
  for (let i = 0; i < 8; i++) {
    isReserved[8][size - 1 - i] = true;
    isReserved[size - 1 - i][8] = true;
  }

  // Reserve version info for >= 7
  if (spec.version >= 7) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        isReserved[i][size - 11 + j] = true;
        isReserved[size - 11 + j][i] = true;
      }
    }
  }

  // Place data bits with mask 0: (r + c) % 2 === 0
  let bitIdx = 0;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let step = 0; step < size; step++) {
      const row = upward ? size - 1 - step : step;
      for (let dx = 0; dx < 2; dx++) {
        const c = col - dx;
        if (isReserved[row][c]) continue;
        const bit = bitIdx < allBits.length ? allBits[bitIdx++] === 1 : false;
        const masked = (row + c) % 2 === 0 ? !bit : bit;
        grid[row][c] = masked;
      }
    }
    upward = !upward;
  }

  // Format information for EC Level L (01) + Mask 0 (000) -> 01000 -> BCH = 111011111000100
  const formatBits = 0b111011111000100;
  const formatCoords1: [number, number][] = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  const formatCoords2: [number, number][] = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8],
    [size - 5, 8], [size - 6, 8], [size - 7, 8],
    [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5],
    [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1],
  ];

  for (let i = 0; i < 15; i++) {
    const dark = ((formatBits >> (14 - i)) & 1) === 1;
    const [r1, c1] = formatCoords1[i];
    const [r2, c2] = formatCoords2[i];
    grid[r1][c1] = dark;
    grid[r2][c2] = dark;
  }

  // Version info for >= 7 (versions 7, 8, 9)
  const VERSION_BITS: Record<number, number> = {
    7: 0x07c94,
    8: 0x085bc,
    9: 0x09a99,
  };
  if (spec.version >= 7 && VERSION_BITS[spec.version]) {
    const vBits = VERSION_BITS[spec.version];
    for (let i = 0; i < 18; i++) {
      const dark = ((vBits >> i) & 1) === 1;
      const r = Math.floor(i / 3);
      const c = size - 11 + (i % 3);
      grid[r][c] = dark;
      grid[c][r] = dark;
    }
  }

  return grid.map((row) => row.map((cell) => Boolean(cell)));
}
