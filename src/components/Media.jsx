import { useCallback, useEffect, useState } from 'react';
import { CONFIG } from '../config.js';
import { Reveal } from './Effects.jsx';

// Four frames on the wall. The main arch frame at the top is the fifth.
const SHAPES = ['land r1', 'port r2', 'land r3', 'wide r4'];

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

function Lightbox({ items, index, onClose, onGo }) {
  const it = items[index];

  useEffect(() => {
    const key = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onGo(1);
      if (e.key === 'ArrowLeft') onGo(-1);
    };
    window.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = '';
    };
  }, [onClose, onGo]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={it.src} alt={it.caption || 'Memory photo'} />
        {it.caption && <figcaption>{it.caption}</figcaption>}
        <p className="lb-count">{index + 1} of {items.length}</p>
      </figure>
      {items.length > 1 && (
        <>
          <button className="lb-btn lb-prev" type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); onGo(-1); }}>&#8249;</button>
          <button className="lb-btn lb-next" type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); onGo(1); }}>&#8250;</button>
        </>
      )}
      <button className="lb-btn lb-close" type="button" aria-label="Close" onClick={onClose}>&times;</button>
    </div>
  );
}

export function Wall() {
  const photos = CONFIG.photos.slice(0, SHAPES.length);
  const [open, setOpen] = useState(-1);
  const close = useCallback(() => setOpen(-1), []);
  const go = useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), [photos.length]);

  return (
    <section className="wall-sec">
      <Reveal className="in">
        <div className="head">
          <p className="eyebrow">Photos</p>
          <h2>Wall of memories</h2>
          {photos.length > 0 && <p className="sub">Tap a photo to see it bigger.</p>}
        </div>
        <div className="wall">
          {SHAPES.map((shape, i) => {
            const p = photos[i];
            return (
              <figure className={'hang ' + shape} key={i}>
                <div className="frame">
                  <div className="mat">
                    <div className="slot" data-filled={p ? 'image' : undefined}>
                      {p ? (
                        <button type="button" className="slot-btn" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1}`}>
                          <img src={p.src} alt={p.caption || ''} />
                        </button>
                      ) : (
                        <div className="pick">
                          <span className="ph">
                            <CameraIcon />
                            <em>Photo {i + 1}</em>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {p && p.caption && <figcaption className="cap">{p.caption}</figcaption>}
              </figure>
            );
          })}
        </div>
      </Reveal>
      {open >= 0 && photos[open] && <Lightbox items={photos} index={open} onClose={close} onGo={go} />}
    </section>
  );
}

export function Video() {
  // Accept either 'video/file.mp4' or [{ src: 'video/file.mp4' }]
  const raw = Array.isArray(CONFIG.video) ? CONFIG.video[0] && CONFIG.video[0].src : CONFIG.video;
  const videoSrc = raw ? (/^(https?:|\/)/.test(raw) ? raw : import.meta.env.BASE_URL + raw) : '';
  return (
    <section className="vid-sec">
      <Reveal className="in">
        <div className="head">
          <p className="eyebrow">Video</p>
          <h2>A little video for you</h2>
        </div>
        <figure className="cine">
          <div className="frame">
            <div className="mat">
              <div className="slot" data-filled={videoSrc ? 'video' : undefined}>
                {videoSrc ? (
                  <video src={videoSrc} controls playsInline preload="auto" />
                ) : (
                  <div className="pick">
                    <span className="ph">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9.5" />
                        <path d="M10 8.5v7l6-3.5z" fill="currentColor" />
                      </svg>
                      <em><b>Birthday video</b>Add it in src/config.js</em>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </figure>
      </Reveal>
    </section>
  );
}
