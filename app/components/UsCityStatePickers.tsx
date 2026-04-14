'use client';

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { City, State } from 'country-state-city';
import { stateLabelFromCode } from '../lib/usGeo';

const US = 'US';
const MAX_CITY_RESULTS = 200;

type Props = {
  city: string;
  stateCode: string;
  onCityChange: (city: string) => void;
  onStateChange: (stateCode: string) => void;
};

function useDismissOnOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  open: boolean,
  setOpen: (v: boolean) => void,
) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, ref, setOpen]);
}

export function UsCityStatePickers({
  city,
  stateCode,
  onCityChange,
  onStateChange,
}: Props) {
  const states = useMemo(
    () => [...State.getStatesOfCountry(US)].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const usCities = useMemo(() => City.getCitiesOfCountry(US) ?? [], []);

  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [stateQuery, setStateQuery] = useState('');

  const stateWrapRef = useRef<HTMLDivElement>(null);
  const cityWrapRef = useRef<HTMLDivElement>(null);
  useDismissOnOutsideClick(stateWrapRef, stateOpen, setStateOpen);
  useDismissOnOutsideClick(cityWrapRef, cityOpen, setCityOpen);

  const filteredStates = useMemo(() => {
    const q = stateQuery.trim().toLowerCase();
    if (!q) return states;
    return states.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.isoCode.toLowerCase().includes(q),
    );
  }, [states, stateQuery]);

  /** Suggestions follow the city text field (combobox); you can submit any city string. */
  const cityOptions = useMemo(() => {
    const q = city.trim().toLowerCase();
    let pool = stateCode
      ? usCities.filter((c) => c.stateCode === stateCode)
      : usCities;

    if (stateCode) {
      if (q) pool = pool.filter((c) => c.name.toLowerCase().includes(q));
      pool = pool.slice(0, MAX_CITY_RESULTS);
    } else {
      if (q.length < 2) return [];
      pool = pool.filter((c) => c.name.toLowerCase().includes(q));
      pool = pool.slice(0, MAX_CITY_RESULTS);
    }

    return pool.map((c, idx) => ({
      key: `${c.name}-${c.stateCode}-${idx}`,
      name: c.name,
      stateCode: c.stateCode,
      display: `${c.name}, ${c.stateCode}`,
    }));
  }, [usCities, stateCode, city]);

  const pickState = useCallback(
    (iso: string) => {
      onStateChange(iso);
      if (city) {
        const stillValid = usCities.some(
          (c) => c.name === city && c.stateCode === iso,
        );
        if (!stillValid) {
          onCityChange('');
        }
      }
      setStateQuery('');
      setStateOpen(false);
    },
    [city, onCityChange, onStateChange, usCities],
  );

  const pickCity = useCallback(
    (name: string, st: string) => {
      onCityChange(name);
      onStateChange(st);
      setCityOpen(false);
    },
    [onCityChange, onStateChange],
  );

  return (
    <div className="space-y-2">
      <p className="ds-small text-white/50">
        United States only. Pick a state first to narrow suggestions, or type any city (including villages
        and territories) if it is not in the list.
      </p>
      <div className="grid grid-cols-1 min-w-0 gap-4 sm:grid-cols-2">
        {/* State */}
        <div ref={stateWrapRef} className="relative min-w-0">
          <label className="ds-input-label">State *</label>
          <button
            type="button"
            onClick={() => {
              setStateOpen((o) => !o);
              setCityOpen(false);
            }}
            className="ds-input flex w-full items-center justify-between gap-2 text-left cursor-pointer"
          >
            <span className={stateCode ? 'text-white' : 'text-white/40'}>
              {stateCode ? stateLabelFromCode(stateCode) : 'Select state'}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-white/50" />
          </button>
          {stateOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/15 bg-[#0b1320] shadow-xl overflow-hidden">
              <input
                type="text"
                value={stateQuery}
                onChange={(e) => setStateQuery(e.target.value)}
                placeholder="Search state…"
                className="w-full border-b border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-1 focus:ring-cyan-500/40"
                autoFocus
              />
              <ul className="max-h-56 overflow-y-auto py-1">
                {filteredStates.map((s) => (
                  <li key={s.isoCode}>
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm text-white/90 hover:bg-white/10"
                      onClick={() => pickState(s.isoCode)}
                    >
                      {s.name} ({s.isoCode})
                    </button>
                  </li>
                ))}
                {filteredStates.length === 0 && (
                  <li className="px-3 py-2 text-sm text-white/50">No matches</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* City — one bordered row (matches State); .ds-input width:100% breaks flex split */}
        <div ref={cityWrapRef} className="relative min-w-0">
          <label className="ds-input-label">City *</label>
          <div
            className={[
              'flex h-10 w-full min-w-0 items-stretch overflow-hidden rounded-[var(--ds-radius-sm)]',
              'border border-[var(--ds-container-border)] bg-[rgba(255,255,255,0.05)]',
              'transition-[border-color,box-shadow] duration-200',
              cityOpen
                ? 'border-cyan-400/50 shadow-[0_0_0_3px_rgba(34,211,238,0.1)]'
                : 'focus-within:border-cyan-400/50 focus-within:shadow-[0_0_0_3px_rgba(34,211,238,0.1)]',
            ].join(' ')}
          >
            <input
              type="text"
              required
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              onFocus={() => {
                setCityOpen(true);
                setStateOpen(false);
              }}
              placeholder={
                stateCode
                  ? `City`
                  : 'City'
              }
              className="min-w-0 flex-1 basis-0 border-0 bg-transparent px-3 text-sm leading-5 text-[var(--ds-fg-primary)] outline-none placeholder:text-[var(--ds-fg-tertiary)]"
            />
            <button
              type="button"
              aria-expanded={cityOpen}
              aria-label="Toggle city suggestions"
              onClick={() => {
                setCityOpen((o) => !o);
                setStateOpen(false);
              }}
              className="flex w-10 shrink-0 cursor-pointer items-center justify-center border-l border-[var(--ds-container-border)] text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          {cityOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/15 bg-[#0b1320] shadow-xl overflow-hidden">
              <ul className="max-h-56 overflow-y-auto py-1">
                {cityOptions.map((opt) => (
                  <li key={opt.key}>
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm text-white/90 hover:bg-white/10"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickCity(opt.name, opt.stateCode)}
                    >
                      {opt.display}
                    </button>
                  </li>
                ))}
                {cityOptions.length === 0 && (
                  <li className="px-3 py-2 text-sm text-white/50">
                    {stateCode
                      ? city.trim()
                        ? 'No matches in our list — keep typing your city above'
                        : 'No cities in our directory for this state/territory — type your city above'
                      : city.trim().length < 2
                        ? 'Type at least 2 letters for US-wide suggestions, or pick a state first'
                        : 'No matches in our list — keep typing your city above'}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
