// Static canvas-drawn artwork for the 3D lab: instrument front panels,
// the office sign, PC monitor screens and the wall display board.
// Anything that animates lives in screens.ts instead.

export const cssFont = (variable: string, fallback: string) => {
  const v = typeof document === 'undefined' ? '' : getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v || fallback;
};

export function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return { canvas: c, ctx: c.getContext('2d')! };
}

// ─── 7-segment digits ─────────────────────────────────────────
// segments: a top, b top-right, c bottom-right, d bottom, e bottom-left,
// f top-left, g middle
const SEGMENTS: Record<string, string> = {
  '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd',
  '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', '-': 'g', ' ': '',
};

/** Draws `text` (digits, '-', ' ', '.') as 7-segment digits. Returns width. */
export function drawSevenSeg(
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number, h: number,
  on: string, off?: string,
) {
  const w = h * 0.52, t = h * 0.12, gap = h * 0.18, skew = h * 0.08;
  let cx = x;
  const seg = (name: string, lit: boolean) => {
    if (!lit && !off) return;
    ctx.fillStyle = lit ? on : off!;
    const hh = h / 2;
    const rects: Record<string, [number, number, number, number]> = {
      a: [t * 0.6, 0, w - t * 1.2, t],
      d: [t * 0.6, h - t, w - t * 1.2, t],
      g: [t * 0.6, hh - t / 2, w - t * 1.2, t],
      f: [0, t * 0.6, t, hh - t * 1.0],
      b: [w - t, t * 0.6, t, hh - t * 1.0],
      e: [0, hh + t * 0.4, t, hh - t * 1.0],
      c: [w - t, hh + t * 0.4, t, hh - t * 1.0],
    };
    const [rx, ry, rw, rh] = rects[name];
    // slight italic slant like a real LCD
    const sl = (yy: number) => skew * (1 - yy / h);
    ctx.beginPath();
    ctx.moveTo(cx + rx + sl(ry), y + ry);
    ctx.lineTo(cx + rx + rw + sl(ry), y + ry);
    ctx.lineTo(cx + rx + rw + sl(ry + rh), y + ry + rh);
    ctx.lineTo(cx + rx + sl(ry + rh), y + ry + rh);
    ctx.closePath();
    ctx.fill();
  };
  for (const ch of text) {
    if (ch === '.') {
      ctx.fillStyle = on;
      ctx.fillRect(cx - gap * 0.75, y + h - t, t, t);
      continue;
    }
    const lit = SEGMENTS[ch] ?? '';
    for (const s of 'abcdefg') seg(s, lit.includes(s));
    cx += w + gap;
  }
  return cx - x;
}

// ─── Oscilloscope front panel ─────────────────────────────────
// Knob layout in panel coordinates (u: 0 left → 1 right, v: 0 top → 1
// bottom). The 3D model reads the same table to place the real knobs.
export interface PanelKnob { u: number; v: number; r: number; label: string; kind: 'big' | 'mid' | 'small' | 'bnc' | 'button' }
export const SCOPE_KNOBS: PanelKnob[] = [
  { u: 0.49, v: 0.14, r: 0.0065, label: 'INTENSITY', kind: 'small' },
  { u: 0.56, v: 0.14, r: 0.0065, label: 'FOCUS', kind: 'small' },
  { u: 0.635, v: 0.14, r: 0.0055, label: 'TRACE ROT', kind: 'small' },
  { u: 0.505, v: 0.47, r: 0.015, label: 'CH 1  VOLTS/DIV', kind: 'big' },
  { u: 0.665, v: 0.47, r: 0.015, label: 'CH 2  VOLTS/DIV', kind: 'big' },
  { u: 0.505, v: 0.76, r: 0.0075, label: 'POSITION', kind: 'mid' },
  { u: 0.665, v: 0.76, r: 0.0075, label: 'POSITION', kind: 'mid' },
  { u: 0.835, v: 0.4, r: 0.019, label: 'SEC/DIV', kind: 'big' },
  { u: 0.835, v: 0.76, r: 0.0075, label: 'HOLDOFF', kind: 'mid' },
  { u: 0.945, v: 0.62, r: 0.0085, label: 'LEVEL', kind: 'mid' },
  { u: 0.945, v: 0.14, r: 0.0055, label: 'POWER', kind: 'button' },
  { u: 0.47, v: 0.925, r: 0.0065, label: 'CH 1', kind: 'bnc' },
  { u: 0.63, v: 0.925, r: 0.0065, label: 'CH 2', kind: 'bnc' },
  { u: 0.9, v: 0.925, r: 0.0065, label: 'EXT TRIG', kind: 'bnc' },
];
export const SCOPE_SCREEN = { u0: 0.04, u1: 0.4, v0: 0.08, v1: 0.82 };

