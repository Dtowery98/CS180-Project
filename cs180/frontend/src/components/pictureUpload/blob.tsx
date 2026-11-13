"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import * as THREE from "three";

type SlimeOrbProps = {
  src: string;
  cutout?: boolean;
  thickness?: number;
  stiffness?: number;
  damping?: number;
  orbSize?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * <SlimeOrb src="/orb.png" style={{ width: 420, height: 420 }} />
 *
 * A flat orb that behaves like slime when you hover, touch or drag it.
 * It has a plus-shaped cutout, a beveled edge and a layered "thickness".
 *
 * Give it ONE image: an orb on a transparent background (PNG/WebP). It is
 * auto-cropped, so extra empty space around the orb is fine.
 * The image must be same-origin or served with CORS headers, because the
 * component reads its pixels to build the bevel lighting.
 *
 * Props
 *   src         image URL (required)
 *   cutout      plus-shaped hole, default true
 *   thickness   side-wall depth, 0 = flat, default 1
 *   stiffness   spring strength, higher = firmer, default 34
 *   damping     lower = wobblier, default 2.4
 *   orbSize     orb diameter as a fraction of the box, default 0.78
 *   className, style   applied to the wrapper (it fills its parent by default)
 */

const TEX = 512; // baked texture resolution
const RINGS = 36;
const SEG = 96;
const DEPTH = 14; // stacked copies that fake thickness

// ---------------------------------------------------------------- baking
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error(`SlimeOrb: could not load ${src}`));
    im.src = src;
  });
}

// separable box blur; a few passes approximate a gaussian
function boxBlur(src: Float32Array, w: number, h: number, r: number, passes: number) {
  const a = Float32Array.from(src);
  const b = new Float32Array(src.length);
  const k = 1 / (2 * r + 1);
  const cl = (v: number, m: number) => (v < 0 ? 0 : v > m ? m : v);
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let acc = 0;
      for (let x = -r; x <= r; x++) acc += a[row + cl(x, w - 1)];
      for (let x = 0; x < w; x++) {
        b[row + x] = acc * k;
        acc += a[row + cl(x + r + 1, w - 1)] - a[row + cl(x - r, w - 1)];
      }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += b[cl(y, h - 1) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = acc * k;
        acc += b[cl(y + r + 1, h - 1) * w + x] - b[cl(y - r, h - 1) * w + x];
      }
    }
  }
  return a;
}

function toTexture(imageData: ImageData) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = TEX;
  const context = cv.getContext("2d");
  if (!context) throw new Error("SlimeOrb: 2D canvas is unavailable");
  context.putImageData(imageData, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.premultiplyAlpha = true; // clean edges when the texture is filtered
  t.anisotropy = 8;
  return t;
}

