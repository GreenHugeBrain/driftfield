// Curated palettes. Each is a small set of stroke colours plus a background.
// Particles pick a colour from `colors`, weighted evenly.

export const PALETTES = [
  {
    id: 'ember',
    name: 'Ember',
    bg: '#0b0a0f',
    colors: ['#ff7043', '#ffab40', '#ff5252', '#ffd180', '#f4511e'],
  },
  {
    id: 'aurora',
    name: 'Aurora',
    bg: '#04080c',
    colors: ['#38f9d7', '#43e97b', '#4facfe', '#00f2fe', '#a8ff78'],
  },
  {
    id: 'bloom',
    name: 'Bloom',
    bg: '#0d0710',
    colors: ['#ff6ec4', '#f093fb', '#c471ed', '#ff9a9e', '#fbc2eb'],
  },
  {
    id: 'ink',
    name: 'Ink',
    bg: '#f4f2ec',
    colors: ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#2b2b3a'],
  },
  {
    id: 'mono',
    name: 'Mono',
    bg: '#0a0a0a',
    colors: ['#ffffff', '#dcdcdc', '#9e9e9e', '#c7c7c7', '#efefef'],
  },
  {
    id: 'dusk',
    name: 'Dusk',
    bg: '#0a0713',
    colors: ['#7b4dff', '#4d79ff', '#b14dff', '#5d8bff', '#8f6bff'],
  },
  {
    id: 'reef',
    name: 'Reef',
    bg: '#02060a',
    colors: ['#00d2ff', '#3a7bd5', '#00b4db', '#48c6ef', '#6f86d6'],
  },
  {
    id: 'citrus',
    name: 'Citrus',
    bg: '#0c0b04',
    colors: ['#f9d423', '#ff4e50', '#fc913a', '#f9d62e', '#eae374'],
  },
];

export const PALETTE_BY_ID = Object.fromEntries(PALETTES.map((p) => [p.id, p]));
