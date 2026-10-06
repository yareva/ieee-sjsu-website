import { drawSevenSeg } from './textures';

// Canvas-drawn screens for the 3D lab: the terminal's boot + welcome
// screen, the oscilloscope trace and the multimeter's LCD. Each is drawn
// into a <canvas> that the scene uses as a texture.

const cssFont = (variable: string, fallback: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v || fallback;
};

// ─── Terminal ─────────────────────────────────────────────────

const BOOT_LINES = [
  'IEEE-SJSU BIOS v1.976   (C) INNOVATION GARAGE',
  'CPU ............ 6502 @ 1.02 MHZ        OK',
  'MEMORY TEST .... 640K                   OK',
  'MOUNTING ENGR 376 ...                   OK',
  'LOADING GARAGE.SYS',
];
const CHARS_PER_SEC = 70;
const LINE_PAUSE = 0.18;

// when each boot line starts / the welcome screen appears (seconds after
// power-on)
const BOOT_START = 1.0;
const lineStarts: number[] = [];
{
  let t = BOOT_START;
  for (const line of BOOT_LINES) {
    lineStarts.push(t);
    t += line.length / CHARS_PER_SEC + LINE_PAUSE;
  }
  lineStarts.push(t); // progress bar
}
const BAR_START = lineStarts[BOOT_LINES.length];
const BAR_TIME = 0.9;
export const WELCOME_AT = BAR_START + BAR_TIME + 0.35;

export class TerminalScreen {
  readonly canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;
  private pixel: string;
  private mono: string;
  readonly W = 640;
  readonly H = 480;

  constructor() {
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.ctx = this.canvas.getContext('2d')!;
    this.pixel = cssFont('--font-pixel', 'monospace');
    this.mono = cssFont('--font-vt323', 'monospace');
  }

  /** t = seconds since the terminal was switched on (negative = still off) */
  draw(t: number) {
    const { ctx, W, H } = this;
    ctx.save();
    ctx.fillStyle = '#030805';
    ctx.fillRect(0, 0, W, H);

    if (t < 0.45) {
      // off: dark glass
      ctx.fillStyle = '#0a0f0c';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      this.overlay(0);
      return;
    }

    if (t < 0.95) {
      // CRT power-on: a bright line that opens up to fill the screen
      const k = (t - 0.45) / 0.5;
      const h = Math.max(3, H * Math.pow(k, 3));
      const w = W * Math.min(1, k * 3);
      ctx.fillStyle = `rgba(190, 255, 210, ${1 - k * 0.6})`;
      ctx.shadowColor = '#7dffa8';
      ctx.shadowBlur = 30;
      ctx.fillRect((W - w) / 2, (H - h) / 2, w, h);
      ctx.restore();
      this.overlay(1);
      return;
    }

    const green = '#3dff7e';
    ctx.fillStyle = green;
    ctx.shadowColor = green;
    ctx.shadowBlur = 10;
    ctx.textBaseline = 'top';

    if (t < WELCOME_AT) {
      ctx.font = `28px ${this.mono}`;
      BOOT_LINES.forEach((line, i) => {
        const start = lineStarts[i];
        if (t < start) return;
        const n = Math.floor((t - start) * CHARS_PER_SEC);
        ctx.fillText(line.slice(0, n), 34, 36 + i * 34);
      });
      if (t >= BAR_START) {
        const k = Math.min(1, (t - BAR_START) / BAR_TIME);
        const blocks = 24;
        const filled = Math.floor(k * blocks);
        ctx.fillText(`[${'█'.repeat(filled)}${' '.repeat(blocks - filled)}] ${Math.round(k * 100)}%`, 34, 36 + BOOT_LINES.length * 34 + 10);
      }
      // cursor
      if (Math.floor(t * 3) % 2 === 0) ctx.fillRect(34, H - 70, 16, 26);
    } else {
      // welcome screen, flickers in
      const since = t - WELCOME_AT;
      const flicker = since < 0.35 ? (Math.random() > 0.4 ? 1 : 0.25) : 1;
      ctx.globalAlpha = flicker;
      ctx.textAlign = 'center';

      ctx.font = `28px ${this.pixel}`;
      ctx.fillText('WELCOME TO', W / 2, 52);
      ctx.font = `56px ${this.pixel}`;
      ctx.shadowBlur = 20;
      ctx.fillText('INNOVATION', W / 2, 106);
      ctx.fillText('GARAGE', W / 2, 180);
      ctx.shadowBlur = 10;

      ctx.fillRect(W / 2 - 270, 266, 540, 5);

      ctx.font = `40px ${this.mono}`;
      ctx.textAlign = 'left';
      const prompt = '> IEEE SJSU STUDENT BRANCH';
      const pw = ctx.measureText(prompt).width;
      const px = W / 2 - pw / 2 - 10;
      ctx.fillText(prompt, px, 292);
      if (Math.floor(t * 2.2) % 2 === 0) ctx.fillRect(px + pw + 8, 296, 18, 32);

      ctx.textAlign = 'center';
      ctx.globalAlpha = flicker * 0.8;
      const place = 'ENGR 376 · SAN JOSÉ STATE UNIVERSITY';
      let size = 36;
      do { ctx.font = `${size}px ${this.mono}`; } while (ctx.measureText(place).width > W - 50 && --size > 20);
      ctx.fillText(place, W / 2, 356);
    }
    ctx.restore();
    this.overlay(1);
  }

