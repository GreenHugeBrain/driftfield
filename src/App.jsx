import { useEffect, useRef, useState } from 'react';
import { createField } from './field';
import { PALETTES } from './palettes';
import './styles.css';

const CONTROLS = [
  { key: 'particleCount', label: 'Particles', min: 200, max: 4000, step: 50, fmt: (v) => v },
  { key: 'noiseScale', label: 'Field scale', min: 0.0004, max: 0.005, step: 0.0001, fmt: (v) => v.toFixed(4) },
  { key: 'speed', label: 'Speed', min: 0.3, max: 4, step: 0.1, fmt: (v) => v.toFixed(1) },
  { key: 'trail', label: 'Fade', min: 0, max: 0.15, step: 0.005, fmt: (v) => v.toFixed(3) },
  { key: 'lineWidth', label: 'Stroke', min: 0.4, max: 3, step: 0.1, fmt: (v) => v.toFixed(1) },
  { key: 'drift', label: 'Evolve', min: 0, max: 0.2, step: 0.005, fmt: (v) => v.toFixed(3) },
];

const randomSeed = () => (Math.random() * 1e9) | 0;

export default function App() {
  const canvasRef = useRef(null);
  const fieldRef = useRef(null);

  const [settings, setSettings] = useState(null);
  const [running, setRunning] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);

  // Boot the engine once.
  useEffect(() => {
    const field = createField(canvasRef.current);
    fieldRef.current = field;
    field.resize();
    field.play();
    setSettings({ ...field.settings });
    setRunning(true);

    const onResize = () => field.resize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      field.destroy();
    };
  }, []);

  function patch(p) {
    fieldRef.current?.update(p);
    setSettings((s) => ({ ...s, ...p }));
  }

  function togglePlay() {
    const f = fieldRef.current;
    if (!f) return;
    if (f.isRunning()) {
      f.pause();
      setRunning(false);
    } else {
      f.play();
      setRunning(true);
    }
  }

  function reseed() {
    const seed = randomSeed();
    fieldRef.current?.reseed(seed);
    setSettings((s) => ({ ...s, seed }));
    if (!fieldRef.current?.isRunning()) {
      fieldRef.current?.play();
      setRunning(true);
    }
  }

  return (
    <div className="app">
      {/* One canvas, mounted for the engine's whole lifetime. The UI below
          only appears once settings are mirrored into React state. */}
      <canvas ref={canvasRef} className="stage" />

      {!settings ? null : (
       <>
      <header className="topbar">
        <div className="brand">
          <span className="logo" />
          Driftfield
          <span className="tag">generative flow-field studio</span>
        </div>
        <button
          className="panel-toggle"
          onClick={() => setPanelOpen((o) => !o)}
        >
          {panelOpen ? 'Hide' : 'Controls'}
        </button>
      </header>

      <aside className={`panel ${panelOpen ? '' : 'closed'}`}>
        <div className="palettes">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              className={`swatch ${settings.paletteId === p.id ? 'on' : ''}`}
              onClick={() => patch({ paletteId: p.id })}
              title={p.name}
            >
              <span className="dots">
                {p.colors.slice(0, 4).map((c, i) => (
                  <i key={i} style={{ background: c }} />
                ))}
              </span>
              <span className="swatch-name">{p.name}</span>
            </button>
          ))}
        </div>

        <div className="sliders">
          {CONTROLS.map((c) => (
            <label key={c.key} className="slider">
              <span className="slabel">
                {c.label}
                <em>{c.fmt(settings[c.key])}</em>
              </span>
              <input
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={settings[c.key]}
                onChange={(e) => patch({ [c.key]: Number(e.target.value) })}
              />
            </label>
          ))}
        </div>

        <div className="actions">
          <button className="btn" onClick={togglePlay}>
            {running ? '❚❚  Pause' : '►  Play'}
          </button>
          <button className="btn" onClick={reseed}>
            ⟳  New field
          </button>
          <button className="btn" onClick={() => fieldRef.current?.clear()}>
            Clear
          </button>
          <button className="btn primary" onClick={() => fieldRef.current?.exportPNG()}>
            ↓  Save PNG
          </button>
        </div>

        <p className="hint">
          Every field is seeded — <code>#{settings.seed}</code> paints this exact
          pattern. Tweak it, let it settle, then save.
        </p>
      </aside>

      <footer className="credit">
        Built with React &amp; canvas ·{' '}
        <a href="https://codesmyth.dev" target="_blank" rel="noreferrer">CodesMyth</a>
      </footer>
       </>
      )}
    </div>
  );
}
