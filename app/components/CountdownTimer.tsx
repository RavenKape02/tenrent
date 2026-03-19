'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { getNow, subscribe } from '../lib/nowTicker';

export default function CountdownTimer({ endIso }: { endIso: string }) {
  const endMs = useMemo(() => {
    const t = new Date(endIso).getTime();
    return Number.isFinite(t) ? t : null;
  }, [endIso]);

  const now = useSyncExternalStore(subscribe, getNow);

  // If the time is invalid, show a stable fallback (no need to re-render).
  if (endMs == null) return <span>Ended</span>;

  const msRemaining = endMs - now;

  const formatted = useMemo(() => {
    if (msRemaining <= 0) return 'Ended';

    const totalSeconds = Math.floor(msRemaining / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));

    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    const pad2 = (n: number) => String(n).padStart(2, '0');

    if (days >= 1) {
      // days hrs mins (no seconds)
      return `${days}d ${hours}h ${minutes}m`;
    }

    // hrs mins secs (no days)
    return `${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`;
  }, [msRemaining]);

  return <span>{formatted}</span>;
}

