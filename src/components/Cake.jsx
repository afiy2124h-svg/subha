import { useEffect, useRef, useState } from 'react';
import { burst } from '../lib/burst.js';
import { birthdayTune, pop } from '../lib/sound.js';

const X = [104, 132, 160, 188, 216];
const STICK = ['#e8436f', '#1d9a6c', '#6a5acd', '#1d9a6c', '#e8436f'];

export default function Cake() {
  const [lit, setLit] = useState([true, true, true, true, true]);
  const [tune, setTune] = useState(false);
  const [mic, setMic] = useState('idle'); // idle | listening | denied | unsupported
  const stopMic = useRef(null);
  const litRef = useRef(lit);
  litRef.current = lit;

  const left = lit.filter(Boolean).length;

  // Throw confetti when the last flame goes out.
  const prevLeft = useRef(5);
  useEffect(() => {
    if (left === 0 && prevLeft.current > 0) burst(170);
    prevLeft.current = left;
  }, [left]);

  const blow = (i) => {
    setLit((a) => {
      if (!a[i]) return a;
      const b = a.slice();
      b[i] = false;
      return b;
    });
    pop();
  };

  const blowAll = () => {
    litRef.current.forEach((on, i) => {
      if (on) setTimeout(() => blow(i), i * 160);
    });
  };

  const relight = () => setLit([true, true, true, true, true]);

  const play = () => {
    const ms = birthdayTune();
    if (!ms) return;
    setTune(true);
    setTimeout(() => setTune(false), ms + 200);
  };

  // Blow into the microphone and the candles go out one by one.
  const listen = async () => {
    if (mic === 'listening') {
      stopMic.current && stopMic.current();
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMic('unsupported');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AC = window.AudioContext || window.webkitAudioContext;
      const ctx = new AC();
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      const data = new Uint8Array(an.fftSize);
      let raf = 0;
      let strong = 0;
      const stop = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        ctx.close();
        stopMic.current = null;
        setMic('idle');
      };
      stopMic.current = stop;
      setMic('listening');
      const tick = () => {
        an.getByteTimeDomainData(data);
        let peak = 0;
        for (let i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i] - 128));
        strong = peak > 60 ? strong + 1 : Math.max(0, strong - 1);
        if (strong > 5) {
          strong = 0;
          const i = litRef.current.findIndex(Boolean);
          if (i >= 0) blow(i);
          if (litRef.current.filter(Boolean).length <= 1) {
            stop();
            return;
          }
        }
        raf = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      setMic('denied');
    }
  };

  useEffect(() => () => stopMic.current && stopMic.current(), []);

  const status =
    left === 0
      ? 'All the candles are out. Make your wish, Mam. May it come true!'
      : left === 5
      ? 'Five candles are lit. Tap each flame, or blow into your microphone.'
      : `${left} ${left === 1 ? 'candle is' : 'candles are'} still lit. Keep going!`;

  return (
    <section className="cake-sec" id="cake">
      <div className="in">
        <div className="head">
          <p className="eyebrow">Make a wish</p>
          <h2>Blow out the candles, Mam</h2>
        </div>
        <div className="cake-wrap">
          <svg className="cake-svg" viewBox="0 34 320 238" role="img" aria-label="A birthday cake with five candles" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="160" cy="252" rx="140" ry="14" style={{ fill: 'var(--line)' }} />
            <rect x="40" y="170" width="240" height="78" rx="12" style={{ fill: 'var(--kumkum)' }} />
            <path d="M40 170 H280 V184 Q260 204 240 184 Q220 204 200 184 Q180 204 160 184 Q140 204 120 184 Q100 204 80 184 Q60 204 40 184 Z" style={{ fill: 'var(--surface)' }} />
            {[70, 115, 160, 205, 250].map((x) => (
              <circle key={x} cx={x} cy="226" r="5" style={{ fill: 'var(--marigold)' }} />
            ))}
            <rect x="80" y="110" width="160" height="62" rx="10" style={{ fill: 'var(--marigold)' }} />
            <path d="M80 110 H240 V122 Q225 140 210 122 Q195 140 180 122 Q165 140 150 122 Q135 140 120 122 Q105 140 90 122 H80 Z" style={{ fill: 'var(--surface)' }} />
            {X.map((x, i) => (
              <g key={x}>
                <rect x={x - 4} y="82" width="8" height="30" rx="2" fill={STICK[i]} />
                <line x1={x} y1="78" x2={x} y2="82" stroke="#5a4048" strokeWidth="1.5" />
              </g>
            ))}
            {X.map((x, i) => (
              <g
                key={x}
                className={'flame' + (lit[i] ? '' : ' out')}
                tabIndex={lit[i] ? 0 : -1}
                role="button"
                aria-label={`Blow out candle ${i + 1}`}
                onClick={() => blow(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    blow(i);
                  }
                }}
              >
                <circle className="halo" cx={x} cy="64" r="17" fill="transparent" />
                <path d={`M${x} 46 C${x + 9} 58 ${x + 8} 72 ${x} 77 C${x - 8} 72 ${x - 9} 58 ${x} 46 Z`} fill="#ffb52e" />
                <ellipse cx={x} cy="66" rx="3.2" ry="6" fill="#fff3b0" />
              </g>
            ))}
          </svg>

          <div>
            <p className="status" aria-live="polite">{status}</p>
            <div className="row">
              <button className="btn" type="button" onClick={listen}>
                {mic === 'listening' ? 'Listening... blow now' : 'Blow with your breath'}
              </button>
              <button className="btn2" type="button" onClick={blowAll}>Blow them all</button>
              <button className="btn2" type="button" onClick={relight}>Light them again</button>
              <button className="btn2" type="button" onClick={play} disabled={tune}>
                {tune ? 'Playing...' : 'Play a little tune'}
              </button>
            </div>
            {mic === 'denied' && <p className="fine">The microphone was not allowed. You can still tap the flames.</p>}
            {mic === 'unsupported' && <p className="fine">This browser cannot use the microphone. You can still tap the flames.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
