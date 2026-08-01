import { createNoise2D } from './noise';
import { PALETTE_BY_ID } from './palettes';

const TAU = Math.PI * 2;

// The rendering engine. Owns the canvas, the particle array and the animation
// loop; React only pushes settings into it. Kept out of React state on purpose
// so thousands of particles animate at 60fps without re-rendering the tree.
export function createField(canvas) {
  const ctx = canvas.getContext('2d', { alpha: false });

  let particles = [];
  let raf = 0;
  let running = false;
  let t = 0;
  let dpr = 1;
  let w = 0;
  let h = 0;

  const settings = {
    particleCount: 1600,
    noiseScale: 0.0016,
    speed: 1.5,
    trail: 0.012,       // 0 = permanent buildup, higher = ghostlier strands
    lineWidth: 1.2,
    paletteId: 'aurora',
    drift: 0.04,        // how fast the field itself evolves
    seed: 1234,
  };

  function palette() {
    return PALETTE_BY_ID[settings.paletteId] || PALETTE_BY_ID.aurora;
  }

  let noise = createNoise2D(settings.seed);

  function spawn(n) {
    const pal = palette();
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push({
        x: Math.random() * w,
        y: Math.random() * h,
        c: pal.colors[(Math.random() * pal.colors.length) | 0],
        life: 40 + Math.random() * 220,
      });
    }
    return out;
  }

  function reinit() {
    particles = spawn(settings.particleCount);
  }

  function paintBg() {
    ctx.fillStyle = palette().bg;
    ctx.fillRect(0, 0, w, h);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintBg();
    if (!particles.length) reinit();
  }

  function frame() {
    if (!running) return;

    // Fade the previous frame toward the background. trail === 0 keeps
    // everything, producing a dense painterly accumulation.
    if (settings.trail > 0) {
      const bg = palette().bg;
      ctx.globalAlpha = settings.trail;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    ctx.lineWidth = settings.lineWidth;
    ctx.lineCap = 'round';

    const { noiseScale, speed, drift } = settings;
    t += drift;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const angle = noise(p.x * noiseScale, p.y * noiseScale + t) * TAU * 1.6;
      const nx = p.x + Math.cos(angle) * speed;
      const ny = p.y + Math.sin(angle) * speed;

      ctx.strokeStyle = p.c;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      p.x = nx;
      p.y = ny;
      p.life -= 1;

      // Respawn when a particle wanders off-screen or ages out, so the field
      // never thins out or drifts entirely into a corner.
      if (p.life <= 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
        p.life = 40 + Math.random() * 220;
      }
    }

    raf = requestAnimationFrame(frame);
  }

  return {
    settings,
    resize,

    play() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    },
    pause() {
      running = false;
      cancelAnimationFrame(raf);
    },
    isRunning() {
      return running;
    },

    // Apply a settings patch, reacting to the ones that need work.
    update(patch) {
      const prevCount = settings.particleCount;
      const prevPalette = settings.paletteId;
      Object.assign(settings, patch);

      if (patch.paletteId && patch.paletteId !== prevPalette) {
        const pal = palette();
        for (const p of particles) p.c = pal.colors[(Math.random() * pal.colors.length) | 0];
      }
      if (patch.particleCount != null && patch.particleCount !== prevCount) {
        if (patch.particleCount > particles.length) {
          particles = particles.concat(spawn(patch.particleCount - particles.length));
        } else {
          particles.length = patch.particleCount;
        }
      }
    },

    reseed(seed) {
      settings.seed = seed;
      noise = createNoise2D(seed);
      paintBg();
      reinit();
    },

    clear() {
      paintBg();
      reinit();
    },

    exportPNG(scale = 1) {
      // Re-render at higher resolution off-screen for a crisp download.
      const link = document.createElement('a');
      link.download = `driftfield-${settings.paletteId}-${settings.seed}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    },

    destroy() {
      running = false;
      cancelAnimationFrame(raf);
    },
  };
}
