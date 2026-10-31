import { useEffect, useMemo, useRef, useState } from 'react';
import { burst } from '../lib/burst.js';
import { chime, pop } from '../lib/sound.js';
import { Reveal } from './Effects.jsx';

/* ---------------- Balloons ---------------- */
const BALLOON_WISHES = [
  'May your year be full of laughter.',
  'May your days be filled with peace and good health.',
  'May every plan you make come true this year.',
  'May the love you gave us come back to you tenfold.',
  'May your home always be full of joy and good food.',
  'May you always find time for yourself, Mam.',
  'May every morning bring you a reason to smile.',
  'Thank you for being our mom away from home.',
];
const BALLOON_COLORS = ['#e8436f', '#f0a000', '#1d9a6c', '#6a5acd', '#ff7a1a', '#d81b60', '#2a9df4', '#e0b400'];

export function Balloons() {
  const [popped, setPopped] = useState([]);
  const [msg, setMsg] = useState('Your first wish is waiting inside a balloon.');
  const n = popped.length;

  const hit = (i) => {
    if (popped.includes(i)) return;
    pop();
    setPopped((p) => [...p, i]);
    setMsg(BALLOON_WISHES[i]);
    if (n + 1 === BALLOON_WISHES.length) {
      chime([523, 659, 784, 1047], 0.13);
      burst(140);
    }
  };
  const reset = () => {
    setPopped([]);
    setMsg('Your first wish is waiting inside a balloon.');
  };

  return (
    <section className="balloon-sec" id="balloons">
      <Reveal className="in">
        <div className="head">
          <p className="eyebrow">Pop the balloons</p>
          <h2>Eight wishes are hiding</h2>
          <p className="sub">Tap a balloon to find the wish inside.</p>
        </div>
        <div className="balloons">
          {BALLOON_COLORS.map((c, i) => (
            <button
              key={i}
              type="button"
              className={'balloon' + (popped.includes(i) ? ' pop' : '')}
              style={{ '--c': c, '--d': i }}
              disabled={popped.includes(i)}
              aria-label={`Balloon ${i + 1}`}
              onClick={() => hit(i)}
            >
              <span className="bl" />
              <span className="st" />
            </button>
          ))}
        </div>
        <div className="wishbox" aria-live="polite">
          <p className="cnt">{n === 8 ? 'You found all 8 wishes!' : `${n} of 8 wishes found`}</p>
          <p className="msg">{msg}</p>
        </div>
        <div className="row">
          <button className="btn2" type="button" onClick={reset}>Bring the balloons back</button>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- Flip cards ---------------- */
const REASONS = [
  ['You listen', 'You hear us out, even when we are not making sense.'],
  ['You care', 'You notice when something is wrong, before we say a word.'],
  ['You guide', 'You show us the way without ever making us feel small.'],
  ['You forgive', 'You give us another chance, every single time.'],
  ['You cheer for us', 'You are the first one to celebrate when we win.'],
  ['You are our mom', 'You make this place feel like home.'],
];

export function Flips() {
  const [on, setOn] = useState([]);
  const toggle = (i) => setOn((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));
  return (
    <section className="band-sec" id="reasons">
      <Reveal className="in">
        <div className="head">
          <p className="eyebrow">Tap to flip</p>
          <h2>Why we love you, Mam</h2>
          {on.length === REASONS.length && <p className="sub">You found every reason. There are many more, Mam.</p>}
        </div>
        <div className="flips">
          {REASONS.map(([t, back], i) => (
            <button key={t} className="flip" type="button" aria-pressed={on.includes(i)} onClick={() => toggle(i)}>
              <span className="cd">
                <span className="face fr"><span className="hint">Tap to flip</span><span className="ttl">{t}</span></span>
                <span className="face bk"><span className="tx">{back}</span></span>
              </span>
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- Memory match game ---------------- */
const ICONS = ['📚', '✏️', '🎂', '❤️', '🌟', '🌸'];

function shuffled() {
  const a = [...ICONS, ...ICONS].map((icon, id) => ({ id, icon }));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Memory() {
  const [deck, setDeck] = useState(shuffled);
  const [open, setOpen] = useState([]);
  const [done, setDone] = useState([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('subha-best')) || 0; } catch (e) { return 0; }
  });
  const lock = useRef(false);
  const won = done.length === deck.length;

  const flip = (i) => {
    if (lock.current || open.includes(i) || done.includes(i)) return;
    pop();
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      lock.current = true;
      const [a, b] = next;
      if (deck[a].icon === deck[b].icon) {
        setTimeout(() => {
          setDone((d) => [...d, a, b]);
          setOpen([]);
          lock.current = false;
          chime([659, 880], 0.1);
        }, 350);
      } else {
        setTimeout(() => {
          setOpen([]);
          lock.current = false;
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (!won) return;
    burst(150);
    setBest((b) => {
      const nb = b === 0 || moves < b ? moves : b;
      try { localStorage.setItem('subha-best', String(nb)); } catch (e) { /* ignore */ }
      return nb;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  const again = () => {
    setDeck(shuffled());
    setOpen([]);
    setDone([]);
    setMoves(0);
    lock.current = false;
  };

  return (
    <section className="game-sec" id="game">
      <Reveal className="in">
        <div className="head">
          <p className="eyebrow">A little game</p>
          <h2>Find the matching pairs</h2>
          <p className="sub">
            Moves: {moves}
            {best ? ` · Best: ${best}` : ''}
          </p>
        </div>
        <div className="memory" role="group" aria-label="Memory game">
          {deck.map((c, i) => {
            const shown = open.includes(i) || done.includes(i);
            return (
              <button
                key={c.id}
                type="button"
                className={'mem' + (shown ? ' shown' : '') + (done.includes(i) ? ' done' : '')}
                aria-label={shown ? c.icon : 'Hidden card'}
                onClick={() => flip(i)}
              >
                <span className="mi">{shown ? c.icon : ''}</span>
              </button>
            );
          })}
        </div>
        <p className="game-msg" aria-live="polite">
          {won ? `You matched them all in ${moves} moves. Well done, Mam!` : 'Flip two cards at a time.'}
        </p>
        <div className="row"><button className="btn2" type="button" onClick={again}>Shuffle and play again</button></div>
      </Reveal>
    </section>
  );
}
