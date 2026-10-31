import { useRef } from 'react';
import { CONFIG } from '../config.js';
import { burst } from '../lib/burst.js';

export function Garland() {
  // One long string of marigolds and leaves, drawn once in a fixed 1200-wide space.
  const w = 1200;
  const swags = 5;
  const segW = w / swags;
  const sag = 30;
  const top = 6;
  const n = 12;
  let path = '';
  const items = [];
  let i = 0;
  for (let s = 0; s < swags; s++) {
    const x0 = s * segW;
    path += `M${x0} ${top} Q${x0 + segW / 2} ${top + sag * 2} ${x0 + segW} ${top} `;
    for (let k = 0; k <= n; k++) {
      if (k === n && s < swags - 1) continue;
      const t = k / n;
      const x = x0 + t * segW;
      const y = top + 4 * sag * t * (1 - t);
      const slope = (4 * sag * (1 - 2 * t)) / segW;
      const ang = (Math.atan(slope) * 180) / Math.PI;
      items.push({ x, y, ang, i });
      i++;
    }
  }
  return (
    <div className="garland" aria-hidden="true">
      <svg viewBox="0 0 1200 72" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg">
        <path d={path} fill="none" style={{ stroke: 'var(--gold)' }} strokeWidth="1.5" />
        {items.map((p) =>
          p.i % 3 === 2 ? (
            <ellipse
              key={p.i}
              cx={p.x}
              cy={p.y + 12}
              rx="4.5"
              ry="10"
              transform={`rotate(${(p.ang * 0.6).toFixed(1)} ${p.x} ${p.y})`}
              style={{ fill: 'var(--leaf)' }}
            />
          ) : (
            <g key={p.i}>
              <circle cx={p.x} cy={p.y + 4} r="8" style={{ fill: p.i % 3 === 0 ? 'var(--marigold)' : '#ff7a1a' }} />
              <circle cx={p.x} cy={p.y + 4} r="3" fill="#ffe08a" opacity=".85" />
            </g>
          )
        )}
      </svg>
    </div>
  );
}

export default function Hero({ now, unlockAt }) {
  const frame = useRef(null);

  // The arch frame leans toward the mouse.
  const tilt = (e) => {
    const el = frame.current;
    if (!el || e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${px * 14}deg) rotateX(${-py * 12}deg)`;
  };
  const untilt = () => {
    if (frame.current) frame.current.style.transform = '';
  };

  // Before the end of Nov 1 this is "today" (this also covers the ?preview test before the date).
  const today = now < unlockAt + 86400000;

  return (
    <header className="hero">
      <div className="in">
        <div>
          <p className="date">November 1</p>
          <h1>
            <span className="hb">Happy Birthday</span>
            <span className="nm">{CONFIG.name}</span>
          </h1>
          <p className="ta">Wishing you a day as warm as the love you have given us.</p>
          <p className="lead">To our dear teacher, who has been a mom to all of us.</p>

          <p className="count-msg">
            {today ? 'Today is your birthday, Mam!' : 'Your birthday was on November 1.'}
            <small>
              {today ? 'We hope your whole day is as special as you are.' : 'We are grateful for you every day, Mam.'}
            </small>
          </p>

          <button className="btn" type="button" onClick={() => burst(150)}>
            Shower flowers
          </button>
        </div>

        <figure className="arch" onPointerMove={tilt} onPointerLeave={untilt}>
          <div className="rim tiltable" ref={frame}>
            <div className="slot" data-filled={CONFIG.mamPhoto ? 'image' : undefined}>
              {CONFIG.mamPhoto ? (
                <img src={CONFIG.mamPhoto} alt={CONFIG.name} />
              ) : (
                <div className="pick">
                  <span className="ph">
                    <em>
                      <b>{CONFIG.name}</b>
                      Add her photo in src/config.js
                    </em>
                  </span>
                </div>
              )}
            </div>
          </div>
          <figcaption className="plaque">{CONFIG.name}</figcaption>
        </figure>
      </div>
    </header>
  );
}
