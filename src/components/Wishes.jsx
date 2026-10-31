import { useEffect, useState } from 'react';
import { CONFIG } from '../config.js';
import { burst } from '../lib/burst.js';
import { chime } from '../lib/sound.js';
import { Reveal } from './Effects.jsx';

const BASE = [
  { name: 'Your students', text: 'You taught us more than lessons. You taught us how to live.' },
  { name: 'Your students', text: 'Mam, you believed in us even when we doubted ourselves. Thank you.' },
  { name: 'Your students', text: 'Your strictness always came from care. We understand that now.' },
  { name: 'Your students', text: 'Stay happy and healthy, Mam. You will always be our mom.' },
  { name: 'Your students', text: 'May you live a hundred happy and healthy years.' },
  { name: 'Your students', text: 'Happy Birthday, Mam. Thank you for everything. We love you.' },
];

const KEY = 'subha-wishes';

export default function Wishes() {
  const [mine, setMine] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  });
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(mine)); } catch (e) { /* ignore */ }
  }, [mine]);

  const submit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setMine((m) => [{ name: name.trim() || 'Someone who loves you', text: t.slice(0, 280) }, ...m]);
    setText('');
    chime([784, 988, 1175], 0.1);
    burst(60);
  };

  const all = [...mine.map((w) => ({ ...w, mine: true })), ...CONFIG.wishes, ...BASE];

  return (
    <section className="wish-sec" id="wishes">
      <Reveal className="in">
        <div className="head">
          <p className="eyebrow">Wishes</p>
          <h2>Wishes from the heart</h2>
          <p className="sub">Write your own wish for Mam and it lands on the wall.</p>
        </div>

        <form className="wish-form" onSubmit={submit}>
          <label htmlFor="wname" className="sr">Your name</label>
          <input id="wname" type="text" placeholder="Your name (optional)" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />
          <label htmlFor="wtext" className="sr">Your wish</label>
          <textarea id="wtext" rows={3} placeholder="Write your wish for Mam..." maxLength={280} value={text} onChange={(e) => setText(e.target.value)} />
          <div className="wf-row">
            <span className="fine">{text.length} / 280</span>
            <button className="btn" type="submit" disabled={!text.trim()}>Add my wish</button>
          </div>
        </form>
        <p className="fine">Wishes you write here are saved in this browser only. To show a wish to everyone, add it to the wishes list in src/config.js.</p>

        <div className="cards">
          {all.map((w, i) => (
            <blockquote className={'card' + (w.mine ? ' mine' : '')} key={i} style={{ '--tilt': `${((i * 7) % 5) - 2}deg` }}>
              <p>{w.text}</p>
              <footer className="by">{w.name}</footer>
            </blockquote>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
