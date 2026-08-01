# Driftfield

A generative flow-field studio. Thousands of particles drift along a
Perlin-noise vector field, tracing living art onto an HTML canvas. Pick a
palette, tune the field, seed it, and save your piece as a PNG.

**Live:** https://greenhugebrain.github.io/driftfield/

React and Vite, no dependencies beyond React. The noise function and the
rendering engine are written from scratch.

## How it works

- `src/noise.js` — a compact, seedable 2D simplex-noise implementation.
- `src/field.js` — the engine: owns the canvas, the particle array and the
  `requestAnimationFrame` loop. Kept entirely outside React state so thousands
  of particles animate at 60fps without ever re-rendering the component tree —
  React only pushes settings in.
- `src/App.jsx` — the controls; mirrors settings into React state for the UI
  and pushes changes down to the engine.

Each field is deterministic: the same seed always paints the same pattern, so a
piece you like can be reproduced exactly.

## Run locally

```bash
npm install
npm run dev
```

Built by [CodesMyth](https://codesmyth.dev).