export function scopePanelTexture(panelW: number) {
  const W = 1400, H = Math.round(W * (0.17 / 0.37));
  const { canvas, ctx } = makeCanvas(W, H);
  const font = cssFont('--font-inter', 'Arial');
  // panel paint
  ctx.fillStyle = '#c9cec9';
  ctx.fillRect(0, 0, W, H);
  // subtle brushed texture
  for (let i = 0; i < 2200; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.03})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 40, 1);
  }
  // blue-grey control sections
  ctx.fillStyle = '#3d5878';
  const sec = (u0: number, v0: number, u1: number, v1: number) => {
    ctx.beginPath();
    ctx.roundRect(u0 * W, v0 * H, (u1 - u0) * W, (v1 - v0) * H, 10);
    ctx.fill();
  };
  sec(0.44, 0.27, 0.735, 0.88);   // vertical
  sec(0.75, 0.2, 0.99, 0.88);     // horizontal / trigger
  // CRT bezel
  ctx.fillStyle = '#17191c';
  ctx.beginPath();
  ctx.roundRect(SCOPE_SCREEN.u0 * W - 14, SCOPE_SCREEN.v0 * H - 14, (SCOPE_SCREEN.u1 - SCOPE_SCREEN.u0) * W + 28, (SCOPE_SCREEN.v1 - SCOPE_SCREEN.v0) * H + 28, 18);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const px = (m: number) => (m / panelW) * W; // meters → canvas px

  // section titles
  ctx.fillStyle = '#e8ecef';
  ctx.font = `600 18px ${font}`;
  ctx.fillText('VERTICAL', 0.5875 * W, 0.305 * H);
  ctx.fillText('HORIZONTAL', 0.835 * W, 0.235 * H);
  ctx.fillText('TRIGGER', 0.945 * W, 0.47 * H);

  for (const k of SCOPE_KNOBS) {
    const cx = k.u * W, cy = k.v * H, r = px(k.r);
    const onDark = k.v > 0.27 && k.v < 0.88 && k.u > 0.44;
    const ink = onDark ? '#eef1f4' : '#22272c';
    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    // tick ring around rotary knobs
    if (k.kind === 'big' || k.kind === 'mid') {
      const ticks = k.kind === 'big' ? 11 : 0;
      ctx.lineWidth = 2;
      for (let i = 0; i < ticks; i++) {
        const a = Math.PI * 0.75 + (i / (ticks - 1)) * Math.PI * 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * (r * 1.25), cy + Math.sin(a) * (r * 1.25));
        ctx.lineTo(cx + Math.cos(a) * (r * 1.42), cy + Math.sin(a) * (r * 1.42));
        ctx.stroke();
      }
      if (k.kind === 'big') {
        ctx.font = `500 11px ${font}`;
        const vals = k.label.includes('SEC') ? ['.5s', '50m', '5m', '.5m', '50µ', '5µ', '.5µ'] : ['5', '2', '.5', '.2', '50', '20', '5'];
        vals.forEach((t, i) => {
          const a = Math.PI * 0.75 + (i / (vals.length - 1)) * Math.PI * 1.5;
          ctx.fillText(t, cx + Math.cos(a) * r * 1.7, cy + Math.sin(a) * r * 1.7);
        });
      }
    }
    if (k.kind === 'bnc') {
      ctx.fillStyle = '#22272c';
      ctx.beginPath(); ctx.arc(cx, cy, r * 1.9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = ink;
    }
    ctx.font = `600 ${k.kind === 'big' ? 15 : 12}px ${font}`;
    const ly = k.kind === 'big' ? cy - r * 2.05 : k.kind === 'bnc' ? cy - r * 2.6 : cy + r * 1.9 + 9;
    ctx.fillText(k.label, cx, ly);
  }

  // toggle buttons row
  ctx.fillStyle = '#e8ecef';
  ctx.font = `500 11px ${font}`;
  ['CH1', 'CH2', 'BOTH', 'ADD'].forEach((t, i) => {
    const x = (0.47 + i * 0.065) * W, y = 0.62 * H;
    ctx.fillStyle = '#1d2733';
    ctx.fillRect(x - 18, y - 9, 36, 18);
    ctx.fillStyle = '#e8ecef';
    ctx.fillText(t, x, y + 18);
  });

  // model name under the screen
  ctx.fillStyle = '#22272c';
  ctx.textAlign = 'left';
  ctx.font = `700 22px ${font}`;
  ctx.fillText('GARAGE', SCOPE_SCREEN.u0 * W, 0.925 * H);
  ctx.font = `500 16px ${font}`;
  ctx.fillText('100 MHz OSCILLOSCOPE  ·  2235', SCOPE_SCREEN.u0 * W + 110, 0.925 * H);
  return canvas;
}

