import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { TerminalScreen, ScopeScreen, MeterScreen, ProjectorScreen, type Slide } from './screens';
import {
  SCOPE_KNOBS, SCOPE_SCREEN, scopePanelTexture,
  METER_DIAL, METER_LCD, METER_JACKS, METER_JACK_V, meterFaceTexture,
  officeSignTexture, monitorTexture, drawSevenSeg, makeCanvas,
} from './textures';

// The Innovation Garage (ENGR 376) in 3D, laid out like the real lab:
//  - the back wall (z = -4) is a long band of windows with white blinds,
//    with the lab benches in front of it: PCs, instruments, and our
//    terminal / oscilloscope / multimeter, all facing into the room
//  - rows of tables with green, grey and maroon cloths fill the room
//  - the left wall (x = -7) has a door, a bookshelf, and the IEEE SJSU
//    Student Branch Office doorway with its sign (the office is furnished)
//  - the front wall (z = 9) has the projector screen; the projector shows a
//    slideshow on the events page
//
// Units are meters. The page drives it with setProgress(p); each whole
// number is one camera shot of the chosen tour (see TOURS).

const BENCH_Y = 0.92;
const BENCH_Z = -3.5;   // the hero bench items' origin

interface Shot { pos: THREE.Vector3; target: THREE.Vector3; fit: number; shift: number }
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
export type Tour = 'home' | 'events';
const TOURS: Record<Tour, Shot[]> = {
  // home: terminal → room → scope → multimeter → office door → inside the office
  home: [
    { pos: v(-0.62, 1.27, -2.18), target: v(-0.62, 1.16, -3.4),  fit: 0.62, shift: 0 },    // terminal
    { pos: v(3.4, 2.15, 6.8),     target: v(-1.4, 0.95, -2.4),   fit: 4.2,  shift: 0.5 },  // the room
    { pos: v(0.5, 1.2, -2.72),    target: v(0.25, 1.06, -3.44),  fit: 0.5,  shift: 1 },    // oscilloscope
    { pos: v(1.08, 1.42, -2.64),  target: v(0.82, 0.94, -3.28),  fit: 0.46, shift: 1 },    // multimeter
    { pos: v(-3.1, 1.62, 1.8),    target: v(-7, 1.5, 0.95),      fit: 3.6,  shift: 0 },    // left wall: books + office door
    { pos: v(-8.4, 1.5, 1.8),     target: v(-10, 1.3, 1.8),      fit: 1.6,  shift: 0 },    // into the office
  ],
  // events: under the projector, looking at the screen → into the screen
  events: [
    { pos: v(-0.25, 1.62, 3.0),   target: v(-0.4, 1.95, 8.9),    fit: 3.2,  shift: 0 },
    { pos: v(-0.4, 1.85, 8.0),    target: v(-0.4, 1.85, 8.95),   fit: 2.4,  shift: 0 },
  ],
};

// ─── helpers ──────────────────────────────────────────────────
const std = (color: THREE.ColorRepresentation, roughness = 0.75, metalness = 0, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });

type Shadow = 'cast' | 'receive' | 'both' | 'none';
function mesh(parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, shadow: Shadow = 'none') {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = shadow === 'cast' || shadow === 'both';
  m.receiveShadow = shadow === 'receive' || shadow === 'both';
  parent.add(m);
  return m;
}
const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
const rbox = (w: number, h: number, d: number, r: number) => new RoundedBoxGeometry(w, h, d, 3, r);
const cyl = (r: number, h: number, seg = 16, r2 = r) => new THREE.CylinderGeometry(r, r2, h, seg);

function texFrom(canvas: HTMLCanvasElement, repeat?: [number, number]) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  return tex;
}
function canvasTex(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, repeat?: [number, number]) {
  const { canvas, ctx } = makeCanvas(w, h);
  draw(ctx);
  return texFrom(canvas, repeat);
}

// A CRT face: a plane with a slight outward bulge (corners at z = 0)
function crtGeometry(w: number, h: number, bulge: number) {
  const g = new THREE.PlaneGeometry(w, h, 24, 18);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) / (w / 2), y = p.getY(i) / (h / 2);
    p.setZ(i, bulge * (1 - 0.5 * (x * x + y * y)));
  }
  g.computeVertexNormals();
  return g;
}

// Hanging tablecloth side: a plane with folds that deepen toward the hem
const skirtCache = new Map<string, THREE.BufferGeometry>();
function skirtGeometry(w: number, h: number) {
  const key = `${w}-${h}`;
  if (skirtCache.has(key)) return skirtCache.get(key)!;
  const g = new THREE.PlaneGeometry(w, h, Math.ceil(w * 40), 6);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const depth = 0.5 - y / h;                       // 0 at top → 1 at hem
    const fold = Math.sin(x * 23) * 0.6 + Math.sin(x * 51 + 1.3) * 0.4;
    p.setZ(i, fold * 0.011 * depth * depth);
  }
  g.computeVertexNormals();
  skirtCache.set(key, g);
  return g;
}

export interface GarageScene {
  setProgress(p: number): void;
  setPointer(x: number, y: number): void;
  setDay(day: boolean): void;
  snapDay(day: boolean): void;
  powerOn(skipBoot?: boolean): void;
  resize(): void;
  start(): void;
  stop(): void;
  dispose(): void;
}

export interface GarageOptions {
  tour: Tour;
  /** photos for the projector slideshow (events tour) */
  slides?: Slide[];
}