// returns { baked, flat }: lit texture for the front face, plain colours for the side walls
function bake(img: HTMLImageElement, cutout: boolean) {
  // 1. crop to the opaque bounding box and make it square
  const sc = document.createElement("canvas");
  sc.width = img.naturalWidth;
  sc.height = img.naturalHeight;
  const sx = sc.getContext("2d", { willReadFrequently: true });
  if (!sx) throw new Error("SlimeOrb: 2D canvas is unavailable");
  sx.drawImage(img, 0, 0);
  const d = sx.getImageData(0, 0, sc.width, sc.height).data;
  let x0 = sc.width, y0 = sc.height, x1 = 0, y1 = 0;
  for (let y = 0; y < sc.height; y++) {
    for (let x = 0; x < sc.width; x++) {
      if (d[(y * sc.width + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < x0) { x0 = 0; y0 = 0; x1 = sc.width - 1; y1 = sc.height - 1; }
  const side = Math.max(x1 - x0 + 1, y1 - y0 + 1);
  const mx = (x0 + x1 + 1) / 2;
  const my = (y0 + y1 + 1) / 2;

  const c = document.createElement("canvas");
  c.width = c.height = TEX;
  const cx = c.getContext("2d", { willReadFrequently: true });
  if (!cx) throw new Error("SlimeOrb: 2D canvas is unavailable");
  cx.drawImage(sc, mx - side / 2, my - side / 2, side, side, 0, 0, TEX, TEX);

  // 2. punch the plus out of the alpha channel
  if (cutout) {
    const R = TEX / 2, L = 0.34 * R, T = 0.051 * R, cy = R - 0.015 * R;
    cx.globalCompositeOperation = "destination-out";
    cx.fillStyle = "#000";
    cx.fillRect(R - L, cy - T, 2 * L, 2 * T);
    cx.fillRect(R - T, cy - L, 2 * T, 2 * L);
    cx.globalCompositeOperation = "source-over";
  }

  // 3. height map from the blurred silhouette -> normals -> baked light
  const flat = cx.getImageData(0, 0, TEX, TEX);
  const px = flat.data;
  const N = TEX;
  const S = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) S[i] = px[i * 4 + 3] / 255;
  const H = boxBlur(S, N, N, 6, 3);
  const small = boxBlur(S, N, N, 1, 3);

  const baked = new ImageData(N, N);
  const ll = Math.hypot(-0.5, 0.6, 0.62);
  const lx = -0.5 / ll, ly = 0.6 / ll, lz = 0.62 / ll;
  const cl = (v: number, m: number) => (v < 0 ? 0 : v > m ? m : v);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const i = y * N + x;
      const gx = (H[y * N + cl(x + 1, N - 1)] - H[y * N + cl(x - 1, N - 1)]) * 0.5;
      const gy = -(H[cl(y + 1, N - 1) * N + x] - H[cl(y - 1, N - 1) * N + x]) * 0.5;
      let nx = -gx * 38, ny = -gy * 38, nz = 1;
      const ln = Math.hypot(nx, ny, nz);
      nx /= ln; ny /= ln; nz /= ln;
      let sh = nx * lx + ny * ly + nz * lz - lz;
      sh = sh > 0 ? sh * 1.9 : Math.max(sh * 1.5, -0.22); // shadow side never goes black
      sh *= Math.min(1, S[i]);
      const X = (x / (N - 1)) * 2 - 1, Y = 1 - (y / (N - 1)) * 2;
      const m = 1 + 0.1 * (-X * 0.45 + Y * 0.55) + sh;
      const rim = cl((S[i] - small[i]) * 2.2, 1) * cl(sh * 2 + 0.25, 1);
      for (let k = 0; k < 3; k++) {
        const v = px[i * 4 + k] * m + rim * 70;
        baked.data[i * 4 + k] = v < 0 ? 0 : v > 255 ? 255 : v;
      }
      baked.data[i * 4 + 3] = px[i * 4 + 3];
    }
  }
  return { baked: toTexture(baked), flat: toTexture(flat) };
}

// ------------------------------------------------------------- component
export default function SlimeOrb({
  src,
  cutout = true,
  thickness = 1,
  stiffness = 34,
  damping = 2.4,
  orbSize = 0.78,
  className,
  style,
}: SlimeOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const params = useRef({ thickness, stiffness, damping, orbSize });

  useEffect(() => {
    params.current = { thickness, stiffness, damping, orbSize };
  }, [thickness, stiffness, damping, orbSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let raf = 0;
    const cleanups: Array<() => void> = [];

    (async () => {
      let img;
      try {
        img = await loadImage(src);
      } catch (e) {
        console.error(e);
        return;
      }
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
      let W = 1, H = 1, S = 1; // S = orb radius in pixels
      const resize = () => {
        W = canvas.clientWidth || 1;
        H = canvas.clientHeight || 1;
        renderer.setSize(W, H, false);
        S = (Math.min(W, H) * params.current.orbSize) / 2;
        cam.left = -W / 2 / S; cam.right = W / 2 / S;
        cam.top = H / 2 / S; cam.bottom = -H / 2 / S;
        cam.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);
      resize();

      // disc mesh: centre vertex + concentric rings
      const N = 1 + RINGS * SEG;
      const id = (i: number, j: number) => (i === 0 ? 0 : 1 + (i - 1) * SEG + ((j % SEG) + SEG) % SEG);
      const rx = new Float32Array(N), ry = new Float32Array(N);
      const dx = new Float32Array(N), dy = new Float32Array(N);
      const vx = new Float32Array(N), vy = new Float32Array(N);
      const tx = new Float32Array(N), ty = new Float32Array(N);
      const tvx = new Float32Array(N), tvy = new Float32Array(N);
      const pos = new Float32Array(N * 3), uv = new Float32Array(N * 2);
      const nb: number[][] = [];
      for (let i = 0; i <= RINGS; i++) {
        for (let j = 0; j < (i ? SEG : 1); j++) {
          const k = id(i, j), r = i / RINGS, a = (j / SEG) * Math.PI * 2;
          rx[k] = r * Math.cos(a); ry[k] = r * Math.sin(a);
          uv[k * 2] = rx[k] * 0.5 + 0.5; uv[k * 2 + 1] = ry[k] * 0.5 + 0.5;
          const n = [];
          if (i === 0) for (let q = 0; q < SEG; q++) n.push(id(1, q));
          else {
            n.push(id(i, j - 1), id(i, j + 1), i === 1 ? 0 : id(i - 1, j));
            if (i < RINGS) n.push(id(i + 1, j));
          }
          nb[k] = n;
        }
      }
      const ix = [];
      for (let j = 0; j < SEG; j++) ix.push(0, id(1, j), id(1, j + 1));
      for (let i = 1; i < RINGS; i++) {
        for (let j = 0; j < SEG; j++) {
          const a = id(i, j), b = id(i, j + 1), c = id(i + 1, j), d = id(i + 1, j + 1);
          ix.push(a, c, b, b, c, d);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      geo.setIndex(ix);

      // textures + stacked layers (same deforming mesh, offset a little each)
      const { baked, flat } = bake(img, cutout);
      const mats: THREE.MeshBasicMaterial[] = [];
      const layers: Array<{ mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>; f: number }> = [];
      const addLayer = (map: THREE.Texture, shade: number, order: number) => {
        const m = new THREE.MeshBasicMaterial({
          map,
          color: new THREE.Color().setScalar(shade),
          transparent: true,
          depthTest: false,
          depthWrite: false,
          blending: THREE.CustomBlending, // textures are premultiplied
          blendSrc: THREE.OneFactor,
          blendDst: THREE.OneMinusSrcAlphaFactor,
        });
        mats.push(m);
        const mesh = new THREE.Mesh(geo, m);
        mesh.renderOrder = order;
        mesh.frustumCulled = false;
        scene.add(mesh);
        return mesh;
      };
      for (let i = DEPTH; i >= 0; i--) {
        const f = i / DEPTH;
        layers.push({ mesh: addLayer(i === 0 ? baked : flat, i === 0 ? 1 : 0.92 - 0.34 * f, -50 - i), f });
      }

      // pointer, in orb units (orb radius = 1)
      let px = 0, py = 0, pvx = 0, pvy = 0, active = false, down = false, lastT = 0;
      const toWorld = (e: PointerEvent): [number, number] => {
        const r = canvas.getBoundingClientRect();
        return [(e.clientX - r.left - r.width / 2) / S, -(e.clientY - r.top - r.height / 2) / S];
      };
      const onMove = (e: PointerEvent) => {
        const [x, y] = toWorld(e), t = performance.now();
        const dt = Math.max(0.008, (t - lastT) / 1000);
        if (active) { pvx = pvx * 0.5 + ((x - px) / dt) * 0.5; pvy = pvy * 0.5 + ((y - py) / dt) * 0.5; }
        px = x; py = y; lastT = t; active = true;
      };
      const onDown = (e: PointerEvent) => {
        [px, py] = toWorld(e); active = true; down = true; lastT = performance.now();
        canvas.setPointerCapture(e.pointerId);
      };
      const onUp = (e: PointerEvent) => { down = false; if (e.pointerType !== "mouse") active = false; };
      const onLeave = () => { if (!down) active = false; };
      const onCancel = () => { down = false; active = false; };
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("pointercancel", onCancel);

      // soft-body step: springs + pointer force + neighbour averaging for the gooey feel
      const RAD = 0.6;
      const step = (dt: number) => {
        const K = params.current.stiffness, C = params.current.damping;
        const att = down ? 70 : 20;
        for (let k = 0; k < N; k++) {
          const cx = rx[k] + dx[k], cy = ry[k] + dy[k];
          let fx = -K * dx[k] - C * vx[k], fy = -K * dy[k] - C * vy[k];
          if (active) {
            const ex = px - cx, ey = py - cy, d = Math.hypot(ex, ey);
            if (d < RAD) {
              let f = 1 - d / RAD; f *= f;
              fx += ex * att * f + (pvx - vx[k]) * 5 * f;
              fy += ey * att * f + (pvy - vy[k]) * 5 * f;
            }
          }
          vx[k] += fx * dt; vy[k] += fy * dt;
          dx[k] += vx[k] * dt; dy[k] += vy[k] * dt;
        }
        for (let k = 0; k < N; k++) {
          const n = nb[k], l = n.length;
          let ax = 0, ay = 0, bx = 0, by = 0;
          for (let q = 0; q < l; q++) { const m = n[q]; ax += dx[m]; ay += dy[m]; bx += vx[m]; by += vy[m]; }
          tx[k] = dx[k] + (ax / l - dx[k]) * 0.35; ty[k] = dy[k] + (ay / l - dy[k]) * 0.35;
          tvx[k] = vx[k] + (bx / l - vx[k]) * 0.2; tvy[k] = vy[k] + (by / l - vy[k]) * 0.2;
        }
        dx.set(tx); dy.set(ty); vx.set(tvx); vy.set(tvy);
        pvx *= 0.88; pvy *= 0.88;
      };

      // small wobble on mount so it reads as soft right away
      for (let k = 0; k < N; k++) { vx[k] = -0.9 * rx[k]; vy[k] = -0.9 * ry[k]; }

      let ox = 0.03, oy = -0.045, prev = performance.now(), acc = 0;
      const loop = (t: number) => {
        raf = requestAnimationFrame(loop);
        acc += Math.min(0.05, (t - prev) / 1000); prev = t;
        while (acc >= 1 / 120) { step(1 / 120); acc -= 1 / 120; }
        for (let k = 0; k < N; k++) { pos[k * 3] = rx[k] + dx[k]; pos[k * 3 + 1] = ry[k] + dy[k]; }
        geo.attributes.position.needsUpdate = true;
        // thickness direction follows the pointer a little
        const th = params.current.thickness;
        const tox = 0.03 - (active ? px * 0.035 : 0), toy = -0.045 - (active ? py * 0.035 : 0);
        ox += (tox - ox) * 0.08; oy += (toy - oy) * 0.08;
        for (const l of layers) l.mesh.position.set(ox * l.f * 2 * th, oy * l.f * 2 * th, 0);
        renderer.render(scene, cam);
      };
      raf = requestAnimationFrame(loop);

      cleanups.push(() => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointerleave", onLeave);
        canvas.removeEventListener("pointercancel", onCancel);
        geo.dispose();
        mats.forEach((m) => m.dispose());
        baked.dispose();
        flat.dispose();
        renderer.dispose();
      });
    })();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
    };
  }, [src, cutout]);

  return (
    <div className={className} style={{ width: "100%", height: "100%", ...style }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Soft slime orb that reacts to your pointer"
        style={{ display: "block", width: "100%", height: "100%", touchAction: "none" }}
      />
    </div>
  );
}
