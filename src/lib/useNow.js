import { useEffect, useState } from 'react';

// Returns the current time in ms and updates every `interval` ms.
export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(t);
  }, [interval]);
  return now;
}

export const pad = (n) => (n < 10 ? '0' + n : String(n));
