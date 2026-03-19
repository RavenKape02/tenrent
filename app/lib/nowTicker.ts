let now = Date.now();
const listeners = new Set<() => void>();
let intervalId: number | undefined;

function start() {
  if (intervalId != null) return;
  intervalId = window.setInterval(() => {
    now = Date.now();
    for (const l of listeners) l();
  }, 1000);
}

export function getNow() {
  return now;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  // In Next.js, this module is only used from client components.
  // Guard just in case it is imported in a non-browser environment.
  if (typeof window !== 'undefined') start();
  return () => listeners.delete(listener);
}

