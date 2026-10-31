// A tiny event bus so any component can throw petals/confetti.
const bus = new EventTarget();

export function burst(n = 120) {
  bus.dispatchEvent(new CustomEvent('burst', { detail: n }));
}

export function onBurst(fn) {
  const handler = (e) => fn(e.detail);
  bus.addEventListener('burst', handler);
  return () => bus.removeEventListener('burst', handler);
}