  // scanlines + vignette, like a real tube
  private overlay(power: number) {
    const { ctx, W, H } = this;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.78);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${0.55 + 0.25 * (1 - power)})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}

// ─── Oscilloscope ─────────────────────────────────────────────

// one heartbeat, as y offsets (0 = baseline), sampled across one period —
// a nod to the club's ECG wearable
function ecg(x: number) {
  const p = x % 1;
  const bump = (c: number, w: number, a: number) => a * Math.exp(-Math.pow((p - c) / w, 2));
  return bump(0.18, 0.035, 0.12) - bump(0.36, 0.012, 0.12) + bump(0.4, 0.013, 1) - bump(0.44, 0.014, 0.28) + bump(0.66, 0.06, 0.24);
}

export class ScopeScreen {
  readonly canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;
  readonly W = 400;
  readonly H = 320;

  constructor() {
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.ctx = this.canvas.getContext('2d')!;
  }

  draw(t: number) {
    const { ctx, W, H } = this;
    ctx.save();
    ctx.fillStyle = '#04120b';
    ctx.fillRect(0, 0, W, H);

    // graticule: 10 × 8 divisions with minor ticks on the center lines
    ctx.strokeStyle = 'rgba(120, 200, 160, 0.28)';
    ctx.lineWidth = 1;
    const dx = W / 10, dy = H / 8;
    ctx.beginPath();
    for (let i = 1; i < 10; i++) { ctx.moveTo(i * dx, 0); ctx.lineTo(i * dx, H); }
    for (let j = 1; j < 8; j++) { ctx.moveTo(0, j * dy); ctx.lineTo(W, j * dy); }
    for (let i = 0; i < 50; i++) { const x = (i * W) / 50; ctx.moveTo(x, H / 2 - 4); ctx.lineTo(x, H / 2 + 4); }
    for (let j = 0; j < 40; j++) { const y = (j * H) / 40; ctx.moveTo(W / 2 - 4, y); ctx.lineTo(W / 2 + 4, y); }
    ctx.stroke();

    ctx.lineJoin = 'round';
    ctx.shadowBlur = 12;

    // CH2: sine
    ctx.strokeStyle = 'rgba(110, 230, 255, 0.75)';
    ctx.shadowColor = '#6ee6ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 3) {
      const y = H * 0.74 + Math.sin(x / 26 - t * 4) * 26;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // CH1: heartbeat
    ctx.strokeStyle = '#8dffb8';
    ctx.shadowColor = '#5dff9a';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 2) {
      const y = H * 0.4 - ecg(x / 190 + t * 0.9) * 105;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.85);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
}

// ─── Multimeter LCD ───────────────────────────────────────────

export class MeterScreen {
  readonly canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;
  private label: string;
  readonly W = 384;
  readonly H = 150;

  constructor() {
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.ctx = this.canvas.getContext('2d')!;
    this.label = cssFont('--font-inter', 'Arial');
  }

  draw(t: number) {
    const { ctx, W, H } = this;
    // greenish-grey LCD with a faint ghost of the unlit segments
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#b5c2a5');
    g.addColorStop(1, '#a3b193');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#1b2216';
    ctx.font = `700 17px ${this.label}`;
    ctx.textBaseline = 'top';
    ctx.fillText('DC', 14, 10);
    ctx.fillText('AUTO', 52, 10);
    ctx.fillText('mV', W - 50, 10);
    ctx.globalAlpha = 0.18;
    ctx.fillText('AC', 112, 10);
    ctx.fillText('HOLD', 150, 10);
    ctx.globalAlpha = 1;
    // settles around 3.300 V with a little last-digit jitter
    const v = 3.3 + ((Math.floor(t * 3) % 3) - 1) * 0.001;
    drawSevenSeg(ctx, '8.888', 30, 40, 88, 'rgba(27,34,22,0.07)');
    drawSevenSeg(ctx, v.toFixed(3), 30, 40, 88, '#1b2216');
    ctx.font = `800 34px ${this.label}`;
    ctx.fillText('V', W - 44, 90);
  }
}

