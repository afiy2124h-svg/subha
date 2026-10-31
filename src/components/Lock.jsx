import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config.js';
import { useNow, pad } from '../lib/useNow.js';
import { chime, pop } from '../lib/sound.js';

const WRONG = [
  'That is not the one, Mam. Try again.',
  'Hmm, not quite. Think of the day you were born.',
  'Almost there, Mam. Check the day, month and year.',
];

const BALLOONS = [
  { left: '8%', c: '#e8436f', d: 0, s: 54 },
  { left: '22%', c: '#f0a000', d: 2.2, s: 44 },
  { left: '38%', c: '#1d9a6c', d: 4.1, s: 50 },
  { left: '58%', c: '#6a5acd', d: 1.3, s: 46 },
  { left: '74%', c: '#ff7a1a', d: 3.2, s: 56 },
  { left: '90%', c: '#d81b60', d: 5, s: 42 },
];

export default function Lock({ preview, onOpen }) {
  const now = useNow(1000);
  const notBefore = CONFIG.notBefore ? new Date(CONFIG.notBefore).getTime() : 0;
  const left = Math.max(0, notBefore - now);

  const [dd, setDd] = useState('');
  const [mm, setMm] = useState('');
  const [yy, setYy] = useState('');
  const [tries, setTries] = useState(0);
  const [msg, setMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [verified, setVerified] = useState(false);
  const [opening, setOpening] = useState(false);
  const openedRef = useRef(false);
  const mmRef = useRef(null);
  const yyRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const open = () => {
    if (openedRef.current) return;
    openedRef.current = true;
    setOpening(true);
    chime([523, 659, 784, 1047], 0.13);
    setTimeout(onOpen, 2300);
  };

  // Right birthday entered, and (if set) the opening date has arrived.
  useEffect(() => {
    if (verified && left <= 0) open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verified, left]);

  const onlyDigits = (v, max) => v.replace(/\D/g, '').slice(0, max);

  const submit = (e) => {
    e.preventDefault();
    if (opening || verified) return;
    const d = Number(dd);
    const m = Number(mm);
    const y = Number(yy);
    const { day, month, year } = CONFIG.dob;
    if (d === day && m === month && y === year) {
      setMsg('');
      setVerified(true);
      return;
    }
    pop();
    setShake(true);
    setTries((t) => t + 1);
    setMsg(WRONG[tries % WRONG.length]);
  };

  const waiting = verified && left > 0 && !opening;
  const cd = Math.floor(left / 86400000);
  const ch = Math.floor((left % 86400000) / 3600000);
  const cm = Math.floor((left % 3600000) / 60000);
  const cs = Math.floor((left % 60000) / 1000);

  const heading = opening
    ? 'Correct! Happy Birthday, Mam!'
    : waiting
    ? 'That is right, Mam! Your surprise opens on your birthday.'
    : 'Only you can open this, Mam. Enter your date of birth.';

  return (
    <div className={'lock' + (opening ? ' opening' : '')} role="dialog" aria-label="Locked. Enter the date of birth to open.">
      <div className="half hl" />
      <div className="half hr" />
      {BALLOONS.map((b, i) => (
        <span
          key={i}
          className="lb"
          style={{ left: b.left, '--c': b.c, animationDelay: `-${b.d}s`, width: b.s, height: b.s * 1.25 }}
          aria-hidden="true"
        />
      ))}

      <div className="lock-core">
        <p className="eyebrow">A surprise for</p>
        <h1 className="lock-name">{CONFIG.name}</h1>

        <div className={'padlock' + (opening || verified ? ' unlocked' : '')} aria-hidden="true">
          <svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
            <path className="shackle" d="M32 70 V46 a28 28 0 0 1 56 0 V70" fill="none" stroke="#d9a441" strokeWidth="10" strokeLinecap="round" />
            <rect x="14" y="66" width="92" height="76" rx="14" fill="#b3123c" />
            <rect x="14" y="66" width="92" height="76" rx="14" fill="none" stroke="#d9a441" strokeWidth="3" />
            <circle cx="60" cy="98" r="9" fill="#3a0f1f" />
            <rect x="56" y="102" width="8" height="20" rx="3" fill="#3a0f1f" />
          </svg>
        </div>

        <p className="tease" aria-live="polite">{heading}</p>

        {!opening && !verified && (
          <form
            className={'dob-form' + (shake ? ' shake' : '')}
            onSubmit={submit}
            onAnimationEnd={() => setShake(false)}
            noValidate
          >
            <div className="dob-row">
              <div className="dob-f">
                <label htmlFor="dob-d">Day</label>
                <input
                  id="dob-d"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="DD"
                  maxLength={2}
                  value={dd}
                  onChange={(e) => {
                    const v = onlyDigits(e.target.value, 2);
                    setDd(v);
                    if (v.length === 2) mmRef.current && mmRef.current.focus();
                  }}
                />
              </div>
              <div className="dob-f">
                <label htmlFor="dob-m">Month</label>
                <input
                  id="dob-m"
                  ref={mmRef}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="MM"
                  maxLength={2}
                  value={mm}
                  onChange={(e) => {
                    const v = onlyDigits(e.target.value, 2);
                    setMm(v);
                    if (v.length === 2) yyRef.current && yyRef.current.focus();
                  }}
                />
              </div>
              <div className="dob-f dob-y">
                <label htmlFor="dob-y">Year</label>
                <input
                  id="dob-y"
                  ref={yyRef}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="YYYY"
                  maxLength={4}
                  value={yy}
                  onChange={(e) => setYy(onlyDigits(e.target.value, 4))}
                />
              </div>
            </div>
            <button className="btn" type="submit" disabled={!dd || !mm || yy.length < 4}>
              Unlock
            </button>
            <p className="dob-msg" role="status">{msg}</p>
            {tries >= 2 && CONFIG.dobHint && <p className="fine">{CONFIG.dobHint}</p>}
          </form>
        )}

        {waiting && (
          <>
            <p className="count-label">Opens in</p>
            <div className="count" role="timer">
              <div className="unit"><b>{cd}</b><span>days</span></div>
              <div className="unit"><b>{pad(ch)}</b><span>hours</span></div>
              <div className="unit"><b>{pad(cm)}</b><span>minutes</span></div>
              <div className="unit"><b>{pad(cs)}</b><span>seconds</span></div>
            </div>
          </>
        )}

        {preview && !opening && (
          <>
            <button className="btn2" type="button" onClick={open}>Preview: skip the lock</button>
            <p className="fine">This button shows only because the address has ?preview in it.</p>
          </>
        )}
      </div>
    </div>
  );
}
