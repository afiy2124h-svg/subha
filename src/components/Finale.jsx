import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config.js';
import { Reveal } from './Effects.jsx';

const LINES = ['Your students felt every one of those.', 'Sent with all our hearts, Mam.', 'We love you too, Mam. Always.'];

export function Finale() {
  const layer = useRef(null);
  const [count, setCount] = useState(0);

  const send = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top;
    for (let i = 0; i < 14; i++) {
      const h = document.createElement('span');
      h.className = 'heart';
      h.textContent = '♥';
      h.style.left = cx + (Math.random() - 0.5) * r.width + 'px';
      h.style.top = cy + 'px';
      h.style.setProperty('--dx', (Math.random() - 0.5) * 120 + 'px');
      h.style.animationDelay = Math.random() * 0.35 + 's';
      h.style.fontSize = 18 + Math.random() * 16 + 'px';
      h.addEventListener('animationend', () => h.remove());
      layer.current.appendChild(h);
    }
    setCount((c) => c + 1);
  };

  return (
    <>
      <div id="hearts" ref={layer} aria-hidden="true" />
      <footer className="fin" id="love">
        <Reveal className="in">
          <p className="big">Happy Birthday,<br /><span>{CONFIG.name}!</span></p>
          <p className="love">With love, from all of your students.</p>
          <button className="btn" type="button" onClick={send}>Send love back</button>
          <p className="love-msg" aria-live="polite">{count ? LINES[(count - 1) % LINES.length] : ''}</p>
        </Reveal>
      </footer>
    </>
  );
}

/* Floating music button. It only appears when a song is set in config.js. */
export function Music({ autoStart }) {
  const audio = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const want = useRef(true);

  const play = () => {
    const a = audio.current;
    if (!a || !CONFIG.song) return;
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
  };

  // Start after the viewer's first tap (browsers block sound before that).
  useEffect(() => {
    if (!CONFIG.song) return undefined;
    const first = (e) => {
      if (e.target.closest && e.target.closest('#musicBtn')) return;
      if (want.current && audio.current && audio.current.paused) play();
      document.removeEventListener('pointerdown', first);
    };
    document.addEventListener('pointerdown', first);
    return () => document.removeEventListener('pointerdown', first);
  }, []);

  useEffect(() => {
    if (autoStart) play();
  }, [autoStart]);

  if (!CONFIG.song) return null;

  return (
    <>
      <audio
        ref={audio}
        src={CONFIG.song}
        loop
        preload="auto"
        onLoadedMetadata={() => setReady(true)}
        onError={() => setReady(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {ready && (
        <button
          id="musicBtn"
          type="button"
          className={'music' + (playing ? ' on' : '')}
          aria-pressed={playing}
          onClick={() => {
            const a = audio.current;
            if (a.paused) {
              want.current = true;
              play();
            } else {
              want.current = false;
              a.pause();
            }
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18V6l11-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="17.5" cy="16" r="2.5" />
          </svg>
          <span className="bars" aria-hidden="true"><i /><i /><i /></span>
          <span>{playing ? 'Pause music' : 'Play music'}</span>
        </button>
      )}
    </>
  );
}
