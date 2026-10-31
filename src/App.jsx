import { useEffect, useState } from 'react';
import { CONFIG } from './config.js';
import { burst } from './lib/burst.js';
import { useNow } from './lib/useNow.js';
import Lock from './components/Lock.jsx';
import Hero, { Garland } from './components/Hero.jsx';
import Cake from './components/Cake.jsx';
import { Things, Letter, Facts } from './components/Static.jsx';
import { Wall, Video } from './components/Media.jsx';
import { Balloons, Flips, Memory } from './components/Games.jsx';
import Wishes from './components/Wishes.jsx';
import { Finale, Music } from './components/Finale.jsx';
import { Petals, StickerTrail } from './components/Effects.jsx';

const birthdayAt = new Date(CONFIG.birthdayDate).getTime();
const params = new URLSearchParams(window.location.search);
// Add ?preview to the address to see the lock screen with a "skip" button.
const preview = params.has('preview');
const KEY = 'subha-unlocked';

// Once Mam has unlocked it on her device, it stays open there. Add ?reset to lock it again.
function wasUnlocked() {
  try {
    if (params.has('reset') || !CONFIG.rememberUnlock) localStorage.removeItem(KEY);
    return CONFIG.rememberUnlock && !preview && localStorage.getItem(KEY) === '1';
  } catch (e) {
    return false;
  }
}

export default function App() {
  const now = useNow(60000);
  const alreadyOpen = !CONFIG.lockEnabled || wasUnlocked();
  const [open, setOpen] = useState(alreadyOpen);
  const [justOpened, setJustOpened] = useState(false);

  useEffect(() => {
    document.title = open ? `Happy Birthday, ${CONFIG.name}` : 'A surprise for Subha Mam';
  }, [open]);

  const handleOpen = () => {
    try { if (!preview && CONFIG.rememberUnlock) localStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ }
    setOpen(true);
    setJustOpened(true);
    window.scrollTo(0, 0);
    setTimeout(() => burst(220), 250);
  };

  // If the page is already unlocked on load, give a small welcome shower.
  useEffect(() => {
    if (alreadyOpen) {
      const t = setTimeout(() => burst(90), 600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  return (
    <>
      <Petals />
      <StickerTrail />
      <Music autoStart={justOpened} />

      {!open && <Lock preview={preview} onOpen={handleOpen} />}

      {open && (
        <main className={justOpened ? 'reveal-in' : ''}>
          <Garland />
          <Hero now={now} unlockAt={birthdayAt} />
          <Things />
          <Cake />
          <Letter />
          <Facts />
          <Wall />
          <Video />
          <Balloons />
          <Flips />
          <Memory />
          <Wishes />
          <Finale />
        </main>
      )}
    </>
  );
}
