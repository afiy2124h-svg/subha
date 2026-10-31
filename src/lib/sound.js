// Small sound effects made with the Web Audio API (no audio files needed).
// Browsers only allow sound after a tap, so every call here comes from a click.
let ctx = null;

function ac() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') ctx.resume();
  } catch (e) {
    return null;
  }
  return ctx;
}

export function pop() {
  const a = ac();
  if (!a) return;
  const len = Math.floor(a.sampleRate * 0.09);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const src = a.createBufferSource();
  const g = a.createGain();
  g.gain.value = 0.5;
  src.buffer = buf;
  src.connect(g);
  g.connect(a.destination);
  src.start();
}

export function chime(freqs = [523, 659, 784], gap = 0.12) {
  const a = ac();
  if (!a) return;
  freqs.forEach((f, i) => {
    const t = a.currentTime + i * gap;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.2, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(g);
    g.connect(a.destination);
    o.start(t);
    o.stop(t + 0.55);
  });
}

const HZ = { G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659, F5: 698, G5: 784 };
const SONG = [
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
  ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2],
];

// Plays the birthday tune and returns how many milliseconds it lasts.
export function birthdayTune() {
  const a = ac();
  if (!a) return 0;
  let t = a.currentTime + 0.05;
  const beat = 0.5;
  SONG.forEach(([note, beats]) => {
    const o = a.createOscillator();
    const g = a.createGain();
    const d = beats * beat;
    o.type = 'triangle';
    o.frequency.value = HZ[note];
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.22, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + d * 0.95);
    o.connect(g);
    g.connect(a.destination);
    o.start(t);
    o.stop(t + d);
    t += d;
  });
  return Math.ceil((t - a.currentTime) * 1000);
}
