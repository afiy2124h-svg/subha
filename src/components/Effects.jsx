import { useEffect, useRef } from 'react';
import { onBurst } from '../lib/burst.js';
import { CONFIG } from '../config.js';

const COLORS = ['#f0a000', '#ff7a1a', '#d81b60', '#ffd54a', '#e8436f', '#1d9a6c'];

/* Falling flower petals on a full-screen canvas. Any component can call burst(n). */
export function Petals() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let petals = [];
    let raf = 0;
    let clearTimer = 0;

    const size = () => {
      const r = window.devicePixelRatio || 1;
      cv.width = Math.round(innerWidth * r);
      cv.height = Math.round(innerHeight * r);
      ctx.setTransform(r, 0, 0, r, 0, 0);
    };
    size();
    window.addEventListener('resize', size);

    const draw = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.cos(p.sw)));
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, 6.2832);
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      petals = petals.filter((p) => p.y < innerHeight + 30);
      for (const p of petals) {
        p.y += p.vy;
        p.sw += p.swS;
        p.x += Math.sin(p.sw) * p.amp;
        p.rot += p.vr;
        draw(p);
      }
      if (petals.length) raf = requestAnimationFrame(loop);
      else {
        raf = 0;
        ctx.clearRect(0, 0, innerWidth, innerHeight);
      }
    };

    const off = onBurst((n) => {
      for (let i = 0; i < n; i++) {
        petals.push({
          x: Math.random() * innerWidth,
          y: reduce ? Math.random() * innerHeight : -20 - Math.random() * innerHeight * 0.7,
          vy: 1.2 + Math.random() * 2.2,
          sw: Math.random() * 6.28,
          swS: 0.02 + Math.random() * 0.03,
          amp: 0.5 + Math.random() * 1.2,
          rot: Math.random() * 6.28,
          vr: (Math.random() - 0.5) * 0.08,
          s: 6 + Math.random() * 7,
          c: COLORS[(Math.random() * COLORS.length) | 0],
        });
      }
      if (reduce) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        petals.forEach(draw);
        clearTimeout(clearTimer);
        clearTimer = setTimeout(() => {
          petals = [];
          ctx.clearRect(0, 0, innerWidth, innerHeight);
        }, 2500);
        return;
      }
      if (!raf) raf = requestAnimationFrame(loop);
    });

    return () => {
      off();
      cancelAnimationFrame(raf);
      clearTimeout(clearTimer);
      window.removeEventListener('resize', size);
    };
  }, []);

  return <canvas id="petals" ref={ref} aria-hidden="true" />;
}

const SMILEY =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='#ffcf5a'/>" +
      "<circle cx='34' cy='46' r='5' fill='#3a0f1f'/><circle cx='66' cy='46' r='5' fill='#3a0f1f'/>" +
      "<path d='M30 63 Q50 83 70 63' stroke='#3a0f1f' stroke-width='5' fill='none' stroke-linecap='round'/>" +
      "<circle cx='50' cy='28' r='4.5' fill='#b3123c'/></svg>"
  );

/* Hold the mouse button and drag: little round photos of Mam are left behind. */
export function StickerTrail() {
  const layer = useRef(null);

  useEffect(() => {
    const el = layer.current;
    const src = CONFIG.mamSticker || CONFIG.mamPhoto || SMILEY;
    let dragging = false;
    let lx = 0;
    let ly = 0;

    const drop = (x, y) => {
      if (el.childElementCount > 60) return;
      const s = document.createElement('span');
      const im = document.createElement('img');
      s.className = 'stk';
      im.alt = '';
      im.src = src;
      s.appendChild(im);
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--r', Math.random() * 30 - 15 + 'deg');
      s.addEventListener('animationend', () => s.remove());
      el.appendChild(s);
    };
    const end = () => {
      dragging = false;
      document.body.classList.remove('dragging');
    };
    const down = (e) => {
      if (e.pointerType === 'touch' || e.button !== 0) return;
      if (e.target.closest && e.target.closest('video,input,textarea,button,a,label')) return;
      dragging = true;
      lx = e.clientX;
      ly = e.clientY;
      document.body.classList.add('dragging');
      drop(lx, ly);
    };
    const move = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      if (dx * dx + dy * dy >= 900) {
        lx = e.clientX;
        ly = e.clientY;
        drop(lx, ly);
      }
    };

    document.addEventListener('pointerdown', down);
    document.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    window.addEventListener('blur', end);
    return () => {
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      window.removeEventListener('blur', end);
    };
  }, []);

  return <div id="stickers" ref={layer} aria-hidden="true" />;
}

/* Fades a section in as it scrolls into view. Always becomes visible after 2.5s as a fallback. */
export function Reveal({ children, className = '', as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  const shown = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const show = () => {
      shown.current = true;
      el.classList.add('rv-on');
    };
    if (!('IntersectionObserver' in window)) {
      show();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    const t = setTimeout(show, 2500);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <Tag ref={ref} className={'rv ' + className} {...rest}>
      {children}
    </Tag>
  );
}