// ─── Multimeter face ──────────────────────────────────────────
export const METER_DIAL = { u: 0.5, v: 0.6, r: 0.27 };   // r relative to width
export const METER_LCD = { u0: 0.12, u1: 0.88, v0: 0.07, v1: 0.27 };
export const METER_JACKS = [
  { u: 0.2, label: '10A', color: '#c2241f' },
  { u: 0.5, label: 'COM', color: '#141416' },
  { u: 0.8, label: 'VΩmA', color: '#c2241f' },
];
export const METER_JACK_V = 0.9;

export function meterFaceTexture() {
  const W = 480, H = 1020;
  const { canvas, ctx } = makeCanvas(W, H);
  const font = cssFont('--font-inter', 'Arial');
  ctx.fillStyle = '#34373c';
  ctx.fillRect(0, 0, W, H);
  // LCD window frame
  ctx.fillStyle = '#16181b';
  ctx.beginPath();
  ctx.roundRect(METER_LCD.u0 * W - 14, METER_LCD.v0 * H - 14, (METER_LCD.u1 - METER_LCD.u0) * W + 28, (METER_LCD.v1 - METER_LCD.v0) * H + 28, 16);
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0b915';
  ctx.font = `800 26px ${font}`;
  ctx.fillText('DIGITAL MULTIMETER', W / 2, 0.325 * H);
  ctx.fillStyle = '#d7dade';
  ctx.font = `500 15px ${font}`;
  ctx.fillText('TRUE RMS  ·  AUTO RANGE', W / 2, 0.355 * H);

  // dial ring + ranges
  const cx = METER_DIAL.u * W, cy = METER_DIAL.v * H, r = METER_DIAL.r * W;
  ctx.strokeStyle = '#8b9096';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2); ctx.stroke();
  const ranges: [string, string][] = [
    ['OFF', '#ffffff'], ['V~', '#ffffff'], ['V⎓', '#ffffff'], ['mV', '#ffffff'], ['Ω', '#ffffff'],
    ['•))', '#ffffff'], ['→|', '#ffffff'], ['Hz', '#ffffff'], ['µA', '#f0b915'], ['mA', '#f0b915'], ['A', '#f0b915'],
  ];
  ranges.forEach(([t, c], i) => {
    const a = -Math.PI / 2 - Math.PI * 0.85 + (i / (ranges.length - 1)) * Math.PI * 1.7;
    ctx.fillStyle = c;
    ctx.font = `700 ${t.length > 2 ? 22 : 28}px ${font}`;
    ctx.fillText(t, cx + Math.cos(a) * r * 1.42, cy + Math.sin(a) * r * 1.42);
    ctx.strokeStyle = '#c8ccd1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r * 1.14, cy + Math.sin(a) * r * 1.14);
    ctx.lineTo(cx + Math.cos(a) * r * 1.24, cy + Math.sin(a) * r * 1.24);
    ctx.stroke();
  });
  // buttons
  ['HOLD', 'RANGE', 'MAX', 'REL'].forEach((t, i) => {
    const x = (0.17 + i * 0.22) * W, y = 0.405 * H;
    ctx.fillStyle = i === 0 ? '#f0b915' : '#5a5f66';
    ctx.beginPath(); ctx.roundRect(x - 40, y - 15, 80, 30, 8); ctx.fill();
    ctx.fillStyle = i === 0 ? '#1b1d20' : '#e8eaee';
    ctx.font = `700 15px ${font}`;
    ctx.fillText(t, x, y + 1);
  });
  // jacks
  for (const j of METER_JACKS) {
    const x = j.u * W, y = METER_JACK_V * H;
    ctx.fillStyle = '#d7dade';
    ctx.font = `700 19px ${font}`;
    ctx.fillText(j.label, x, y - 62);
    ctx.fillStyle = j.color === '#141416' ? '#53575d' : j.color;
    ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#9aa0a6';
  ctx.font = `500 13px ${font}`;
  ctx.fillText('CAT III 600V', W / 2, 0.965 * H);
  return canvas;
}