// ─── Projector (events page) ──────────────────────────────────

export interface Slide { image: string; title: string; date?: string; label?: string }

const SLIDE_TIME = 3.6;   // seconds per slide
const FADE_TIME = 0.8;

export class ProjectorScreen {
  readonly canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;
  private images: (HTMLImageElement | null)[];
  private head: string;
  private body: string;
  readonly W = 1280;
  readonly H = 740;

  constructor(private slides: Slide[]) {
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.ctx = this.canvas.getContext('2d')!;
    this.head = cssFont('--font-bebas', 'Impact');
    this.body = cssFont('--font-space', 'Arial');
    this.images = slides.map((s) => {
      const img = new Image();
      img.src = s.image;
      return img;
    });
  }

  /** t = seconds since the projector was switched on */
  draw(t: number) {
    const { ctx, W, H } = this;
    if (t < 1.4 || this.slides.length === 0) {
      // startup splash, like a real projector finding its input
      ctx.fillStyle = '#1d3fb8';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `150px ${this.head}`;
      ctx.fillText('IEEE SJSU', W / 2, H / 2 - 20);
      ctx.font = `600 30px ${this.body}`;
      ctx.globalAlpha = 0.75;
      ctx.fillText(this.slides.length ? 'SEARCHING FOR INPUT…  HDMI 1' : 'NO SIGNAL', W / 2, H / 2 + 90);
      ctx.globalAlpha = 1;
      return;
    }
    const s = t - 1.4;
    const i = Math.floor(s / SLIDE_TIME) % this.slides.length;
    const local = s % SLIDE_TIME;
    this.drawSlide(i, local, 1);
    if (local > SLIDE_TIME - FADE_TIME) {
      this.drawSlide((i + 1) % this.slides.length, local - SLIDE_TIME, (local - (SLIDE_TIME - FADE_TIME)) / FADE_TIME);
    }
    this.drawChrome(i, local);
  }

  private drawSlide(i: number, local: number, alpha: number) {
    const { ctx, W, H } = this;
    const img = this.images[i];
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#0b0f16';
    ctx.fillRect(0, 0, W, H);
    if (img && img.complete && img.naturalWidth) {
      // cover-fit with a slow Ken Burns zoom
      const zoom = 1.04 + 0.06 * ((local + FADE_TIME) / (SLIDE_TIME + FADE_TIME));
      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight) * zoom;
      const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
      ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
    }
    ctx.restore();
  }

  private drawChrome(i: number, local: number) {
    const { ctx, W, H } = this;
    const slide = this.slides[i];
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, 'rgba(5,8,14,0.75)');
    g.addColorStop(0.3, 'rgba(5,8,14,0)');
    g.addColorStop(0.62, 'rgba(5,8,14,0)');
    g.addColorStop(1, 'rgba(5,8,14,0.85)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#8fb6ff';
    ctx.font = `600 22px ${this.body}`;
    ctx.fillText('IEEE SJSU  ·  INNOVATION GARAGE', 56, 66);
    ctx.fillStyle = '#ffffff';
    ctx.font = `120px ${this.head}`;
    ctx.fillText('FEATURED EVENTS', 52, 172);

    // current slide caption slides up a little as it changes
    const k = Math.min(1, local / 0.5);
    ctx.globalAlpha = k;
    ctx.fillStyle = '#ffffff';
    ctx.font = `76px ${this.head}`;
    ctx.fillText(slide.title.toUpperCase(), 56, H - 78 + (1 - k) * 16);
    ctx.font = `600 24px ${this.body}`;
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillText([slide.label, slide.date].filter(Boolean).join('  ·  ').toUpperCase(), 58, H - 40 + (1 - k) * 16);
    ctx.globalAlpha = 1;

    // slide progress dots
    const n = Math.min(this.slides.length, 14);
    for (let d = 0; d < n; d++) {
      ctx.fillStyle = d === i % n ? '#ffffff' : 'rgba(255,255,255,0.35)';
      ctx.fillRect(W - 56 - (n - d) * 22, H - 52, 14, 4);
    }
  }

  dispose() {
    this.images = [];
  }
}