export function createGarageScene(canvas: HTMLCanvasElement, { tour, slides = [] }: GarageOptions): GarageScene {
  const SHOTS = TOURS[tour];
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new RoomEnvironment();
  scene.environment = pmrem.fromScene(env, 0.04).texture;
  env.dispose();

  const NIGHT_BG = new THREE.Color('#04070c');
  const DAY_BG = new THREE.Color('#dfe6ec');
  scene.background = NIGHT_BG.clone();

  const camera = new THREE.PerspectiveCamera(38, 1, 0.02, 60);

  // soft glow on the screens (desktop only — it's the most expensive bit)
  let composer: EffectComposer | null = null;
  let bloom: UnrealBloomPass | null = null;
  if (!mobile) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.28, 0.4, 0.95);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }

  // ─── lights ──────────────────────────────────────────────
  const hemi = new THREE.HemisphereLight('#dbe6ff', '#4a4034', 0.2);
  scene.add(hemi);

  // overhead key light (the ceiling panels), casts the shadows on the bench
  const keyLight = new THREE.DirectionalLight('#fff4e6', 0.2);
  keyLight.position.set(1.5, 6.5, -0.5);
  keyLight.target.position.set(0, 0.9, -3.4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  Object.assign(keyLight.shadow.camera, { left: -3.2, right: 3.2, top: 2.4, bottom: -2.4, near: 1, far: 12 });
  keyLight.shadow.bias = -0.0003;
  keyLight.shadow.normalBias = 0.015;
  keyLight.shadow.radius = 3;
  scene.add(keyLight, keyLight.target);

  // daylight / moonlight through the windows behind the benches
  const windowLight = new THREE.DirectionalLight('#9db4ff', 0.5);
  windowLight.position.set(-1, 3.2, -10);
  windowLight.target.position.set(0, 1, 2);
  scene.add(windowLight, windowLight.target);

  const fills = [v(-1.5, 2.8, -1.2), v(2.5, 2.8, 4)].map((p) => {
    const l = new THREE.PointLight('#fff6e8', 0, 14, 1.3);
    l.position.copy(p);
    scene.add(l);
    return l;
  });

  // the office light is on day and night
  const officeLight = new THREE.PointLight('#ffe2b8', 1.1, 4, 1.8);
  officeLight.position.set(-8.6, 2.6, 1.8);
  scene.add(officeLight);

  const terminalGlow = new THREE.PointLight('#a8ffc8', 0, 1.2, 2);
  terminalGlow.position.set(-0.62, 1.0, BENCH_Z + 0.86);
  const scopeGlow = new THREE.PointLight('#5dff9a', 0.15, 0.8, 2);
  scopeGlow.position.set(0.16, 1.0, BENCH_Z + 0.5);
  scene.add(terminalGlow, scopeGlow);

  // ─── materials ───────────────────────────────────────────
  const wallMat = std('#97bcc4', 0.92);
  const floorTex = canvasTex(1024, 1024, (ctx) => {
    // beige vinyl composition tile, slightly varied, with speckles
    const n = 4, s = 1024 / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      ctx.fillStyle = `hsl(${38 + Math.random() * 4}, ${26 + Math.random() * 6}%, ${80 + Math.random() * 5}%)`;
      ctx.fillRect(i * s, j * s, s, s);
      for (let k = 0; k < 600; k++) {
        const dark = Math.random() > 0.5;
        ctx.fillStyle = dark ? `rgba(110,90,60,${Math.random() * 0.25})` : `rgba(255,255,255,${Math.random() * 0.3})`;
        ctx.fillRect(i * s + Math.random() * s, j * s + Math.random() * s, 1 + Math.random() * 4, 1 + Math.random() * 3);
      }
      ctx.strokeStyle = 'rgba(80, 65, 45, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(i * s + 1, j * s + 1, s - 2, s - 2);
    }
  }, [11, 11]);
  const floorMat = std('#ffffff', 0.22, 0, { map: floorTex });
  const ceilingTex = canvasTex(256, 256, (ctx) => {
    ctx.fillStyle = '#efefe9';
    ctx.fillRect(0, 0, 256, 256);
    for (let k = 0; k < 1400; k++) {
      ctx.fillStyle = `rgba(140,140,130,${Math.random() * 0.3})`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5);
    }
    ctx.strokeStyle = '#bdbdb5';
    ctx.lineWidth = 7;
    ctx.strokeRect(0, 0, 256, 256);
  }, [22, 22]);
  const ceilingMat = std('#ffffff', 0.95, 0, { map: ceilingTex });
  const lensTex = canvasTex(256, 128, (ctx) => {
    ctx.fillStyle = '#fbfaf5';
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = 'rgba(200,200,190,0.55)';
    for (let x = 0; x < 256; x += 8) for (let y = 0; y < 128; y += 8) ctx.fillRect(x, y, 4, 4);
    ctx.strokeStyle = '#a9a9a2';
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, 256, 128);
  });
  const panelMat = std('#ffffff', 0.4, 0, { map: lensTex, emissive: new THREE.Color('#fff7ea'), emissiveMap: lensTex, emissiveIntensity: 0.04 });
  const blackMetal = std('#1c1d20', 0.45, 0.6);
  const chrome = std('#cfd2d6', 0.22, 0.95);
  const benchTop = std('#2c2f35', 0.5);
  const benchBody = std('#9aa2a6', 0.55, 0.25);
  const beige = std('#d9ceb2', 0.55);
  const beigeDark = std('#bfb397', 0.6);
  const darkPlastic = std('#202226', 0.5);
  const keyMat = std('#cfc3a4', 0.55);
  const keyDark = std('#8a7e66', 0.6);
  const wood = std('#c49a63', 0.6);
  const lightWood = std('#d8b98b', 0.65);
  const blindMat = std('#f3f3ef', 0.7, 0, { emissive: new THREE.Color('#e3ecff'), emissiveIntensity: 0.04, side: THREE.DoubleSide });
  const redWire = std('#c2241f', 0.45);
  const blackWire = std('#141416', 0.45);

  // ─── room shell ──────────────────────────────────────────
  const X0 = -7, X1 = 6, Z0 = -4, Z1 = 9, RH = 3;
  const W = X1 - X0, D = Z1 - Z0, CX = (X0 + X1) / 2, CZ = (Z0 + Z1) / 2;

  const floor = mesh(scene, new THREE.PlaneGeometry(W, D), floorMat, CX, 0, CZ, 'receive');
  floor.rotation.x = -Math.PI / 2;
  mesh(scene, new THREE.PlaneGeometry(W, D), ceilingMat, CX, RH, CZ).rotation.x = Math.PI / 2;
  mesh(scene, box(W, RH, 0.1), wallMat, CX, RH / 2, Z1);           // front
  const base = std('#4d5a60', 0.7);
  mesh(scene, box(W, 0.1, 0.02), base, CX, 0.05, Z1 - 0.06);

  // back wall: a band of steel-framed windows, a transom bar, and white
  // horizontal blinds in every pane — like the real room
  const winY0 = 0.98, winY1 = 2.78, transY = 2.3;
  mesh(scene, box(W, winY0, 0.12), wallMat, CX, winY0 / 2, Z0);
  mesh(scene, box(W, RH - winY1, 0.12), wallMat, CX, (RH + winY1) / 2, Z0);
  const skyMat = new THREE.MeshBasicMaterial({ color: '#0d1a33' });
  mesh(scene, new THREE.PlaneGeometry(W, winY1 - winY0), skyMat, CX, (winY0 + winY1) / 2, Z0 - 0.08);
  const frameMat = std('#4b5e69', 0.6, 0.2);
  const BAYS = 10, BAY = (W - 0.1) / BAYS, bx0 = X0 + 0.05;
  for (let i = 0; i <= BAYS; i++) mesh(scene, box(0.075, winY1 - winY0, 0.16), frameMat, bx0 + i * BAY, (winY0 + winY1) / 2, Z0 + 0.03);
  mesh(scene, box(W, 0.08, 0.24), frameMat, CX, winY0, Z0 + 0.06);        // sill
  mesh(scene, box(W, 0.07, 0.16), frameMat, CX, winY1, Z0 + 0.03);        // head
  mesh(scene, box(W, 0.06, 0.16), frameMat, CX, transY, Z0 + 0.03);       // transom bar
  {
    const SG = 0.034;                                     // slat pitch
    const raised = new Set([3, 7]);                       // a couple of blinds pulled up part way
    const tilted = new Set([5, 8]);                       // upper panes tipped open
    const slatGeo = box(BAY - 0.13, 0.027, 0.0025);
    const railGeo = box(BAY - 0.1, 0.035, 0.045);
    const max = BAYS * 60;
    const slats = new THREE.InstancedMesh(slatGeo, blindMat, max);
    const rails = new THREE.InstancedMesh(railGeo, std('#e9e9e4', 0.5), BAYS * 4);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.42, 0, 0)), one = v(1, 1, 1), none = new THREE.Quaternion();
    let n = 0, r = 0;
    for (let b = 0; b < BAYS; b++) {
      const cx = bx0 + (b + 0.5) * BAY;
      const panes: [number, number][] = [[raised.has(b) ? 1.62 : winY0 + 0.06, transY - 0.06], [transY + 0.05, winY1 - 0.06]];
      panes.forEach(([y0, y1], pi) => {
        if (pi === 1 && tilted.has(b)) return;
        rails.setMatrixAt(r++, m.compose(v(cx, y1, Z0 + 0.13), none, one));
        rails.setMatrixAt(r++, m.compose(v(cx, y0, Z0 + 0.13), none, v(1, 0.6, 0.7)));
        for (let y = y1 - 0.04; y > y0 + 0.02; y -= SG) slats.setMatrixAt(n++, m.compose(v(cx, y, Z0 + 0.13), q, one));
      });
      if (tilted.has(b)) {
        // awning pane hinged at the transom, top tipped into the room
        const g = new THREE.Group();
        g.position.set(cx, transY + 0.03, Z0 + 0.08);
        g.rotation.x = 0.38;
        scene.add(g);
        const ph = winY1 - transY - 0.08, pw = BAY - 0.09;
        mesh(g, box(pw, 0.04, 0.05), frameMat, 0, 0.02, 0);
        mesh(g, box(pw, 0.04, 0.05), frameMat, 0, ph, 0);
        mesh(g, box(0.04, ph, 0.05), frameMat, -pw / 2, ph / 2, 0);
        mesh(g, box(0.04, ph, 0.05), frameMat, pw / 2, ph / 2, 0);
        mesh(g, new THREE.PlaneGeometry(pw, ph), new THREE.MeshStandardMaterial({ color: '#cfe0ea', transparent: true, opacity: 0.18, roughness: 0.05 }), 0, ph / 2, 0);
      }
    }
    slats.count = n;
    rails.count = r;
    scene.add(slats, rails);
  }
  // shelf / lamp rail running across the windows above the benches
  mesh(scene, box(W, 0.035, 0.3), std('#c9b98f', 0.5, 0.2), CX, 1.68, Z0 + 0.2);
  for (let x = -6; x < 5.5; x += 1.7) mesh(scene, box(0.03, 0.75, 0.03), frameMat, x, 1.3, Z0 + 0.32);

  // left wall, with the office doorway cut out; right wall is solid
  const DOOR_Z0 = 1.3, DOOR_Z1 = 2.3, DOOR_H = 2.12;
  mesh(scene, box(0.12, RH, DOOR_Z0 - Z0), wallMat, X0, RH / 2, (Z0 + DOOR_Z0) / 2);
  mesh(scene, box(0.12, RH, Z1 - DOOR_Z1), wallMat, X0, RH / 2, (DOOR_Z1 + Z1) / 2);
  mesh(scene, box(0.12, RH - DOOR_H, DOOR_Z1 - DOOR_Z0), wallMat, X0, (RH + DOOR_H) / 2, (DOOR_Z0 + DOOR_Z1) / 2);
  mesh(scene, box(0.02, 0.1, DOOR_Z0 - Z0), base, X0 + 0.07, 0.05, (Z0 + DOOR_Z0) / 2);
  mesh(scene, box(0.02, 0.1, Z1 - DOOR_Z1), base, X0 + 0.07, 0.05, (DOOR_Z1 + Z1) / 2);
  mesh(scene, box(0.12, RH, D), wallMat, X1, RH / 2, CZ);
  mesh(scene, box(0.02, 0.1, D), base, X1 - 0.07, 0.05, CZ);

  // ceiling troffers
  for (let x = -5.6; x <= 5; x += 2.4) for (let z = -3; z <= 8.5; z += 2.2) {
    mesh(scene, box(1.2, 0.025, 0.6), panelMat, x, RH - 0.013, z);
  }

  // ─── back benches with PCs and instruments ───────────────
  mesh(scene, box(12.6, 0.05, 0.9), benchTop, -0.5, BENCH_Y - 0.025, -3.55, 'both');
  mesh(scene, box(12.5, 0.84, 0.82), benchBody, -0.5, 0.45, -3.57, 'receive');
  for (let x = -6.4; x < 5.8; x += 1.05) mesh(scene, box(0.008, 0.7, 0.01), std('#7c8489', 0.5), x, 0.46, -3.155);
  const monitorTex = (['code', 'pcb', 'wave'] as const).map((k) => texFrom(monitorTexture(k)));
  const addPC = (x: number, i: number) => {
    const pc = new THREE.Group();
    pc.position.set(x, BENCH_Y, -3.72);
    scene.add(pc);
    mesh(pc, box(0.22, 0.015, 0.16), blackMetal, 0, 0.008, 0, 'cast');
    mesh(pc, box(0.04, 0.2, 0.03), blackMetal, 0, 0.1, -0.02, 'cast');
    mesh(pc, rbox(0.58, 0.35, 0.03, 0.008), darkPlastic, 0, 0.36, 0, 'cast');
    mesh(pc, new THREE.PlaneGeometry(0.555, 0.312), new THREE.MeshStandardMaterial({
      color: '#000', emissive: '#fff', emissiveMap: monitorTex[i % 3], emissiveIntensity: 0.55, roughness: 0.3,
    }), 0, 0.365, 0.0155);
    mesh(pc, box(0.44, 0.02, 0.14), darkPlastic, 0, 0.01, 0.32, 'cast');            // keyboard
    mesh(pc, rbox(0.06, 0.025, 0.1, 0.012), darkPlastic, 0.32, 0.012, 0.32, 'cast'); // mouse
    mesh(pc, box(0.19, 0.42, 0.42), std('#17181b', 0.5), 0.46, 0.21, -0.02, 'cast');  // tower
    mesh(pc, box(0.004, 0.006, 0.006), new THREE.MeshBasicMaterial({ color: '#3d9bff' }), 0.46, 0.38, 0.2);
  };
  [-6.0, -4.7, -3.4, -2.0, 3.0, 4.4].forEach(addPC);

  // bench power supply + function generator stack
  {
    const psu = new THREE.Group();
    psu.position.set(1.62, BENCH_Y, -3.62);
    psu.rotation.y = -0.15;
    scene.add(psu);
    mesh(psu, rbox(0.27, 0.15, 0.3, 0.01), std('#d9dcd8', 0.5), 0, 0.075, 0, 'both');
    const faceTex = canvasTex(540, 300, (ctx) => {
      ctx.fillStyle = '#2b3036'; ctx.fillRect(0, 0, 540, 300);
      ctx.fillStyle = '#0b0c0d'; ctx.fillRect(28, 28, 220, 90); ctx.fillRect(28, 140, 220, 90);
      drawSevenSeg(ctx, '12.00', 44, 42, 62, '#ff3b30', 'rgba(255,59,48,0.08)');
      drawSevenSeg(ctx, '0.250', 44, 154, 62, '#39ff6a', 'rgba(57,255,106,0.08)');
      ctx.fillStyle = '#d7dade'; ctx.font = '600 18px Arial';
      ctx.fillText('V', 258, 100); ctx.fillText('A', 258, 212);
      ctx.fillText('DC POWER SUPPLY  0–30V / 0–5A', 28, 270);
    });
    mesh(psu, new THREE.PlaneGeometry(0.25, 0.135), new THREE.MeshStandardMaterial({ map: faceTex, emissive: '#fff', emissiveMap: faceTex, emissiveIntensity: 0.6, roughness: 0.5 }), 0, 0.075, 0.151);
    for (const [kx, ky] of [[0.07, 0.1], [0.07, 0.045]]) {
      mesh(psu, cyl(0.014, 0.018, 20), darkPlastic, kx, ky, 0.16).rotation.x = Math.PI / 2;
    }
    for (const [px, c] of [[0.035, '#c2241f'], [0.075, '#141416'], [0.105, '#2a7a3a']] as [number, string][]) {
      mesh(psu, cyl(0.007, 0.02, 14), std(c, 0.4), px, 0.018, 0.16).rotation.x = Math.PI / 2;
    }
    // function generator on top
    mesh(psu, rbox(0.27, 0.1, 0.28, 0.01), std('#3a3f46', 0.5), 0, 0.2, -0.01, 'both');
    const fgTex = canvasTex(540, 200, (ctx) => {
      ctx.fillStyle = '#3a3f46'; ctx.fillRect(0, 0, 540, 200);
      ctx.fillStyle = '#0a0f12'; ctx.fillRect(24, 24, 300, 90);
      drawSevenSeg(ctx, '1.000', 40, 38, 60, '#4fd8ff', 'rgba(79,216,255,0.08)');
      ctx.fillStyle = '#d7dade'; ctx.font = '600 20px Arial'; ctx.fillText('kHz', 270, 92);
      ctx.font = '600 15px Arial'; ctx.fillText('FUNCTION GENERATOR', 24, 160);
      ['∿', '⊓', '⋀'].forEach((t, i) => { ctx.fillStyle = '#5c636c'; ctx.fillRect(360 + i * 52, 40, 40, 40); ctx.fillStyle = '#fff'; ctx.font = '24px Arial'; ctx.fillText(t, 370 + i * 52, 68); });
    });
    mesh(psu, new THREE.PlaneGeometry(0.25, 0.09), new THREE.MeshStandardMaterial({ map: fgTex, emissive: '#fff', emissiveMap: fgTex, emissiveIntensity: 0.5, roughness: 0.5 }), 0, 0.2, 0.131);
  }

  // ─── tables (cloths + folding legs) and chairs ───────────
  const cloths = { green: std('#1d5a3b', 0.95), grey: std('#8e9296', 0.95), maroon: std('#6a1f2a', 0.95), navy: std('#22305e', 0.95) };
  type Cloth = keyof typeof cloths;
  const TABLE_L = 2.0, TABLE_D = 0.76, TABLE_H = 0.75, DROP = 0.42;
  const chairs: { x: number; z: number; rot: number; red: boolean }[] = [];
  const addTable = (x: number, z: number, rot: number, cloth: Cloth, seats: number) => {
    const t = new THREE.Group();
    t.position.set(x, 0, z);
    t.rotation.y = rot;
    scene.add(t);
    const mat = cloths[cloth];
    mesh(t, box(TABLE_L + 0.02, 0.012, TABLE_D + 0.02), mat, 0, TABLE_H + 0.006, 0, 'both');
    const long = skirtGeometry(TABLE_L + 0.02, DROP), short = skirtGeometry(TABLE_D + 0.02, DROP);
    const y = TABLE_H - DROP / 2;
    mesh(t, long, mat, 0, y, TABLE_D / 2 + 0.012, 'cast');
    mesh(t, long, mat, 0, y, -TABLE_D / 2 - 0.012, 'cast').rotation.y = Math.PI;
    mesh(t, short, mat, TABLE_L / 2 + 0.012, y, 0, 'cast').rotation.y = Math.PI / 2;
    mesh(t, short, mat, -TABLE_L / 2 - 0.012, y, 0, 'cast').rotation.y = -Math.PI / 2;
    const legGeo = cyl(0.015, TABLE_H - DROP, 10);
    for (const lx of [-0.85, 0.85]) for (const lz of [-0.3, 0.3]) mesh(t, legGeo, chrome, lx, (TABLE_H - DROP) / 2, lz);
    // caster wheels peeking out, like the real folding tables
    for (const lx of [-0.85, 0.85]) mesh(t, cyl(0.025, 0.02, 14), blackMetal, lx, 0.025, 0.3).rotation.z = Math.PI / 2;
    for (let i = 0; i < seats; i++) {
      const cx = -TABLE_L / 2 + (TABLE_L / seats) * (i + 0.5);
      const local = v(cx + (Math.random() - 0.5) * 0.1, 0, -TABLE_D / 2 - 0.42).applyAxisAngle(v(0, 1, 0), rot);
      chairs.push({ x: x + local.x, z: z + local.z, rot: rot + (Math.random() - 0.5) * 0.35, red: Math.random() < 0.18 });
    }
  };
  const rows: [number, Cloth[]][] = [
    [-1.3, ['green', 'grey', 'maroon', 'green']],
    [1.2, ['green', 'green', 'grey', 'maroon']],
    [3.7, ['grey', 'green', 'navy', 'green']],
    [6.2, ['green', 'maroon', 'green', 'grey']],
  ];
  for (const [z, cs] of rows) cs.forEach((c, i) => addTable(-4.9 + i * 2.15, z + (Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.05, c, 3));
  chairs.push({ x: X0 - 2.0, z: 1.75, rot: -Math.PI / 2 - 0.3, red: false });   // office desk chair
  // chairs pulled up to the PCs on the bench
  for (const x of [-6.0, -4.7, -3.4, -2.0, 3.0, 4.4]) chairs.push({ x, z: -2.75, rot: Math.PI + (Math.random() - 0.5) * 0.4, red: Math.random() < 0.5 });

  {
    // chairs are instanced: one InstancedMesh per part
    const n = chairs.length;
    const shellMat = std('#ffffff', 0.45);
    const seat = new THREE.InstancedMesh(rbox(0.44, 0.05, 0.42, 0.02), shellMat, n);
    const back = new THREE.InstancedMesh(rbox(0.44, 0.3, 0.035, 0.016), shellMat, n);
    const legs = new THREE.InstancedMesh(cyl(0.011, 0.46, 8), chrome, n * 6);
    const basket = new THREE.InstancedMesh(box(0.34, 0.012, 0.3), std('#2a2c30', 0.6, 0.5, { wireframe: true }), n);
    const blue = new THREE.Color('#2f5fc4'), red = new THREE.Color('#b0302e');
    const m = new THREE.Matrix4(), part = new THREE.Matrix4();
    chairs.forEach((c, i) => {
      m.makeRotationY(c.rot).setPosition(c.x, 0, c.z);
      seat.setMatrixAt(i, part.copy(m).multiply(new THREE.Matrix4().makeTranslation(0, 0.46, 0)));
      back.setMatrixAt(i, part.copy(m).multiply(new THREE.Matrix4().makeTranslation(0, 0.72, -0.2).multiply(new THREE.Matrix4().makeRotationX(-0.12))));
      basket.setMatrixAt(i, part.copy(m).multiply(new THREE.Matrix4().makeTranslation(0, 0.2, 0)));
      seat.setColorAt(i, c.red ? red : blue);
      back.setColorAt(i, c.red ? red : blue);
      const L: [number, number, number][] = [[-0.19, 0.23, -0.17], [0.19, 0.23, -0.17], [-0.19, 0.23, 0.18], [0.19, 0.23, 0.18], [-0.19, 0.63, -0.21], [0.19, 0.63, -0.21]];
      L.forEach(([lx, ly, lz], k) => legs.setMatrixAt(i * 6 + k, part.copy(m).multiply(new THREE.Matrix4().makeTranslation(lx, ly, lz))));
    });
    seat.castShadow = back.castShadow = true;
    scene.add(seat, back, legs, basket);
  }

  // ─── front wall: projector screen, doors ─────────────────
  mesh(scene, box(2.8, 1.65, 0.02), std('#f4f4f2', 0.9), -0.4, 1.85, Z1 - 0.07);
  mesh(scene, box(2.9, 0.08, 0.08), darkPlastic, -0.4, 2.72, Z1 - 0.1);
  mesh(scene, box(0.06, 0.5, 0.06), blackMetal, -0.2, 2.75, 5.4);
  mesh(scene, rbox(0.4, 0.15, 0.34, 0.02), std('#e8e8e3', 0.5), -0.2, 2.45, 5.4, 'cast');
  mesh(scene, cyl(0.045, 0.04, 24), darkPlastic, -0.12, 2.45, 5.58).rotation.x = Math.PI / 2;
  const lensMat = new THREE.MeshBasicMaterial({ color: '#1a1d22' });
  mesh(scene, cyl(0.032, 0.005, 24), lensMat, -0.12, 2.45, 5.6).rotation.x = Math.PI / 2;
  for (let i = 0; i < 6; i++) mesh(scene, box(0.18, 0.004, 0.006), darkPlastic, -0.25, 2.527, 5.3 + i * 0.03);

  // what the projector shows (events tour), and its beam
  const SCR_W = 2.7, SCR_H = 1.56, SCR = v(-0.4, 1.85, Z1 - 0.082);
  const projScreen = new ProjectorScreen(slides);
  const projTex = texFrom(projScreen.canvas);
  const projMat = new THREE.MeshStandardMaterial({ color: '#f4f4f2', roughness: 0.9, emissive: '#ffffff', emissiveMap: projTex, emissiveIntensity: 0 });
  const projPlane = mesh(scene, new THREE.PlaneGeometry(SCR_W, SCR_H), projMat, SCR.x, SCR.y, SCR.z);
  projPlane.rotation.y = Math.PI;
  const beamMat = new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
  {
    const lens = v(-0.12, 2.45, 5.6);
    const c = [v(SCR.x + SCR_W / 2, SCR.y + SCR_H / 2, SCR.z), v(SCR.x - SCR_W / 2, SCR.y + SCR_H / 2, SCR.z), v(SCR.x - SCR_W / 2, SCR.y - SCR_H / 2, SCR.z), v(SCR.x + SCR_W / 2, SCR.y - SCR_H / 2, SCR.z)];
    const pos: number[] = [], col: number[] = [];
    for (let i = 0; i < 4; i++) {
      const a = c[i], b = c[(i + 1) % 4];
      pos.push(lens.x, lens.y, lens.z, a.x, a.y, a.z, b.x, b.y, b.z);
      col.push(0.55, 0.62, 0.75, 0.02, 0.025, 0.03, 0.02, 0.025, 0.03);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    scene.add(new THREE.Mesh(g, beamMat));
  }
  const doorAt = (x: number, z: number, rotY: number) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = rotY;
    scene.add(g);
    mesh(g, box(1.06, 2.2, 0.06), std('#e5e0d2', 0.6), 0, 1.1, 0);
    mesh(g, box(0.92, 2.1, 0.05), wood, 0, 1.05, 0.03);
    mesh(g, box(0.16, 0.5, 0.01), std('#1b2430', 0.1, 0.2), 0.22, 1.5, 0.06);
    mesh(g, box(0.14, 0.03, 0.05), chrome, -0.33, 1.02, 0.08);
    return g;
  };
  doorAt(-4.6, Z1 - 0.06, Math.PI);
  doorAt(X0 + 0.06, -2.3, Math.PI / 2);
  const exitTex = canvasTex(256, 96, (ctx) => {
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, 256, 96);
    ctx.fillStyle = '#ff3b30'; ctx.font = 'bold 64px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('EXIT', 128, 50);
  });
  mesh(scene, box(0.32, 0.12, 0.04), new THREE.MeshBasicMaterial({ map: exitTex }), -4.6, 2.45, Z1 - 0.09).rotation.y = Math.PI;
  mesh(scene, box(0.5, 0.75, 0.12), std('#9aa1a3', 0.5, 0.4), -3.5, 1.4, Z1 - 0.1, 'cast');   // electrical panel
  // whiteboard on the right wall
  mesh(scene, box(0.03, 1.2, 3.2), std('#f7f7f5', 0.25), X1 - 0.07, 1.55, 2.5);
  mesh(scene, box(0.08, 0.03, 3.2), chrome, X1 - 0.1, 0.94, 2.5);
  // LED clock above the windows
  const clockTex = canvasTex(256, 96, (ctx) => {
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, 256, 96);
    drawSevenSeg(ctx, '4 53', 40, 18, 60, '#39ff6a');
    ctx.fillStyle = '#39ff6a'; ctx.fillRect(108, 34, 8, 8); ctx.fillRect(108, 58, 8, 8);
  });
  mesh(scene, box(0.34, 0.13, 0.03), new THREE.MeshBasicMaterial({ map: clockTex }), 4.2, 2.86, Z0 + 0.08);

  // ─── left wall: bookshelf, IEEE SJSU Student Branch Office ──
  {
    const shelf = new THREE.Group();
    shelf.position.set(X0 + 0.24, 0, -0.2);
    shelf.rotation.y = Math.PI / 2;
    scene.add(shelf);
    const sw = 1.1, sh = 1.85, sd = 0.32;
    mesh(shelf, box(sw, sh, 0.02), lightWood, 0, sh / 2, -sd / 2, 'receive');
    for (const sx of [-sw / 2, sw / 2]) mesh(shelf, box(0.025, sh, sd), lightWood, sx, sh / 2, 0, 'both');
    const shelves = 5;
    for (let i = 0; i <= shelves; i++) mesh(shelf, box(sw, 0.025, sd), lightWood, 0, 0.05 + i * ((sh - 0.06) / shelves), 0, 'both');
    const palette = ['#7b2d26', '#1f3a5a', '#2f5d3a', '#c9a227', '#e9e2cf', '#3a3a3a', '#8a4b2a', '#5a6b8a', '#b23a3a', '#d8d2c0'];
    const books = new THREE.InstancedMesh(box(1, 1, 1), std('#ffffff', 0.8), 200);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), c = new THREE.Color();
    let k = 0;
    for (let i = 0; i < shelves && k < 200; i++) {
      let x = -sw / 2 + 0.04;
      const y0 = 0.05 + i * ((sh - 0.06) / shelves) + 0.0125;
      while (x < sw / 2 - 0.08 && k < 200) {
        const bw = 0.02 + Math.random() * 0.03, bh = 0.2 + Math.random() * 0.1, bd = 0.18 + Math.random() * 0.08;
        q.setFromEuler(new THREE.Euler(0, 0, Math.random() < 0.06 ? 0.25 : 0));
        m.compose(v(x + bw / 2, y0 + bh / 2, -sd / 2 + bd / 2 + 0.02), q, v(bw, bh, bd));
        books.setMatrixAt(k, m);
        books.setColorAt(k, c.set(palette[Math.floor(Math.random() * palette.length)]));
        k++;
        x += bw + (Math.random() < 0.08 ? 0.05 : 0.002);
      }
    }
    books.count = k;
    books.castShadow = true;
    shelf.add(books);
    ['#e3b23c', '#d4cfc0', '#c0392b', '#e8dfc8'].forEach((col, i) => {
      mesh(shelf, box(0.24, 0.33, 0.01), std(col, 0.8), -0.4 + i * 0.27, sh + 0.25, -sd / 2 + 0.02);
    });
  }
  {
    // office doorway: frame, door swung open into the office, sign above
    const dz = (DOOR_Z0 + DOOR_Z1) / 2;
    const frame = std('#e5e0d2', 0.6);
    mesh(scene, box(0.16, DOOR_H, 0.05), frame, X0 + 0.02, DOOR_H / 2, DOOR_Z0 - 0.02);
    mesh(scene, box(0.16, DOOR_H, 0.05), frame, X0 + 0.02, DOOR_H / 2, DOOR_Z1 + 0.02);
    mesh(scene, box(0.16, 0.06, DOOR_Z1 - DOOR_Z0 + 0.1), frame, X0 + 0.02, DOOR_H + 0.03, dz);
    const door = new THREE.Group();
    door.position.set(X0 - 0.05, 0, DOOR_Z1);
    door.rotation.y = 2.75;
    scene.add(door);
    mesh(door, box(0.92, 2.08, 0.045), wood, 0.46, 1.04, 0, 'cast');
    mesh(door, box(0.13, 0.03, 0.05), chrome, 0.82, 1.02, 0.04);
    const signTex = texFrom(officeSignTexture());
    mesh(scene, box(0.03, 0.42, 0.84), new THREE.MeshStandardMaterial({ color: '#00629b', roughness: 0.4 }), X0 + 0.08, 2.5, dz, 'cast');
    mesh(scene, new THREE.PlaneGeometry(0.84, 0.42), new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.4, emissive: '#fff', emissiveMap: signTex, emissiveIntensity: 0.12 }), X0 + 0.097, 2.5, dz).rotation.y = Math.PI / 2;
    // IEEE plaque by the door at eye level
    const plaqueTex = new THREE.TextureLoader().load('/ieee-mb.png', (t) => { t.colorSpace = THREE.SRGBColorSpace; });
    const plaqueMat = new THREE.MeshStandardMaterial({ map: plaqueTex, transparent: true, roughness: 0.5 });
    mesh(scene, box(0.02, 0.24, 0.5), std('#ffffff', 0.5), X0 + 0.07, 1.55, DOOR_Z1 + 0.45);
    mesh(scene, new THREE.PlaneGeometry(0.42, 0.15), plaqueMat, X0 + 0.082, 1.55, DOOR_Z1 + 0.45).rotation.y = Math.PI / 2;

    // inside the office: warm light, desk with a PC, filing cabinet,
    // shelves, an IEEE banner and posters
    const OX = X0 - 1.5, OD = 3, OW = 3.4;
    const offWall = std('#e6dccb', 0.9);
    mesh(scene, new THREE.PlaneGeometry(OD, OW), floorMat, OX, 0.001, dz).rotation.x = -Math.PI / 2;
    mesh(scene, box(0.1, RH, OW), offWall, X0 - OD, RH / 2, dz);
    mesh(scene, box(OD, RH, 0.1), offWall, OX, RH / 2, dz - OW / 2);
    mesh(scene, box(OD, RH, 0.1), offWall, OX, RH / 2, dz + OW / 2);
    mesh(scene, box(OD, 0.05, OW), ceilingMat, OX, RH, dz);
    mesh(scene, box(1.2, 0.025, 0.6), panelMat, OX, RH - 0.03, dz);
    const DX = X0 - 2.6;
    mesh(scene, box(0.75, 0.04, 1.6), wood, DX, 0.74, dz, 'both');
    mesh(scene, box(0.7, 0.72, 0.04), wood, DX, 0.36, dz - 0.76);
    mesh(scene, box(0.7, 0.72, 0.04), wood, DX, 0.36, dz + 0.76);
    mesh(scene, rbox(0.03, 0.34, 0.56, 0.008), darkPlastic, DX - 0.25, 1.0, dz, 'cast');
    mesh(scene, new THREE.PlaneGeometry(0.53, 0.3), new THREE.MeshStandardMaterial({ color: '#000', emissive: '#fff', emissiveMap: monitorTex[0], emissiveIntensity: 0.6 }), DX - 0.234, 1.0, dz).rotation.y = Math.PI / 2;
    mesh(scene, box(0.04, 0.2, 0.03), blackMetal, DX - 0.27, 0.84, dz);
    mesh(scene, box(0.14, 0.02, 0.42), darkPlastic, DX + 0.05, 0.77, dz);
    mesh(scene, box(0.45, 1.3, 0.6), std('#9aa1a3', 0.5, 0.4), X0 - 0.4, 0.65, dz + OW / 2 - 0.4, 'both');     // filing cabinet
    for (let i = 0; i < 4; i++) mesh(scene, box(0.01, 0.02, 0.18), chrome, X0 - 0.17, 0.25 + i * 0.32, dz + OW / 2 - 0.4);
    mesh(scene, box(0.3, 1.6, 1.0), std('#2a2c30', 0.6), X0 - OD + 0.2, 0.8, dz - 1.1, 'both');            // dark shelf
    for (let i = 0; i < 4; i++) mesh(scene, box(0.22, 0.25, 0.8), std(['#c9a227', '#1f3a5a', '#7b2d26', '#e8dfc8'][i], 0.8), X0 - OD + 0.24, 0.35 + i * 0.38, dz - 1.1);
    mesh(scene, box(0.02, 0.62, 1.1), std('#ffffff', 0.6), X0 - OD + 0.06, 1.95, dz + 0.2);
    mesh(scene, new THREE.PlaneGeometry(0.95, 0.34), plaqueMat, X0 - OD + 0.072, 1.98, dz + 0.2).rotation.y = Math.PI / 2;
    ['#00629b', '#c9a227', '#2f5d3a'].forEach((col, i) => {
      mesh(scene, box(0.45, 0.6, 0.02), std(col, 0.8), OX - 0.6 + i * 0.6, 1.75, dz - OW / 2 + 0.06);
    });
  }

  // ─── the hero bench items ────────────────────────────────
  const bench = new THREE.Group();
  bench.position.set(0, 0, BENCH_Z);
  scene.add(bench);

  // ── 80s terminal ──
  const term = new THREE.Group();
  term.position.set(-0.62, BENCH_Y, -0.08);
  bench.add(term);
  mesh(term, rbox(0.5, 0.06, 0.42, 0.02), beigeDark, 0, 0.03, 0, 'both');
  mesh(term, rbox(0.48, 0.4, 0.4, 0.03), beige, 0, 0.26, 0, 'both');
  mesh(term, rbox(0.36, 0.3, 0.26, 0.04), beige, 0, 0.25, -0.24, 'cast');
  mesh(term, rbox(0.42, 0.33, 0.02, 0.015), darkPlastic, 0, 0.27, 0.196);
  for (let i = 0; i < 6; i++) mesh(term, box(0.005, 0.012, 0.22), darkPlastic, 0.242, 0.18 + i * 0.03, -0.02);
  const termScreen = new TerminalScreen();
  const termTex = texFrom(termScreen.canvas);
  const termMat = new THREE.MeshStandardMaterial({
    color: '#050806', roughness: 0.6, metalness: 0, emissive: '#ffffff', emissiveMap: termTex, emissiveIntensity: 1.15, envMapIntensity: 0.25,
  });
  mesh(term, crtGeometry(0.37, 0.278, 0.012), termMat, 0, 0.27, 0.208);
  const ledMat = new THREE.MeshBasicMaterial({ color: '#1a3a22' });
  mesh(term, new THREE.SphereGeometry(0.006, 10, 10), ledMat, 0.19, 0.085, 0.205);
  const badgeTex = canvasTex(256, 32, (ctx) => {
    ctx.fillStyle = '#d9ceb2'; ctx.fillRect(0, 0, 256, 32);
    ctx.fillStyle = '#5b5446'; ctx.font = 'bold 18px monospace'; ctx.textBaseline = 'middle';
    ctx.fillText('GARAGE TERMINAL  2600', 6, 17);
  });
  mesh(term, new THREE.PlaneGeometry(0.16, 0.02), new THREE.MeshStandardMaterial({ map: badgeTex, roughness: 0.6 }), -0.11, 0.084, 0.2015);
  const kb = new THREE.Group();
  kb.position.set(-0.62, BENCH_Y, 0.28);
  kb.rotation.x = 0.08;
  bench.add(kb);
  mesh(kb, rbox(0.5, 0.035, 0.18, 0.01), beige, 0, 0.018, 0, 'both');
  {
    const keyGeo = rbox(0.024, 0.012, 0.024, 0.003);
    const keys = new THREE.InstancedMesh(keyGeo, keyMat, 75);
    const dark = new THREE.InstancedMesh(keyGeo, keyDark, 12);
    const m = new THREE.Matrix4();
    let k = 0, d = 0;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 15; c++) {
      m.makeTranslation(-0.2 + c * 0.0285 + (r % 2) * 0.008, 0.04, -0.06 + r * 0.03);
      if ((c === 0 || c === 14) && d < 12) dark.setMatrixAt(d++, m); else keys.setMatrixAt(k++, m);
    }
    keys.count = k; dark.count = d;
    keys.castShadow = true;
    kb.add(keys, dark);
    mesh(kb, rbox(0.2, 0.012, 0.024, 0.003), keyMat, -0.02, 0.04, 0.095);
  }

  // ── oscilloscope ──
  const PW = 0.37, PH = 0.17;
  const scope = new THREE.Group();
  scope.position.set(0.25, BENCH_Y, -0.14);
  bench.add(scope);
  const scopeTilt = new THREE.Group();          // propped up on its handle
  scopeTilt.position.set(0, 0.03, 0.2);
  scopeTilt.rotation.x = -0.09;
  scope.add(scopeTilt);
  const body = new THREE.Group();
  body.position.set(0, 0.09, -0.2);
  scopeTilt.add(body);
  mesh(body, rbox(0.39, 0.19, 0.44, 0.012), std('#b5bcbf', 0.45, 0.35), 0, 0, 0, 'both');
  mesh(body, rbox(0.4, 0.2, 0.03, 0.01), std('#5c666c', 0.5, 0.3), 0, 0, 0.205, 'cast');     // front trim ring
  for (let i = 0; i < 9; i++) mesh(body, box(0.25, 0.004, 0.006), darkPlastic, 0, 0.096, -0.18 + i * 0.03);  // top vents
  const panelTex = texFrom(scopePanelTexture(PW));
  mesh(body, new THREE.PlaneGeometry(PW, PH), new THREE.MeshStandardMaterial({ map: panelTex, roughness: 0.55, metalness: 0.1 }), 0, 0, 0.2215);
  const P = (u: number, vv: number) => v(-PW / 2 + u * PW, PH / 2 - vv * PH, 0.222);
  // CRT
  const scrW = (SCOPE_SCREEN.u1 - SCOPE_SCREEN.u0) * PW, scrH = (SCOPE_SCREEN.v1 - SCOPE_SCREEN.v0) * PH;
  const scrC = P((SCOPE_SCREEN.u0 + SCOPE_SCREEN.u1) / 2, (SCOPE_SCREEN.v0 + SCOPE_SCREEN.v1) / 2);
  const scopeScreen = new ScopeScreen();
  const scopeTex = texFrom(scopeScreen.canvas);
  mesh(body, crtGeometry(scrW, scrH, 0.003), new THREE.MeshStandardMaterial({
    color: '#020604', roughness: 0.45, emissive: '#ffffff', emissiveMap: scopeTex, emissiveIntensity: 1.1, envMapIntensity: 0.3,
  }), scrC.x, scrC.y, scrC.z - 0.001);
  const filterFrame = std('#26303a', 0.5);
  mesh(body, box(scrW + 0.012, 0.006, 0.008), filterFrame, scrC.x, scrC.y + scrH / 2 + 0.003, scrC.z + 0.003);
  mesh(body, box(scrW + 0.012, 0.006, 0.008), filterFrame, scrC.x, scrC.y - scrH / 2 - 0.003, scrC.z + 0.003);
  mesh(body, box(0.006, scrH, 0.008), filterFrame, scrC.x - scrW / 2 - 0.003, scrC.y, scrC.z + 0.003);
  mesh(body, box(0.006, scrH, 0.008), filterFrame, scrC.x + scrW / 2 + 0.003, scrC.y, scrC.z + 0.003);
  // knobs, placed from the same table the panel art uses
  const knobBody = std('#2b2d31', 0.42, 0.1);
  const knobSkirt = std('#3d4248', 0.4, 0.2);
  const knobCap = std('#8f959b', 0.45, 0.6);
  for (const k of SCOPE_KNOBS) {
    const c = P(k.u, k.v);
    if (k.kind === 'bnc') {
      mesh(body, cyl(k.r, 0.006, 20), chrome, c.x, c.y, c.z + 0.003).rotation.x = Math.PI / 2;
      mesh(body, cyl(k.r * 0.75, 0.016, 20), chrome, c.x, c.y, c.z + 0.009).rotation.x = Math.PI / 2;
      mesh(body, cyl(k.r * 0.3, 0.002, 12), darkPlastic, c.x, c.y, c.z + 0.0175).rotation.x = Math.PI / 2;
      continue;
    }
    if (k.kind === 'button') {
      mesh(body, box(k.r * 2.4, k.r * 1.6, 0.008), std('#e8eaec', 0.4), c.x, c.y, c.z + 0.004);
      continue;
    }
    const big = k.kind === 'big';
    const depth = big ? 0.016 : 0.012;
    if (big) mesh(body, cyl(k.r * 1.12, 0.004, 32), knobSkirt, c.x, c.y, c.z + 0.002).rotation.x = Math.PI / 2;
    mesh(body, cyl(k.r * 0.86, depth, 28, k.r), knobBody, c.x, c.y, c.z + depth / 2, 'cast').rotation.x = Math.PI / 2;
    mesh(body, cyl(k.r * 0.5, 0.002, 20), knobCap, c.x, c.y, c.z + depth + 0.001).rotation.x = Math.PI / 2;
    // white pointer line
    const a = (Math.random() - 0.5) * 2.4;
    const ptr = mesh(body, box(0.0012, k.r * 0.6, 0.001), std('#ffffff', 0.4), c.x - Math.sin(a) * k.r * 0.55, c.y + Math.cos(a) * k.r * 0.55, c.z + depth + 0.0022);
    ptr.rotation.z = a;
  }
  for (let i = 0; i < 4; i++) {
    const c = P(0.47 + i * 0.065, 0.62);
    mesh(body, box(0.009, 0.005, 0.006), std('#e8eaec', 0.4), c.x, c.y, c.z + 0.003);
  }
  // carrying handle: hubs on the sides, arms down to a bar under the front
  const handleMat = std('#3c4248', 0.5, 0.3);
  for (const s of [-1, 1]) {
    mesh(body, cyl(0.026, 0.018, 24), handleMat, s * 0.204, 0.0, 0.02).rotation.z = Math.PI / 2;
    mesh(body, box(0.012, 0.022, 0.25), handleMat, s * 0.214, -0.07, 0.13, 'cast').rotation.x = 0.55;
  }
  mesh(body, cyl(0.011, 0.44, 16), handleMat, 0, -0.135, 0.235, 'cast').rotation.z = Math.PI / 2;
  for (const fx of [-0.15, 0.15]) mesh(body, cyl(0.014, 0.014, 12), darkPlastic, fx, -0.1, -0.17);

  // ── PCB being probed ──
  const pcb = new THREE.Group();
  pcb.position.set(0.68, BENCH_Y, 0.27);
  pcb.rotation.y = -0.25;
  bench.add(pcb);
  const pcbArt = canvasTex(512, 320, (ctx) => {
    ctx.fillStyle = '#1b6b3a'; ctx.fillRect(0, 0, 512, 320);
    ctx.strokeStyle = '#2b8a50'; ctx.lineWidth = 5;
    for (let i = 0; i < 26; i++) {
      ctx.beginPath();
      let x = Math.random() * 512, y = Math.random() * 320;
      ctx.moveTo(x, y);
      for (let s = 0; s < 3; s++) { if (s % 2) x = Math.random() * 512; else y = Math.random() * 320; ctx.lineTo(x, y); }
      ctx.stroke();
    }
    ctx.fillStyle = '#d6a447';
    for (let i = 0; i < 70; i++) { ctx.beginPath(); ctx.arc(Math.random() * 512, Math.random() * 320, 4, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#f0f0f0'; ctx.font = 'bold 22px Arial';
    ctx.fillText('IEEE SJSU  ECG v2', 20, 300);
    ctx.fillText('U1', 160, 120); ctx.fillText('J1', 280, 250);
  });
  mesh(pcb, box(0.16, 0.0032, 0.1), std('#ffffff', 0.45, 0.05, { map: pcbArt }), 0, 0.004, 0, 'both');
  mesh(pcb, box(0.03, 0.004, 0.03), darkPlastic, -0.02, 0.0075, 0, 'cast');
  mesh(pcb, box(0.016, 0.0035, 0.01), darkPlastic, 0.035, 0.0072, -0.025, 'cast');
  mesh(pcb, box(0.06, 0.009, 0.0085), darkPlastic, 0.02, 0.01, 0.038, 'cast');
  for (let i = 0; i < 8; i++) mesh(pcb, box(0.0016, 0.012, 0.0016), std('#d4a64a', 0.3, 0.9), -0.006 + i * 0.0072, 0.016, 0.038);
  for (const [x, z] of [[0.06, -0.03], [-0.055, 0.03]]) {
    mesh(pcb, cyl(0.0055, 0.014, 14), std('#2e57c4', 0.4), x, 0.012, z, 'cast');
    mesh(pcb, cyl(0.0055, 0.0008, 14), chrome, x, 0.0193, z);
  }

  // ── multimeter ──
  const meter = new THREE.Group();
  meter.position.set(0.94, BENCH_Y, 0.2);
  meter.rotation.set(0, -0.35, 0);
  bench.add(meter);
  const mb = new THREE.Group();
  mb.position.set(0, 0.035, 0);
  mb.rotation.x = -1.18;          // leaning back on its kickstand
  meter.add(mb);
  const MW = 0.082, MH = 0.172;
  mesh(mb, rbox(0.1, 0.195, 0.045, 0.016), std('#f0b915', 0.7), 0, 0, 0, 'both');
  mesh(mb, rbox(0.092, 0.186, 0.01, 0.01), std('#d9a40f', 0.7), 0, 0, 0.022);
  const faceTex = texFrom(meterFaceTexture());
  mesh(mb, new THREE.PlaneGeometry(MW, MH), new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.55 }), 0, 0, 0.0275);
  const M = (u: number, vv: number) => v(-MW / 2 + u * MW, MH / 2 - vv * MH, 0.028);
  const meterScreen = new MeterScreen();
  const meterTex = texFrom(meterScreen.canvas);
  const lcdC = M((METER_LCD.u0 + METER_LCD.u1) / 2, (METER_LCD.v0 + METER_LCD.v1) / 2);
  mesh(mb, new THREE.PlaneGeometry((METER_LCD.u1 - METER_LCD.u0) * MW, (METER_LCD.v1 - METER_LCD.v0) * MH), new THREE.MeshStandardMaterial({
    map: meterTex, roughness: 0.2, emissive: '#ffffff', emissiveMap: meterTex, emissiveIntensity: 0.07,
  }), lcdC.x, lcdC.y, lcdC.z + 0.0004);
  const dialC = M(METER_DIAL.u, METER_DIAL.v);
  const dialR = METER_DIAL.r * MW;
  mesh(mb, cyl(dialR, 0.008, 40), std('#26282c', 0.45), dialC.x, dialC.y, dialC.z + 0.004, 'cast').rotation.x = Math.PI / 2;
  mesh(mb, rbox(dialR * 0.45, dialR * 1.9, 0.012, 0.003), std('#1d1f22', 0.45), dialC.x, dialC.y, dialC.z + 0.012, 'cast').rotation.z = -0.95;
  const ptrDot = mesh(mb, box(0.003, 0.008, 0.001), std('#ffffff', 0.4), dialC.x + Math.sin(0.95) * dialR * 0.75, dialC.y + Math.cos(0.95) * dialR * 0.75, dialC.z + 0.0185);
  ptrDot.rotation.z = -0.95;
  const jackPos: THREE.Vector3[] = [];
  for (const j of METER_JACKS) {
    const c = M(j.u, METER_JACK_V);
    mesh(mb, cyl(0.0065, 0.004, 20), std(j.color === '#141416' ? '#3a3d42' : j.color, 0.4), c.x, c.y, c.z + 0.002).rotation.x = Math.PI / 2;
    mesh(mb, cyl(0.003, 0.001, 12), std('#050505', 0.5), c.x, c.y, c.z + 0.0042).rotation.x = Math.PI / 2;
    jackPos.push(c);
  }
  // test leads plugged into COM and VΩmA
  for (const [c, mat] of [[jackPos[1], blackWire], [jackPos[2], redWire]] as [THREE.Vector3, THREE.Material][]) {
    mesh(mb, cyl(0.0055, 0.03, 14, 0.0065), mat, c.x, c.y, c.z + 0.016, 'cast').rotation.x = Math.PI / 2;
  }

  // leads + probes
  scene.updateMatrixWorld(true);
  const plugEnd = (c: THREE.Vector3) => mb.localToWorld(v(c.x, c.y, c.z + 0.032));
  const pcbPoint = (x: number, z: number) => pcb.localToWorld(v(x, 0.004, z));
  const lead = (from: THREE.Vector3, to: THREE.Vector3, mat: THREE.Material, sag: number) => {
    const tipStart = to.clone().add(v(0.01, 0.045, 0.035));
    const handleTop = tipStart.clone().add(v(0.012, 0.05, 0.04));
    const a = from.clone().lerp(handleTop, 0.3); a.y = BENCH_Y + 0.004; a.x += sag * 0.5;
    const b = from.clone().lerp(handleTop, 0.7); b.y = BENCH_Y + 0.004; b.x += sag;
    const curve = new THREE.CatmullRomCurve3([from, from.clone().add(v(0, 0.01, 0.03)), a, b, handleTop.clone().add(v(0.01, 0.01, 0.03)), handleTop]);
    mesh(scene, new THREE.TubeGeometry(curve, 60, 0.0024, 8), mat, 0, 0, 0, 'cast');
    // probe handle with finger guard, then the metal tip
    const q = new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), to.clone().sub(handleTop).normalize());
    const handle = mesh(scene, cyl(0.0042, handleTop.distanceTo(tipStart), 14, 0.005), mat, 0, 0, 0, 'cast');
    handle.position.copy(handleTop.clone().lerp(tipStart, 0.5));
    handle.quaternion.copy(q);
    const guard = mesh(scene, cyl(0.007, 0.003, 16), mat);
    guard.position.copy(tipStart);
    guard.quaternion.copy(q);
    const tip = mesh(scene, cyl(0.0006, tipStart.distanceTo(to), 6, 0.0012), chrome);
    tip.position.copy(tipStart.clone().lerp(to, 0.5));
    tip.quaternion.copy(q);
  };
  lead(plugEnd(jackPos[2]), pcbPoint(0.045, 0.038), redWire, 0.05);
  lead(plugEnd(jackPos[1]), pcbPoint(-0.072, 0.042), blackWire, -0.05);

  // scope probe from CH 1 to the board
  {
    const ch1 = SCOPE_KNOBS.find((k) => k.label === 'CH 1')!;
    const from = body.localToWorld(P(ch1.u, ch1.v).add(v(0, 0, 0.02)));
    const to = pcb.localToWorld(v(-0.02, 0.012, 0.0));
    const curve = new THREE.CatmullRomCurve3([from, from.clone().add(v(0, -0.03, 0.08)), v(0.48, BENCH_Y + 0.005, BENCH_Z + 0.32), to.clone().add(v(-0.04, 0.04, 0.03))]);
    mesh(scene, new THREE.TubeGeometry(curve, 60, 0.0028, 8), std('#3a3c40', 0.5), 0, 0, 0, 'cast');
    const probeTip = mesh(scene, cyl(0.004, 0.05, 12, 0.0055), std('#3a3c40', 0.5), 0, 0, 0, 'cast');
    probeTip.position.copy(to.clone().add(v(-0.02, 0.02, 0.015)));
    probeTip.lookAt(to);
    probeTip.rotateX(Math.PI / 2);
  }

  // bench clutter: mug, solder spool, notebook, soldering iron stand
  mesh(bench, cyl(0.04, 0.1, 24, 0.036), std('#e9e4da', 0.35), -0.15, BENCH_Y + 0.05, 0.3, 'both');
  mesh(bench, new THREE.TorusGeometry(0.028, 0.01, 12, 24), std('#bcbec2', 0.3, 0.8), 0.48, BENCH_Y + 0.012, 0.36).rotation.x = Math.PI / 2;
  mesh(bench, box(0.21, 0.012, 0.28), std('#2b4a7a', 0.8), 1.3, BENCH_Y + 0.006, 0.12, 'both').rotation.y = 0.2;
  mesh(bench, rbox(0.12, 0.05, 0.16, 0.01), std('#2d3035', 0.5), -1.25, BENCH_Y + 0.025, 0.1, 'both');
  mesh(bench, cyl(0.004, 0.18, 10), chrome, -1.25, BENCH_Y + 0.11, 0.08).rotation.z = 0.9;

  // ─── state + render loop ─────────────────────────────────
  let progress = 0;
  let pointerX = 0, pointerY = 0, px = 0, py = 0;
  let dayTarget = 0, day = 0;
  let poweredAt = -1;            // terminal (home) / projector (events)
  let running = false;
  let raf = 0;
  let lastScopeDraw = 0, lastMeterDraw = 0, lastTermDraw = -1;
  const camPos = SHOTS[0].pos.clone();
  const camTarget = SHOTS[0].target.clone();
  let camShift = 0;
  let firstFrame = true;

  const lerpShot = (p: number) => {
    const i = Math.min(Math.floor(p), SHOTS.length - 2);
    const f = THREE.MathUtils.clamp(p - i, 0, 1);
    const t = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((f - 0.15) / 0.7, 0, 1), 0, 1);
    const a = SHOTS[i], b = SHOTS[i + 1];
    return {
      pos: a.pos.clone().lerp(b.pos, t),
      target: a.target.clone().lerp(b.target, t),
      fit: THREE.MathUtils.lerp(a.fit, b.fit, t),
      shift: THREE.MathUtils.lerp(a.shift, b.shift, t),
    };
  };

  const frame = () => {
    raf = 0;
    if (!running) return;
    const now = performance.now() / 1000;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    const aspect = width / Math.max(1, height);
    const portrait = aspect < 0.9;

    // camera: ease toward the shot for the current scroll position, pulling
    // back on narrow screens so `fit` meters stay in frame (within reason)
    const shot = lerpShot(progress);
    const dir = shot.pos.clone().sub(shot.target);
    const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect;
    const need = Math.min(shot.fit / 2 / tanH, dir.length() * 1.6);
    const pulled = need > dir.length();
    if (pulled) dir.setLength(need);
    // when pulling back for a narrow screen, never back out through a wall
    const desired = shot.target.clone().add(dir);
    if (pulled) desired.set(THREE.MathUtils.clamp(desired.x, X0 + 0.3, X1 - 0.3), Math.min(desired.y, RH - 0.15), THREE.MathUtils.clamp(desired.z, Z0 + 0.6, Z1 - 0.3));
    const k = firstFrame ? 1 : 0.07;
    camPos.lerp(desired, k);
    camTarget.lerp(shot.target, k);
    camShift += (shot.shift - camShift) * k;
    firstFrame = false;

    px += (pointerX - px) * 0.05;
    py += (pointerY - py) * 0.05;
    const right = new THREE.Vector3().crossVectors(dir, camera.up).normalize().negate();
    const sway = Math.min(dir.length(), 3) * 0.03;
    camera.position.copy(camPos).addScaledVector(right, px * sway).addScaledVector(camera.up, -py * sway * 0.6);
    camera.lookAt(camTarget);
    // move the subject aside for the text panel: right on desktop, up on
    // phones (the panel sits at the bottom there)
    if (portrait) camera.setViewOffset(width, height, 0, camShift * height * 0.2, width, height);
    else camera.setViewOffset(width, height, -camShift * width * 0.2, 0, width, height);

    // day / night
    day += (dayTarget - day) * 0.06;
    hemi.intensity = THREE.MathUtils.lerp(0.1, 0.55, day);
    keyLight.intensity = THREE.MathUtils.lerp(0.18, 1.5, day);
    windowLight.intensity = THREE.MathUtils.lerp(0.45, 0.8, day);
    windowLight.color.set('#9db4ff').lerp(new THREE.Color('#fff6ea'), day);
    fills.forEach((l) => { l.intensity = THREE.MathUtils.lerp(0, 3.5, day); });
    panelMat.emissiveIntensity = THREE.MathUtils.lerp(0.03, 0.9, day);
    blindMat.emissiveIntensity = THREE.MathUtils.lerp(0.03, 0.22, day);
    skyMat.color.set('#0d1a33').lerp(new THREE.Color('#d8e9ff'), day);
    scene.environmentIntensity = THREE.MathUtils.lerp(0.14, 0.45, day);
    if (bloom) bloom.strength = THREE.MathUtils.lerp(0.28, 0, day);   // glow is a night thing
    (scene.background as THREE.Color).copy(NIGHT_BG).lerp(DAY_BG, day);
    renderer.toneMappingExposure = THREE.MathUtils.lerp(1.2, 0.95, day);

    // screens
    const tPower = poweredAt < 0 ? -1 : now - poweredAt;
    // home boots the terminal; on the events page it's already on
    const tOn = tour === 'home' ? tPower : 30;
    const termOn = tOn >= 0.45;
    if (tour === 'events') {
      const k2 = THREE.MathUtils.clamp((tPower - 0.3) / 0.6, 0, 1);
      beamMat.opacity = k2 * THREE.MathUtils.lerp(0.28, 0.1, day) * (0.97 + Math.random() * 0.03);
      projMat.emissiveIntensity = k2 * THREE.MathUtils.lerp(1.0, 0.85, day);
      lensMat.color.set(k2 > 0 ? '#dfe9ff' : '#1a1d22');
      if (tPower >= 0) {
        projScreen.draw(tPower);
        projTex.needsUpdate = true;
      }
    }
    if (tOn < 6 || now - lastTermDraw > 0.08) {
      termScreen.draw(tOn);
      termTex.needsUpdate = true;
      lastTermDraw = now;
    }
    terminalGlow.intensity = termOn ? THREE.MathUtils.lerp(0.18, 0.05, day) * (0.92 + Math.random() * 0.08) : 0;
    ledMat.color.set(termOn ? '#3dff7e' : '#1a3a22');
    if (now - lastScopeDraw > 1 / 30) {
      scopeScreen.draw(now);
      scopeTex.needsUpdate = true;
      lastScopeDraw = now;
    }
    scopeGlow.intensity = THREE.MathUtils.lerp(0.15, 0.03, day);
    if (now - lastMeterDraw > 0.3) {
      meterScreen.draw(now);
      meterTex.needsUpdate = true;
      lastMeterDraw = now;
    }

    if (composer) composer.render(); else renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };

  const api: GarageScene = {
    setProgress(p) { progress = THREE.MathUtils.clamp(p, 0, SHOTS.length - 1); },
    setPointer(x, y) { pointerX = x; pointerY = y; },
    setDay(d) { dayTarget = d ? 1 : 0; },
    snapDay(d) { dayTarget = day = d ? 1 : 0; },
    powerOn(skipBoot) { poweredAt = performance.now() / 1000 - (skipBoot ? 30 : 0); },
    resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      composer?.setPixelRatio(renderer.getPixelRatio());
      composer?.setSize(w, h);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    },
    start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } },
    stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; },
    dispose() {
      api.stop();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        mats.forEach((mat) => {
          Object.values(mat).forEach((val) => { if (val instanceof THREE.Texture) val.dispose(); });
          mat.dispose();
        });
      });
      skirtCache.clear();
      projScreen.dispose();
      scene.environment?.dispose();
      pmrem.dispose();
      composer?.dispose();
      renderer.dispose();
    },
  };
  api.resize();
  return api;
}