// ─── Office sign ──────────────────────────────────────────────
export function officeSignTexture() {
  const W = 1024, H = 512;
  const { canvas, ctx } = makeCanvas(W, H);
  const font = cssFont('--font-inter', 'Arial');
  ctx.fillStyle = '#00629b';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 8;
  ctx.strokeRect(22, 22, W - 44, H - 44);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 170px ${font}`;
  ctx.fillText('IEEE SJSU', W / 2, H * 0.42);
  ctx.font = `600 52px ${font}`;
  ctx.fillText('STUDENT BRANCH OFFICE', W / 2, H * 0.74);
  return canvas;
}

// ─── PC monitor screens ───────────────────────────────────────
export function monitorTexture(kind: 'code' | 'pcb' | 'wave') {
  const W = 512, H = 288;
  const { canvas, ctx } = makeCanvas(W, H);
  if (kind === 'code') {
    ctx.fillStyle = '#1b1e24';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#272b33';
    ctx.fillRect(0, 0, 90, H);
    const cols = ['#c792ea', '#82aaff', '#c3e88d', '#f78c6c', '#89ddff', '#d6deeb'];
    for (let i = 0; i < 20; i++) {
      let x = 104 + (i % 5 === 0 ? 0 : 18 * ((i % 3) + 1));
      const y = 12 + i * 13.5;
      const parts = 2 + Math.floor(Math.random() * 4);
      for (let p = 0; p < parts; p++) {
        const w = 20 + Math.random() * 70;
        ctx.fillStyle = cols[Math.floor(Math.random() * cols.length)];
        ctx.fillRect(x, y, w, 6);
        x += w + 8;
      }
    }
  } else if (kind === 'pcb') {
    ctx.fillStyle = '#0d0f12';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#16351f';
    ctx.fillRect(60, 30, 390, 230);
    ctx.lineWidth = 3;
    for (let i = 0; i < 24; i++) {
      ctx.strokeStyle = i % 3 ? '#c8433a' : '#3a73c8';
      ctx.beginPath();
      let x = 70 + Math.random() * 370, y = 40 + Math.random() * 210;
      ctx.moveTo(x, y);
      for (let s = 0; s < 3; s++) {
        if (s % 2) x = 70 + Math.random() * 370; else y = 40 + Math.random() * 210;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.fillStyle = '#d4a64a';
    for (let i = 0; i < 40; i++) ctx.fillRect(70 + Math.random() * 370, 40 + Math.random() * 210, 6, 6);
    ctx.fillStyle = '#2a2f37';
    ctx.fillRect(0, 0, W, 18);
  } else {
    ctx.fillStyle = '#0f1420';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#25324a';
    for (let i = 1; i < 10; i++) { ctx.beginPath(); ctx.moveTo(i * W / 10, 0); ctx.lineTo(i * W / 10, H); ctx.stroke(); }
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 4) ctx.lineTo(x, H / 2 + Math.sin(x / 22) * 50 * Math.sin(x / 140));
    ctx.stroke();
  }
  return canvas;
}
