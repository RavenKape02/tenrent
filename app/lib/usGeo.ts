import { State } from 'country-state-city';

const US = 'US';

/** Map stored listing state (e.g. "NY" or "New York") to 2-letter code for pickers. */
export function normalizeStoredState(stored: string): string {
  const t = stored.trim();
  if (!t) return '';
  const states = State.getStatesOfCountry(US);
  const upper = t.toUpperCase();
  if (upper.length === 2 && states.some((s) => s.isoCode === upper)) {
    return upper;
  }
  const byName = states.find((s) => s.name.toLowerCase() === t.toLowerCase());
  return byName?.isoCode ?? (upper.length >= 2 ? upper.slice(0, 2) : t);
}

export function stateLabelFromCode(isoCode: string): string {
  const s = State.getStatesOfCountry(US).find((x) => x.isoCode === isoCode);
  return s ? `${s.name} (${s.isoCode})` : isoCode;
}
